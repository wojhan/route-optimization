import mpu

from django.test import TestCase
from data.models import Company, Requistion
from genetic import utils

from .factories import (BusinessTripFactory, CompanyFactory, EmployeeFactory,
                        RequistionFactory)


class SubRouteTestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        business_trip = BusinessTripFactory()
        user = EmployeeFactory()
        CompanyFactory()
        business_trip.assignee = user.profile
        business_trip.save()

        cls.max_profit = 0

        for i in range(100):
            requistion = RequistionFactory()
            requistion.business_trip = business_trip
            cls.max_profit += requistion.estimated_profit

    def setUp(self):
        company = Company.objects.get(pk=1)
        self.depot = utils.Depot(str(company.pk), dict(
            lat=company.latitude, lng=company.longitude))

    def __count_distance(self, coords_a: tuple, coords_b: tuple) -> float:
        # print(coords_a, coords_b)
        return mpu.haversine_distance(coords_a, coords_b)

    def test_init(self):
        route = [self.depot, self.depot]
        # When subroute is inited
        subroute = utils.SubRoute(route, self.max_profit)
        # Then max profit is equal to <max_profit>
        self.assertEqual(subroute.max_profit, self.max_profit)
        # And distance is equal to 0
        self.assertEqual(subroute.distance, 0)
        # And profit is equal to 0
        self.assertEqual(subroute.profit, 0)
        # And route is equal to <route>
        self.assertEqual(subroute.route, route)

    def test_representation(self):
        route = [self.depot, self.depot]
        subroute = utils.SubRoute(route, self.max_profit)
        self.assertEqual(subroute.__repr__(), '1->1')

    def test_recount_distance(self):
        requistion_to_insert = Requistion.objects.get(pk=1)
        company_to_insert = requistion_to_insert.company
        route = [self.depot, self.depot]
        subroute = utils.SubRoute([self.depot, self.depot], self.max_profit)

        route.insert(1, utils.Company(str(company_to_insert.pk), dict(
            lat=company_to_insert.latitude, lng=company_to_insert.longitude), requistion_to_insert.estimated_profit))
        expected_distance = self.__count_distance((route[0].lat, route[0].lng), (
            route[1].lat, route[1].lng)) + self.__count_distance((route[1].lat, route[1].lng), (route[2].lat, route[2].lng))
        # When subroute calls .recount_distance()
        subroute.route = route
        subroute.recount_distance()
        # Then distance is equal to <expected_distance>
        self.assertEqual(subroute.distance, expected_distance)

    def test_recount_profit(self):
        requistion_to_insert = Requistion.objects.get(pk=1)
        company_to_insert = requistion_to_insert.company
        route = [self.depot, self.depot]
        subroute = utils.SubRoute(route, self.max_profit)

        route.insert(1, utils.Company(str(company_to_insert.pk), dict(
            lat=company_to_insert.latitude, lng=company_to_insert.longitude), requistion_to_insert.estimated_profit))
        expected_profit = requistion_to_insert.estimated_profit

        # When subroute calls .recount_profit()
        subroute.route = route
        subroute.recount_profit()
        # Then profit is equal to <expected_profit>
        self.assertEqual(subroute.profit, expected_profit)

    def test_add_stop(self):
        requistion_to_insert = Requistion.objects.get(pk=1)
        company_to_insert = utils.Company(str(requistion_to_insert.company.pk), dict(
            lat=requistion_to_insert.company.latitude, lng=requistion_to_insert.company.longitude), requistion_to_insert.estimated_profit)
        route = [self.depot, self.depot]
        subroute = utils.SubRoute(route, self.max_profit)

        # When company has been added
        subroute.add_stop(1, company_to_insert)
        # Then route has 3 segments
        self.assertEqual(len(subroute.route), 3)
        # And route has given company on 1st index
        self.assertEqual(subroute.route[1], company_to_insert)

        expected_distance = self.__count_distance((subroute.route[0].lat, subroute.route[0].lng), (subroute.route[1].lat, subroute.route[1].lng)) + self.__count_distance(
            (subroute.route[1].lat, subroute.route[1].lng), (subroute.route[2].lat, subroute.route[2].lng))
        expected_profit = requistion_to_insert.estimated_profit

        # When route has been updated
        # Then distance is equal to <expected_distance>
        self.assertEqual(subroute.distance, expected_distance)
        # And profit is equal to <expected_profit>
        self.assertEqual(subroute.profit, expected_profit)

    def test_remove_stop(self):
        requistion_to_remove = Requistion.objects.get(pk=1)
        company_to_remove = utils.Company(str(requistion_to_remove.company.pk), dict(
            lat=requistion_to_remove.company.latitude, lng=requistion_to_remove.company.longitude), requistion_to_remove.estimated_profit)
        route = [self.depot, company_to_remove, self.depot]
        subroute = utils.SubRoute(route, self.max_profit)

        # When company has been removed
        subroute.remove_stop(company_to_remove)
        # Then route has 2 segments
        self.assertEqual(len(subroute.route), 2)

        expected_distance = 0
        expected_profit = 0

        # When route has been updated
        # Then distance is equal to <expected_distance>
        self.assertEqual(subroute.distance, expected_distance)
        # And profit is equal to <expected_profit>
        self.assertEqual(subroute.profit, expected_profit)

    def test_swap_stops(self):
        requistions_to_insert = Requistion.objects.all()[:2]
        companies_to_insert = [utils.Company(str(requistion.company.pk), dict(
            lat=requistion.company.latitude, lng=requistion.company.longitude), requistion.estimated_profit) for requistion in requistions_to_insert]
        route = [self.depot] + companies_to_insert + [self.depot]
        subroute = utils.SubRoute(route.copy(), self.max_profit)

        expected_profit = subroute.profit

        # When 2 companies has been swapped with each other
        subroute.swap_stops(1, 2)
        # Then route has changed
        self.assertNotEqual(subroute.route, route)

        distance_0_1 = self.__count_distance(
            (subroute.route[0].lat, subroute.route[0].lng), (subroute.route[1].lat, subroute.route[1].lng))
        distance_1_2 = self.__count_distance(
            (subroute.route[1].lat, subroute.route[1].lng), (subroute.route[2].lat, subroute.route[2].lng))
        distance_2_3 = self.__count_distance(
            (subroute.route[2].lat, subroute.route[2].lng), (subroute.route[3].lat, subroute.route[3].lng))
        expected_distance = distance_0_1 + distance_1_2 + distance_2_3

        # When route has been updated
        # Then distance is equal to <expected_distance>
        self.assertEqual(subroute.distance, expected_distance)
        # And profit is equal to <expected_profit>
        self.assertEqual(subroute.profit, expected_profit)
