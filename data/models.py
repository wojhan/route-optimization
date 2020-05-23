from datetime import datetime

from celery.result import AsyncResult
from django.contrib import auth
from django.db import models
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.utils.functional import cached_property

from data import utils


class CompanyMixin(models.Model):
    name = models.CharField(max_length=300, verbose_name='nazwa pełna')
    nip = models.CharField(max_length=11, verbose_name='nip', unique=True)
    street = models.CharField(max_length=60, verbose_name='ulica', blank=True)
    house_no = models.CharField(max_length=10, verbose_name='numer budynku')
    postcode = models.CharField(max_length=8, verbose_name='kod pocztowy')
    city = models.CharField(max_length=40, verbose_name='miasto')
    voivodeship = models.CharField(max_length=20, verbose_name='województwo')
    latitude = models.FloatField(
        verbose_name='szerokość geograficzna', null=True)
    longitude = models.FloatField(
        verbose_name='długość geograficzna', null=True)

    @staticmethod
    def autocomplete_search_fields():
        return ('name__icontains', 'street__icontains', 'city__iexact')

    class Meta:
        abstract = True


class Profile(models.Model):
    user = models.OneToOneField(
        auth.get_user_model(), related_name="profile", on_delete=models.CASCADE)

    @property
    def total_business_trips(self):
        return self.business_trips.count()

    @property
    def visited_companies(self):
        visited = 0
        business_trips = self.business_trips.filter(
            finish_date__lt=datetime.now())

        for business_trip in business_trips:
            visited += business_trip.requistions.count()

        return visited

    @property
    def total_distance(self):
        distance = 0
        business_trips = self.business_trips.filter(
            finish_date__lt=datetime.now())

        for business_trip in business_trips:
            distance += business_trip.distance

        return distance

    @staticmethod
    def autocomplete_search_fields():
        return ('user__username__icontains', 'user__first_name__icontains', 'user__last_name__icontains')

    def __str__(self):
        return self.user.first_name + ' ' + self.user.last_name

    class Meta:
        verbose_name = 'profil użytkownika'
        verbose_name_plural = 'profile użytkownika'


class Company(CompanyMixin):
    name_short = models.CharField(
        max_length=250, verbose_name='nazwa skrócona')
    added_by = models.ForeignKey(auth.get_user_model(), verbose_name="dodany przez",
                                 on_delete=models.SET_NULL, related_name="added_companies", default=None, null=True)

    def __str__(self):
        street = 'ul. ' + self.street if self.street != self.city else self.street
        return self.name_short + ', ' + street + ' ' + self.postcode + ' ' + self.city

    class Meta:
        ordering = ['name']
        verbose_name = 'firma'
        verbose_name_plural = 'firmy'


class Hotel(Company):
    # TODO: Change Company inheritance to CompanyMixin
    class Meta:
        verbose_name = 'hotel'
        verbose_name_plural = 'hotele'


class Department(CompanyMixin):
    nip = models.CharField(max_length=11, verbose_name='nip', unique=False)

    class Meta:
        ordering = ["pk"]
        verbose_name = "filia firmy"
        verbose_name_plural = "filie firmy"

