import math

from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.functional import cached_property


class Profile(models.Model):
    user = models.OneToOneField(
        get_user_model(), related_name="profile", on_delete=models.CASCADE)

    @staticmethod
    def autocomplete_search_fields():
        return ('user__username__icontains', 'user__first_name__icontains', 'user__last_name__icontains')

    def __str__(self):
        return self.user.first_name + ' ' + self.user.last_name

    class Meta:
        verbose_name = 'profil użytkownika'
        verbose_name_plural = 'profile użytkownika'


class Company(models.Model):
    name = models.CharField(max_length=300, verbose_name='nazwa pełna')
    name_short = models.CharField(
        max_length=250, verbose_name='nazwa skrócona')
    nip = models.CharField(max_length=11, verbose_name='nip')
    street = models.CharField(max_length=60, verbose_name='ulica')
    house_no = models.CharField(max_length=10, verbose_name='numer budynku')
    postcode = models.CharField(max_length=6, verbose_name='kod pocztowy')
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
        verbose_name = 'firma'
        verbose_name_plural = 'firmy'


class BusinessTrip(models.Model):
    start_date = models.DateTimeField(verbose_name="data rozpoczęcia")
    finish_date = models.DateTimeField(verbose_name="data zakończenia")
    assignee = models.ForeignKey(
        Profile, on_delete=models.CASCADE, related_name="business_trips", verbose_name="przypisany")

    @cached_property
    def duration(self):
        return (self.finish_date - self.start_date).days

    @property
    def estimated_profit(self):
        profit = 0
        for requistion in self.requistions.all():
            profit += requistion.estimated_profit

        return profit

    def __str__(self):
        return self.start_date.strftime("%d-%m-%Y") + " - " + self.finish_date.strftime("%d-%m-%Y") + ", " + self.assignee.__str__()

    class Meta:
        verbose_name = 'delegacja'
        verbose_name_plural = 'delegacje'


class Requistion(models.Model):
    estimated_profit = models.FloatField(verbose_name="oszacowany zysk")
    company = models.ForeignKey(
        Company, verbose_name="firma", on_delete=models.CASCADE, related_name="requistions")
    business_trip = models.ForeignKey(
        BusinessTrip, verbose_name="delegacja", on_delete=models.SET_NULL, related_name="requistions", null=True)
    assignment_date = models.DateTimeField(
        verbose_name="data przypisania", auto_now=True)

    def __str__(self):
        return self.company.__str__() + " - oszacowany zysk " + str(self.estimated_profit) + " zł"

    class Meta:
        verbose_name = 'zapotrzebowanie'
        verbose_name_plural = 'zapotrzebowania'


@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
    instance.profile.save()
