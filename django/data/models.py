from django.db import models


class Company(models.Model):
    name = models.CharField(max_length=60)
    nip = models.CharField(max_length=10)
    street = models.CharField(max_length=20)
    house_no = models.IntegerField(max_length=3)
    postcode = models.CharField(max_length=6)
    voivodeship = models.CharField(max_length=20)
    latitude = models.FloatField()
    longitude = models.FloatField()
