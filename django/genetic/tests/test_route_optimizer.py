from django.test import TestCase
from unittest.mock import Mock
import copy
import unittest

from .factories import BusinessTripFactory
from .utils import create_vertices, count_distance
from genetic import utils


class RouteOneDayOptimizerTestCase(unittest.TestCase):
    def setUp(self):
        self.depot = create_vertices(utils.Depot, 1)
        self.companies = create_vertices(utils.Company, 30)
        self.hotels = create_vertices(utils.Hotel, 50)

        self.businessTrip = BusinessTripFactory()

        max_profit = 0
        for company in self.companies:
            max_profit += company.profit
        self.max_profit = max_profit

        route = utils.SubRoute(self.depot + self.companies + self.depot, self.max_profit)
        self.tmax = route.distance

    def test_init(self):
        # When route optimizer has been initialized
        ro = utils.RouteOptimizer(
            self.businessTrip.id, self.depot, self.companies, self.hotels, 100, 1)
        # Then depots are equal to <depot>
        self.assertEqual(ro.depots, self.depot)
        # And companies are equal to <companies>
        self.assertEqual(ro.companies, self.companies)
        # And hotels are equal to <hotels>
        self.assertEqual(ro.hotels, self.hotels)
        # And tmax is equal to 100
        self.assertEqual(ro.tmax, 100)
        # And population is equal to 1
        self.assertEqual(len(ro.population), 1)
        # And days are equal to 1
        self.assertEqual(ro.days, 1)
        # And business_trip_id is greater than 0
        self.assertGreater(ro.business_trip_id, 0)
        # And max profit is equal to <max_profit>
        self.assertEqual(ro.max_profit, self.max_profit)
        # And length of distances is equal to length of depots + length of companies + length of hotels
        self.assertEqual(len(ro.distances), len(self.depot) +
                         len(self.companies) + len(self.hotels))
        # And length of profits by distances is equal to length of distances
        self.assertEqual(len(ro.profits_by_distances), len(ro.distances))

    def test_count_distances(self):
        ro = utils.RouteOptimizer(
            self.businessTrip.id, self.depot, self.companies[:2], [self.hotels[0]], 100, 1)

        expected_distances = [
            [
                100000,
                count_distance((self.depot[0].lat, self.depot[0].lng),
                               (self.companies[0].lat, self.companies[0].lng)),
                count_distance((self.depot[0].lat, self.depot[0].lng),
                               (self.companies[1].lat, self.companies[1].lng)),
                count_distance(
                    (self.depot[0].lat, self.depot[0].lng), (self.hotels[0].lat, self.hotels[0].lng)),
            ],
            [
                count_distance(
                    (self.companies[0].lat, self.companies[0].lng), (self.depot[0].lat, self.depot[0].lng)),
                100000,
                count_distance((self.companies[0].lat, self.companies[0].lng), (
                    self.companies[1].lat, self.companies[1].lng)),
                count_distance(
                    (self.companies[0].lat, self.companies[0].lng), (self.hotels[0].lat, self.hotels[0].lng))
            ],
            [
                count_distance(
                    (self.companies[1].lat, self.companies[1].lng), (self.depot[0].lat, self.depot[0].lng)),
                count_distance((self.companies[1].lat, self.companies[1].lng), (
                    self.companies[0].lat, self.companies[0].lng)),
                100000,
                count_distance(
                    (self.companies[1].lat, self.companies[1].lng), (self.hotels[0].lat, self.hotels[0].lng))
            ],
            [
                count_distance(
                    (self.hotels[0].lat, self.hotels[0].lng), (self.depot[0].lat, self.depot[0].lng)),
                count_distance((self.hotels[0].lat, self.hotels[0].lng),
                               (self.companies[0].lat, self.companies[0].lng)),
                count_distance((self.hotels[0].lat, self.hotels[0].lng),
                               (self.companies[1].lat, self.companies[1].lng)),
                100000
            ]
        ]

        expected_profits_by_distances = [
            [
                0,
                self.companies[0].profit / expected_distances[0][1],
                self.companies[1].profit / expected_distances[0][2],
                self.hotels[0].profit / expected_distances[0][3]
            ],
            [
                self.depot[0].profit / expected_distances[1][0],
                0,
                self.companies[1].profit / expected_distances[1][2],
                self.hotels[0].profit / expected_distances[1][3]
            ],
            [
                self.depot[0].profit / expected_distances[2][0],
                self.companies[0].profit / expected_distances[2][1],
                0,
                self.hotels[0].profit / expected_distances[2][3]
            ],
            [
                self.depot[0].profit / expected_distances[3][0],
                self.companies[0].profit / expected_distances[3][1],
                self.companies[1].profit / expected_distances[3][2],
                0
            ]
        ]

        # When count distances is called
        ro.count_distances()
        # Then distances are equal to <expected_distances>
        self.assertEqual(ro.distances, expected_distances)
        # And profits by distances are equal to <expected_profits_by_distances>
        self.assertEqual(ro.profits_by_distances,
                         expected_profits_by_distances)
    
    def test_get_vertex_index(self):
        ro = utils.RouteOptimizer(
            self.businessTrip.id, self.depot, self.companies[:2], [self.hotels[0]], 100, 1)

        # When depot is passed to method
        result = ro.get_vertex_index(self.depot[0])
        # Then result is equal to 0
        self.assertEqual(result, 0)

        # When company[0] is passed to method
        result = ro.get_vertex_index(self.companies[0])
        # Then result is equal to 1
        self.assertEqual(result, 1)

        # When company[1] is passed to method
        result = ro.get_vertex_index(self.companies[1])
        # Then result is equal to 2
        self.assertEqual(result, 2)

        # When hotels[0] is passed to method
        result = ro.get_vertex_index(self.hotels[0])
        # Then result is equal to 3
        self.assertEqual(result, 3)
    
    def test_first_population_does_not_exceed_tmax(self):
        ro = utils.RouteOptimizer(self.businessTrip.id, self.depot, self.companies, self.hotels, 0.25*self.tmax, 1)

        # When first population has been generated
        # Then each route does not exceed tmax constraint
        for route in ro.population[0]:
            self.assertLessEqual(route.distance, self.tmax)

    def test_first_population_has_depots_on_first_and_last_element(self):
        ro = utils.RouteOptimizer(self.businessTrip.id, self.depot, self.companies, self.hotels, self.tmax, 1)

        # When first population has been generated
        # Then each route has <depot> on first and last element of route
        for route in ro.population[0]:
            self.assertEqual(route.routes[0].route[0], self.depot[0])
            self.assertEqual(route.routes[0].route[-1], self.depot[0])
 
