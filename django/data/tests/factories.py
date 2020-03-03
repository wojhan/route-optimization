import factory
import factory.fuzzy
import datetime

from data import models
from rest_framework.authtoken import models as authtoken_models
from django.contrib.auth import get_user_model
from django.db.models import signals


def get_user_with_token():
    user = EmployeeFactory()
    token = authtoken_models.Token.objects.get_or_create(user=user)

    return user, token[0].key


def get_inactive_user_with_token():
    user, token = get_user_with_token()
    user.is_active = False
    user.save()

    return user, token


def get_admin_user_with_token():
    user, token = get_user_with_token()
    user.is_staff = True
    user.is_superuser = True
    user.save()

    return user, token


@factory.django.mute_signals(signals.post_save)
class EmployeeProfileFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.Profile

    user = factory.SubFactory(
        'data.tests.factories.EmployeeProfileFactory', profile=None)


@factory.django.mute_signals(signals.post_save)
class EmployeeFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = get_user_model()

    username = factory.sequence(lambda x: 'employee' + str(x))
    first_name = factory.Faker('first_name')
    last_name = factory.Faker('last_name')
    email = factory.Faker('email')

    profile = factory.RelatedFactory(EmployeeProfileFactory, 'user')


class CompanyFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.Company

    name = factory.sequence(lambda n: 'Company %d' % n)
    name_short = factory.sequence(lambda n: 'Company %d' % n)
    nip = factory.sequence(lambda n: 10000000000 + n)
    latitude = factory.fuzzy.FuzzyFloat(52.1647, 54.2437, 7)
    longitude = factory.fuzzy.FuzzyFloat(21.3534, 24.0803, 7)


class HotelFactory(CompanyFactory):
    class Meta:
        model = models.Hotel


class RequisitionFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.Requistion

    estimated_profit = factory.fuzzy.FuzzyInteger(10, 200)
    company = factory.SubFactory(CompanyFactory)


class BusinessTripFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.BusinessTrip

    start_date = datetime.datetime.now() - datetime.timedelta(days=1)
    finish_date = datetime.datetime.now() + datetime.timedelta(days=1)
    distance_constraint = factory.fuzzy.FuzzyInteger(50, 400)
