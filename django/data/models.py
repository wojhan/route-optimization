from django.db import models


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

    class Meta:
        verbose_name_plural = 'companies'
