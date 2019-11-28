from django.core.management import call_command
from django.test import TestCase
from data.models import Requistion, Company, BusinessTrip
from django.contrib.auth import get_user_model
from . import utils
import random
# Create your tests here.


class CreatingPopulationTestCase(TestCase):
    requistion_count = 40

    @classmethod
    def setUpTestData(cls):
        call_command('synccompanies')
        user = get_user_model().objects.create(username="test")
        BusinessTrip.objects.create(
            start_date="2019-11-26", finish_date="2019-11-28", assignee=user.profile)
        call_command('generaterandomrequistions', cls.requistion_count)

    def setUp(self):
        self.tmax = 150

    def test_create_data_for_algorithm(self):

        # When the requistions are retrieving
        requistions = Requistion.objects.all()
        # Then There are <requstion_count> requistions in queryset
        self.assertEqual(requistions.count(), self.requistion_count)

    def test_create_population(self):
        requistions = Requistion.objects.all()

        depot_company = Company.objects.get(pk=5)
        depots = [utils.Depot(str(depot_company.pk), dict(
            lat=depot_company.latitude, lng=depot_company.longitude))]

        hotel_companies = (Company.objects.get(pk=2),
                           Company.objects.get(pk=3))
        hotels = [
            utils.Hotel(str(hotel_companies[0].pk), dict(
                lat=hotel_companies[0].latitude, lng=hotel_companies[0].longitude)),
            utils.Hotel(str(hotel_companies[1].pk), dict(lat=hotel_companies[1].latitude, lng=hotel_companies[1].longitude))]

        companies = []
        for requstion in requistions:
            company = utils.Company(str(requstion.company.pk), dict(
                lat=requstion.company.latitude, lng=requstion.company.longitude), requstion.estimated_profit)
            companies.append(company)

        # When depot is set
        # Then depots should contain one depot
        self.assertEqual(len(depots), 1)

        # When hotels are set
        # Then hotels should contain two hotels
        self.assertEqual(len(hotels), 2)

        # When companies are set
        # Then companies should contain <requistion_count> companies
        self.assertEqual(len(companies), self.requistion_count)

        # When route optimizer is being created
        ro = utils.RouteOptimizer(
            depots, companies, hotels, self.tmax)
        # Then it should contain only one population
        self.assertEqual(len(ro.population), 1)

        # When the first population is created
        # Then it should contain <population_quantity> routes
        # And each of route has distance less than tmax
        self.assertEqual(len(ro.population[0]), 200)
        for route in ro.population[0]:
            self.assertLessEqual(route.distance, self.tmax)

        ro.run(1000)

        for population in ro.population:
            for route in population:
                # self.assertGreaterEqual(route.distance, 0)
                self.assertLessEqual(route.distance, self.tmax)

        # When the best route found
        # There are no duplicates
        expected_len_of_route = len(list(set(ro.population[-1][0].route)))
        self.assertEqual(
            len(ro.population[-1][0].route), expected_len_of_route)

        # When the best route found
        # Then its profit and profit's fitness are correct
        expected_profit = 0
        for company in ro.population[-1][0].route:
            expected_profit += company.profit
        print(expected_profit)
        self.assertEqual(ro.population[-1][0].profit, expected_profit)
