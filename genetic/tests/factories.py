import factory
import factory.fuzzy
from django.contrib.auth import get_user_model
from django.db.models.signals import post_save

from data.models import BusinessTrip, Company, Hotel, Profile, Requistion
from genetic import utils


@factory.django.mute_signals(post_save)
class EmployeeProfileFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Profile

    user = factory.SubFactory(
        'genetic.tests.EmployeeProfileFactory', profile=None)


@factory.django.mute_signals(post_save)
class EmployeeFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = get_user_model()

    username = 'employee'
    first_name = factory.Faker('first_name')
    last_name = factory.Faker('last_name')
    email = factory.Faker('email')

    profile = factory.RelatedFactory(EmployeeProfileFactory, 'user')


class CompanyFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Company

    name = factory.sequence(lambda n: 'Company %d' % n)
    name_short = factory.sequence(lambda n: 'Company %d' % n)
    nip = factory.sequence(lambda n: 10000000000 + n)
    latitude = factory.fuzzy.FuzzyFloat(52.1647, 54.2437, 7)
    longitude = factory.fuzzy.FuzzyFloat(21.3534, 24.0803, 7)


class HotelFactory(CompanyFactory):
    class Meta:
        model = Hotel


class RequistionFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Requistion

    estimated_profit = factory.fuzzy.FuzzyInteger(10, 200)
    company = factory.SubFactory(CompanyFactory)


class BusinessTripFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = BusinessTrip

    start_date = '2019-12-27 08:00'
    finish_date = '2019-12-28 16:00'
    distance_constraint = factory.fuzzy.FuzzyInteger(50, 400)
