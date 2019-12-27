import mpu
import random

from django.test import TestCase
from data.models import Company, Requistion
from genetic import utils

from .factories import (BusinessTripFactory, CompanyFactory, EmployeeFactory,
                        RequistionFactory)


def create_vertices(vertex_class, number):
    vertices = []
    for i in range(1, number + 1):
        coords = dict(lat=random.uniform(52.1647, 54.2437),
                      lng=random.uniform(21.3534, 24.0803))
        if vertex_class == utils.Company:
            profit = random.randint(10, 200)
            vertex = vertex_class(str(i), coords, profit)
        else:
            vertex = vertex_class(str(i), coords)
        vertices.append(vertex)
    return vertices


def count_distance(coords_a: tuple, coords_b: tuple) -> float:
    return mpu.haversine_distance(coords_a, coords_b)


class RouteTestCase(TestCase):
    def setUp(self):
        self.depot = create_vertices(utils.Depot, 1)
        self.companies = create_vertices(utils.Company, 18)
        self.hotels = create_vertices(utils.Hotel, 50)

        max_profit = 0
        for company in self.companies:
            max_profit += company.profit
        self.max_profit = max_profit

    def test_init_start_route(self):
        subroute = utils.SubRoute(
            [self.depot[0], self.depot[0]], self.max_profit)

        # When route is initialized
        route = utils.Route([subroute], self.max_profit)
        # Then max_profit is equal to <max_profit>
        self.assertEqual(route.max_profit, self.max_profit)
        # And distance is equal to 0
        self.assertEqual(route.distance, 0)
        # And profit is equal to 0
        self.assertEqual(route.profit, 0)

    def test_init_custom_route(self):
        subroute = utils.SubRoute(
            [self.depot[0], self.companies[0], self.depot[0]], self.max_profit)

        distance_0_1 = count_distance(
            (self.depot[0].lat, self.depot[0].lng), (self.companies[0].lat, self.companies[0].lng))
        distance_1_2 = count_distance(
            (self.companies[0].lat, self.companies[0].lng), (self.depot[0].lat, self.depot[0].lng))
        expected_distance = distance_0_1 + distance_1_2
        expected_profit = self.companies[0].profit

        # When route is initalized
        route = utils.Route([subroute], self.max_profit)
        # Then max_profit is equal to <max_profit>
        self.assertEqual(route.max_profit, self.max_profit)
        # And distance is equal to <expected_distance>
        self.assertEqual(route.distance, expected_distance)
        # And profit is equal to <expected_profit>
        self.assertEqual(route.profit, expected_profit)
