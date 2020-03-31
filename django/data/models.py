from datetime import datetime

from django.contrib import auth
from django.db import models
from django.utils.functional import cached_property


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


class Company(models.Model):
    added_by = models.ForeignKey(Profile, verbose_name="dodany przez",
                                 on_delete=models.SET_NULL, related_name="added_companies", default=None, null=True)
    name = models.CharField(max_length=300, verbose_name='nazwa pełna')
    name_short = models.CharField(
        max_length=250, verbose_name='nazwa skrócona')
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
        return ('name_short__icontains', 'street__icontains', 'city__iexact')

    def __str__(self):
        street = 'ul. ' + self.street if self.street != self.city else self.street
        return self.name_short + ', ' + street + ' ' + self.postcode + ' ' + self.city

    class Meta:
        ordering = ['name']
        verbose_name = 'firma'
        verbose_name_plural = 'firmy'


class Hotel(Company):

    class Meta:
        verbose_name = 'hotel'
        verbose_name_plural = 'hotele'


class BusinessTrip(models.Model):
    start_date = models.DateTimeField(verbose_name="data rozpoczęcia")
    finish_date = models.DateTimeField(verbose_name="data zakończenia")
    route_version = models.IntegerField(verbose_name="Wersja", default=1)
    distance_constraint = models.IntegerField(
        verbose_name="Maksymalny limit kilometrów jednego dnia")
    assignee = models.ForeignKey(
        Profile, on_delete=models.CASCADE, related_name="business_trips", verbose_name="przypisany", null=True)
    is_processed = models.BooleanField(
        verbose_name="przetworzona", default=False)
    task_id = models.CharField(max_length=36, null=True)

    @cached_property
    def duration(self):
        return (self.finish_date - self.start_date).days + 1

    @property
    def estimated_profit(self):
        profit = 0
        for requistion in self.requistions.all():
            profit += requistion.estimated_profit

        return profit

    def get_routes_for_version(self):
        return self.routes.filter(route_version=self.route_version)

    @cached_property
    def distance(self):
        distance = 0
        for route in self.get_routes_for_version():
            distance += route.distance
        return distance

    def __str__(self):
        return self.start_date.strftime("%d-%m-%Y") + " - " + self.finish_date.strftime(
            "%d-%m-%Y") + ', ' + self.assignee.__str__()

    class Meta:
        verbose_name = 'delegacja'
        verbose_name_plural = 'delegacje'


class Requistion(models.Model):
    created_by = models.ForeignKey(Profile, verbose_name="stworzony przez",
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
        ordering = ['-pk']


class Route(models.Model):
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

    @cached_property
    def days(self):
        return self.business_trip.duration

    def __str__(self):
        return str(self.start_point.pk) + " -> " + str(self.end_point.pk)