class RouteTwoDaysOptimizerTestCase(TestCase):
    def setUp(self):
        self.depot = create_vertices(utils.Depot, 1)
        self.companies = create_vertices(utils.Company, 30)
        self.hotels = create_vertices(utils.Hotel, 50)

        self.businessTrip = BusinessTripFactory()

        max_profit = 0
        for company in self.companies:
            max_profit += company.profit
        self.max_profit = max_profit

        route = utils.SubRoute(self.depot + self.companies + self.depot, self.max_profit)
        self.tmax = route.distance

    def test_each_route_of_population_of_20_has_correct_depots_and_hotels(self):
        ro = utils.RouteOptimizer(self.businessTrip.id, self.depot, self.companies, self.hotels, self.tmax, 2)

        # When route optimizer has finished its work
        ro.run(20)
        # Then each of subroute of route has common depots/hotels and they are correct
        for route in ro.population[-1]:
            self.assertIsInstance(route.routes[0].route[0], utils.Depot)
            self.assertNotIsInstance(route.routes[0].route[-1], utils.Company)
            self.assertNotIsInstance(route.routes[1].route[0], utils.Company)
            self.assertIsInstance(route.routes[1].route[-1], utils.Depot)
            # import pdb;pdb.set_trace()
            self.assertEqual(route.routes[0].route[-1], route.routes[1].route[0])
            self.assertEqual(route.routes[0].route[0], route.routes[1].route[-1])

    
 