class BusinessTrip(models.Model):
    start_date = models.DateTimeField(verbose_name="data rozpoczęcia")
    finish_date = models.DateTimeField(verbose_name="data zakończenia")
    route_version = models.IntegerField(verbose_name="Wersja", default=1)
    distance_constraint = models.IntegerField(
        verbose_name="Maksymalny limit kilometrów jednego dnia")
    assignee = models.ForeignKey(
        auth.get_user_model(), on_delete=models.CASCADE, related_name="business_trips", verbose_name="przypisany",
        null=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name="business_trips",
                                   verbose_name="Punkt startowy i końcowy")
    task_id = models.CharField(max_length=36, null=True, blank=True)
    task_created = models.DateTimeField(verbose_name="data stworzenia zadania", null=True, blank=True)
    task_finished = models.DateTimeField(verbose_name="data zakończenia zadania", null=True, blank=True)

    @property
    def duration(self):
        return (self.finish_date - self.start_date).days + 1

    @property
    def estimated_profit(self):
        profit = 0
        for requistion in self.requistions.all():
            profit += requistion.estimated_profit

        return profit

    @property
    def distance(self):
        distance = 0
        for route in self.get_routes_for_version():
            distance += route.distance
        return distance


    @property
    def is_processed(self):
        if self.task_id is None or self.task_created is None:
            return True

        task = AsyncResult(self.task_id)
        time_diff = datetime.now(self.task_created.tzinfo) - self.task_created

        # If task is stuck for more than one minute, let be false positive
        if task.status == 'PENDING' and time_diff.seconds >= 60:
            return True

        return task.ready()

    def has_error(self):
        if not self.is_processed:
            return None

        if self.task_id is None or self.task_created is None or self.task_finished is None:
            return 1

        if not self.get_routes_for_version():
            return 2

        return None

    def get_routes_for_version(self):
        return self.routes.filter(route_version=self.route_version)

    def __str__(self):
        return self.start_date.strftime("%d-%m-%Y") + " - " + self.finish_date.strftime(
            "%d-%m-%Y") + ', ' + self.assignee.__str__()

    class Meta:
        verbose_name = 'delegacja'
        verbose_name_plural = 'delegacje'


class Requistion(models.Model):
    created_by = models.ForeignKey(auth.get_user_model(), verbose_name="stworzony przez",
                                   on_delete=models.SET_NULL, related_name="created_requistions", default=None, null=True, blank=True)
    estimated_profit = models.FloatField(verbose_name="oszacowany zysk")
    company = models.ForeignKey(
        Company, verbose_name="firma", on_delete=models.CASCADE, related_name="requistions")
    business_trip = models.ForeignKey(
        BusinessTrip, verbose_name="delegacja", on_delete=models.SET_NULL, related_name="requistions", null=True, blank=True)
    assignment_date = models.DateTimeField(
        verbose_name="data przypisania", auto_now=True)

    def __str__(self):
        return self.company.__str__() + " - oszacowany zysk " + str(self.estimated_profit) + " zł"

    class Meta:
        verbose_name = 'zapotrzebowanie'
        verbose_name_plural = 'zapotrzebowania'
        ordering = ['created_by', '-pk']


class Route(models.Model):
    ROUTE_TYPE_CHOICES = [
        ("START", "Początek trasy"),
        ("VISIT", "Odwiedzenie firmy"),
        ("FINISH_AT_DEPOT", "Koniec podtrasy w filii"),
        ("FINISH_AT_HOTEL", "Koniec podtrasy w hotelu"),
        ("START_FROM_DEPOT", "Początek podtrasy w filii"),
        ("START_FROM_HOTEL", "Początek podtrasy w hotelu"),
        ("FINISH", "Koniec trasy")
    ]

    start_point = models.ForeignKey(
        Company, on_delete=models.CASCADE, related_name="+")
    end_point = models.ForeignKey(
        Company, on_delete=models.CASCADE, related_name="+")
    distance = models.FloatField()
    segment_order = models.IntegerField()
    route_version = models.IntegerField(verbose_name="Wersja", default=1)
    day = models.IntegerField()
    business_trip = models.ForeignKey(
        BusinessTrip, on_delete=models.CASCADE, related_name="routes")
    route_type = models.CharField(max_length=20, choices=ROUTE_TYPE_CHOICES, default="VISIT")

    @cached_property
    def days(self):
        return self.business_trip.duration

    def __str__(self):
        return str(self.start_point.pk) + " -> " + str(self.end_point.pk)


@receiver(post_save, sender=BusinessTrip)
def update_websocket(sender, instance: BusinessTrip, created, **kwargs):
    message_type, message = utils.check_business_trip_status(instance)
    utils.update_business_trip_by_ws(instance.pk, message_type, message)

@receiver(post_delete, sender=BusinessTrip)
def delete_websocket(sender, instance, **kwargs):
    utils.update_business_trip_by_ws(instance.pk, "DELETE", "Deleted")
