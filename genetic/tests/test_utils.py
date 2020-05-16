import unittest

import mpu

from genetic import vertices
from genetic.routes import Route, RoutePart
from genetic.utils import (crossover, get_indexes_all_companies_in_route,
                           mutate_by_swap_within_different_route_parts,
                           mutate_by_swap_within_the_same_route_part)

from .utils import TestData


class UtilsTestCase(unittest.TestCase):
    def setUp(self) -> None:
        pass

    def __count_distance(self, v_from, v_to):
        return TestData.count_distance(v_from, v_to)

    def test_get_indexes_all_companies_in_route_gives_correct_indexes(self):
        route = Route(3, 10000, TestData.distances)
        route_parts = (
            RoutePart([TestData.depots[0], TestData.companies[0],
                       TestData.companies[1], TestData.depots[0]]),
            RoutePart([TestData.depots[0], TestData.companies[2],
                       TestData.companies[3], TestData.companies[4], TestData.depots[0]]),
            RoutePart(
                [TestData.depots[0], TestData.companies[5], TestData.depots[0]]),
        )

        route.add_route_part(route_parts[0])
        route.add_route_part(route_parts[1])
        route.add_route_part(route_parts[2])

        expected_indexes = [
            (0, 1),
            (0, 2),
            (1, 1),
            (1, 2),
            (1, 3),
            (2, 1)
        ]

        result = get_indexes_all_companies_in_route(route, 6)

        self.assertListEqual(result[1], expected_indexes)

    def test_mutate_by_swap_when_neighbours_within_the_same_route_part_gives_correct_distance_and_routes(self):
        route = Route(1, 10000, TestData.distances)
        route_part = RoutePart(
            [TestData.depots[0], TestData.companies[0], TestData.companies[1], TestData.depots[0]])
        route.add_route_part(route_part)

        expected_route = [TestData.depots[0], TestData.companies[1],
                          TestData.companies[0], TestData.depots[0]]
        expected_distance = self.__count_distance(TestData.depots[0], TestData.companies[1]) + self.__count_distance(
            TestData.companies[1], TestData.companies[0]) + self.__count_distance(TestData.companies[0], TestData.depots[0])

        mutate_by_swap_within_the_same_route_part(route, route_part, 1, 2)

        self.assertEqual(route_part.route, expected_route)
        self.assertAlmostEqual(route_part.distance, expected_distance)
        self.assertAlmostEqual(route.distance, expected_distance)

    def test_mutate_by_swap_within_the_same_route_part_gives_correct_distance_and_routes(self):
        route = Route(1, 10000, TestData.distances)
        route_part = RoutePart([TestData.depots[0], TestData.companies[0],
                                TestData.companies[1], TestData.companies[2], TestData.depots[0]])
        route.add_route_part(route_part)

        expected_route = [TestData.depots[0], TestData.companies[2],
                          TestData.companies[1], TestData.companies[0], TestData.depots[0]]
        expected_distance = self.__count_distance(TestData.depots[0], TestData.companies[2]) + self.__count_distance(TestData.companies[2], TestData.companies[1]) + self.__count_distance(
            TestData.companies[1], TestData.companies[0]) + self.__count_distance(TestData.companies[0], TestData.depots[0])

        mutate_by_swap_within_the_same_route_part(route, route_part, 1, 3)

        self.assertEqual(route_part.route, expected_route)
        self.assertAlmostEqual(route_part.distance, expected_distance)
        self.assertAlmostEqual(route.distance, expected_distance)

    def test_mutate_by_swap_within_different_route_parts_gives_correct_distance_and_routes(self):
        route = Route(2, 10000, TestData.distances)
        route_parts = (
            RoutePart(
                [TestData.depots[0], TestData.companies[0], TestData.depots[0]]),
            RoutePart(
                [TestData.depots[0], TestData.companies[1], TestData.depots[0]])
        )
        route.add_route_part(route_parts[0])
        route.add_route_part(route_parts[1])

        expected_route = (
            [TestData.depots[0], TestData.companies[1], TestData.depots[0]],
            [TestData.depots[0], TestData.companies[0], TestData.depots[0]]
        )
        expected_route_distance = self.__count_distance(
            TestData.depots[0], TestData.companies[0]) * 2 + self.__count_distance(TestData.depots[0], TestData.companies[1]) * 2
        expected_route_part_distances = (
            self.__count_distance(
                TestData.depots[0], TestData.companies[1]) * 2,
            self.__count_distance(
                TestData.depots[0], TestData.companies[0]) * 2
        )

        mutate_by_swap_within_different_route_parts(
            route, route_parts[0], route_parts[1], 1, 1)

        self.assertEqual(route_parts[0].route, expected_route[0])
        self.assertEqual(route_parts[1].route, expected_route[1])
        self.assertAlmostEqual(
            route_parts[0].distance, expected_route_part_distances[0])
        self.assertAlmostEqual(
            route_parts[1].distance, expected_route_part_distances[1])
        self.assertAlmostEqual(route.distance, expected_route_distance)


class CrossoverTestCase(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.depots = [
            vertices.Depot('d1', (54.16316153633703, 23.71282342134782))
        ]

        cls.companies = [
            vertices.Company('c1', (54.14012984312138, 21.68101434863681), 10),
            vertices.Company('c2', (53.18713501346265, 21.62101194156029), 10),
            vertices.Company(
                'c3', (54.04382256558855, 23.873847840900154), 10),
            vertices.Company(
                'c4', (52.232435284801504, 23.87625049202829), 10),
            vertices.Company(
                'c5', (53.307132943141504, 23.67470959552454), 10),
            vertices.Company(
                'c6', (52.56800450191488, 23.907350448138747), 10),
            vertices.Company(
                'c7', (52.93180542597885, 23.286584272241427), 10),
            vertices.Company(
                'c8', (52.49374817638531, 23.516983699625428), 10),
            vertices.Company(
                'c9', (52.91379822245375, 22.233813535562525), 10),
        ]

        cls.hotels = [
            vertices.Hotel('h1', (53.054343149038715, 24.002008138481038)),
            vertices.Hotel('h2', (53.5732470327552, 23.13010271019389)),
            vertices.Hotel('h3', (53.1069802832682, 23.21070249193389)),
            vertices.Hotel('h4', (53.994016879831634, 21.632113173363283)),
        ]

        distances = dict()
        for i, vertex in enumerate(cls.depots + cls.companies + cls.hotels):
            distances[vertex.uuid] = dict()
            for j, another_vertex in enumerate(cls.depots + cls.companies + cls.hotels):
                distances[vertex.uuid][another_vertex.uuid] = mpu.haversine_distance(vertex.get_coords(),
                                                                                     another_vertex.get_coords())

        cls.distances = distances

    def setUp(self) -> None:
        pass

    def __count_distance(self, v_from, v_to):
        return mpu.haversine_distance(v_from.get_coords(), v_to.get_coords())

    def test_both_parents_after_crossover_have_correct_distance_and_route(self):
        routes = [
            Route(1, 10000, TestData.distances),
            Route(1, 10000, TestData.distances)
        ]

        routes[0].available_vertices = set(
            [company.id for company in TestData.companies])
        routes[1].available_vertices = set(
            [company.id for company in TestData.companies])

        route_parts = [
            RoutePart(
                [TestData.depots[0], TestData.companies[0], TestData.depots[0]]),
            RoutePart([TestData.depots[0], TestData.companies[2],
                       TestData.companies[3], TestData.depots[0]])
        ]

        routes[0].add_route_part(route_parts[0])
        routes[1].add_route_part(route_parts[1])

        expected_first_route = [
            TestData.depots[0], TestData.companies[0], TestData.companies[3], TestData.depots[0]]
        expected_first_distance = self.__count_distance(TestData.depots[0], TestData.companies[0]) + self.__count_distance(
            TestData.companies[0], TestData.companies[3]) + self.__count_distance(TestData.companies[3], TestData.depots[0])
        expected_second_route = [TestData.depots[0],
                                 TestData.companies[2], TestData.depots[0]]
        expected_second_distance = self.__count_distance(
            TestData.depots[0], TestData.companies[2]) * 2

        routes = crossover([routes, 1, 0])

        self.assertEqual(routes[0].get_route_part(
            0).route, expected_first_route)
        self.assertAlmostEqual(routes[0].get_route_part(
            0).distance, expected_first_distance)
        self.assertEqual(routes[1].get_route_part(
            0).route, expected_second_route)
        self.assertAlmostEqual(routes[1].get_route_part(
            0).distance, expected_second_distance)

    def test_only_one_possible_crossover_gives_correct_routes_and_distances(self):
        routes = [
            Route(1, 265, TestData.distances),
            Route(1, 10000, TestData.distances)
        ]
        routes[0].available_vertices = set(
            [company.id for company in TestData.companies])
        routes[1].available_vertices = set(
            [company.id for company in TestData.companies])

        route_parts = [
            RoutePart(
                [TestData.depots[0], TestData.companies[0], TestData.depots[0]]),
            RoutePart([TestData.depots[0], TestData.companies[2],
                       TestData.companies[3], TestData.depots[0]])
        ]

        routes[0].add_route_part(route_parts[0])
        routes[1].add_route_part(route_parts[1])

        expected_first_route = [TestData.depots[0],
                                TestData.companies[0], TestData.depots[0]]
        expected_first_distance = self.__count_distance(
            TestData.depots[0], TestData.companies[0]) * 2
        expected_second_route = [TestData.depots[0],
                                 TestData.companies[2], TestData.depots[0]]
        expected_second_distance = self.__count_distance(
            TestData.depots[0], TestData.companies[2]) * 2

        routes = crossover([routes, 1, 0])

        self.assertEqual(routes[0].get_route_part(
            0).route, expected_first_route)
        self.assertAlmostEqual(routes[0].get_route_part(
            0).distance, expected_first_distance)
        self.assertEqual(routes[1].get_route_part(
            0).route, expected_second_route)
        self.assertAlmostEqual(routes[1].get_route_part(
            0).distance, expected_second_distance)

    def test_no_possible_crossover_gives_correct_routes_and_distances(self):
        routes = [
            Route(1, 265, TestData.distances),
            Route(1, 30, TestData.distances)
        ]

        routes[0].available_vertices = set(
            [company.id for company in TestData.companies])
        routes[1].available_vertices = set(
            [company.id for company in TestData.companies])

        route_parts = [
            RoutePart(
                [TestData.depots[0], TestData.companies[0], TestData.depots[0]]),
            RoutePart([TestData.depots[0], TestData.companies[2],
                       TestData.companies[3], TestData.depots[0]])
        ]

        routes[0].add_route_part(route_parts[0])
        routes[1].add_route_part(route_parts[1])

        expected_first_route = [TestData.depots[0],
                                TestData.companies[0], TestData.depots[0]]
        expected_first_distance = self.__count_distance(
            TestData.depots[0], TestData.companies[0]) * 2
        expected_second_route = [
            TestData.depots[0], TestData.companies[2], TestData.companies[3], TestData.depots[0]]
        expected_second_distance = route_parts[1].distance

        routes = crossover([routes, 1, 0])

        self.assertEqual(routes[0].get_route_part(
            0).route, expected_first_route)
        self.assertAlmostEqual(routes[0].get_route_part(
            0).distance, expected_first_distance)
        self.assertEqual(routes[1].get_route_part(
            0).route, expected_second_route)
        self.assertAlmostEqual(routes[1].get_route_part(
            0).distance, expected_second_distance)
