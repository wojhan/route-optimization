import random
import unittest

import mpu
from django.test import TestCase

from genetic import vertices
from genetic.routes import Route, RoutePart

from .utils import TestData


class RoutePartTestCase(unittest.TestCase):
    def setUp(self) -> None:
        pass

    def __prepare_route_parts(self, vertices):
        return RoutePart(vertices)

    def __prepare_start_route_part(self):
        return self.__prepare_route_parts([TestData.depots[0], TestData.depots[0]])

    def __prepare_route_part_with_n_companies(self, n):
        return self.__prepare_route_parts([TestData.depots[0]] + list(TestData.companies[:n]) + [TestData.depots[0]])

    def __prepare_empty_route_part(self):
        return self.__prepare_route_parts([])

    # init tests

    def test_init_with_empty_route_gives_correct_distance(self):
        result = self.__prepare_empty_route_part()

        expected_distance = 0
        self.assertEqual(result.distance, expected_distance)

    def test_init_with_empty_route_gives_corect_profit(self):
        result = self.__prepare_empty_route_part()

        expected_profit = 0
        self.assertEqual(result.profit, expected_profit)

    def test_init_with_empty_route_gives_correct_route(self):
        result = self.__prepare_empty_route_part()

        expected_route = []
        self.assertEqual(result.route, expected_route)

    def test_init_with_start_route_gives_correct_distance(self):
        result = self.__prepare_start_route_part()

        expected_distance = 0
        self.assertEqual(result.distance, expected_distance)

    def test_init_with_start_route_gives_correct_profit(self):
        result = self.__prepare_start_route_part()

        expected_profit = 0
        self.assertEqual(result.profit, expected_profit)

    def test_init_with_start_route_gives_correct_route(self):
        result = self.__prepare_start_route_part()

        expected_route = [TestData.depots[0], TestData.depots[0]]
        self.assertEqual(result.route, expected_route)

    def test_init_with_one_company_in_route_gives_correct_distance(self):
        result = self.__prepare_route_part_with_n_companies(1)

        expected_distance = 0
        self.assertEqual(result.distance, expected_distance)

    def test_init_with_one_company_in_route_gives_correct_profit(self):
        result = self.__prepare_route_part_with_n_companies(1)

        expected_profit = 0
        self.assertEqual(result.profit, expected_profit)

    def test_init_with_one_company_in_route_gives_correct_route(self):
        result = self.__prepare_route_part_with_n_companies(1)

        expected_route = [TestData.depots[0]] + \
            [TestData.companies[0]] + [TestData.depots[0]]
        self.assertEqual(result.route, expected_route)

    # replace_stop tests

    def test_replace_stop_does_not_replace_when_out_of_index(self):
        route_part = self.__prepare_empty_route_part()

        route_part.replace_stop(1, TestData.companies[0])

        expected_route = []
        self.assertEqual(route_part.route, expected_route)

    def test_replace_stop_does_replace_when_correct_index(self):
        route_part = self.__prepare_route_part_with_n_companies(1)

        route_part.replace_stop(1, TestData.companies[1])

        expected_route = [TestData.depots[0],
                          TestData.companies[1], TestData.depots[0]]
        self.assertEqual(route_part.route, expected_route)

    # recount_route


class RouteTestCase(unittest.TestCase):
    def setUp(self) -> None:
        pass

    def __prepare_route(self, route_parts, max_distance=10000):
        route = Route(len(route_parts), max_distance, TestData.distances)
        route.available_vertices = set(
            [company.id for company in TestData.companies])

        for i in range(len(route_parts)):
            route.add_route_part(route_parts[i])

        return route

    def __prepare_route_with_one_start_route_part(self):
        route_part = RoutePart([TestData.depots[0], TestData.depots[0]])

        return self.__prepare_route((route_part, ))

    def __prepare_route_with_n_start_route_parts(self, n):
        route_parts = list()

        for i in range(n):
            route_part = RoutePart([TestData.depots[0], TestData.depots[0]])
            route_parts.append(route_part)

        return self.__prepare_route(route_parts)

    def __prepare_route_with_one_route_part_with_n_companies(self, n):
        route_part = RoutePart(
            [TestData.depots[0]] + list(TestData.companies[:n]) + [TestData.depots[0]])

        return self.__prepare_route((route_part, ))

    def __prepare_route_with_n_start_route_parts_with_m_companies(self, n, m):
        route_parts = list()

        for i in range(n):
            if i == 0:
                vertices = [TestData.depots[0]] + \
                    list(TestData.companies[:m]) + [TestData.hotels[0]]
            elif i == n - 1:
                vertices = [TestData.hotels[0]] + \
                    list(TestData.companies[i * m: i *
                                            m + m]) + [TestData.depots[0]]
            else:
                vertices = [TestData.hotels[0]] + \
                    list(TestData.companies[i * m: i *
                                            m + m]) + [TestData.hotels[0]]

            route_part = RoutePart(vertices)
            route_parts.append(route_part)

        return self.__prepare_route(route_parts)

    def __prepare_route_with_n_start_route_parts_with_m_companies_for_o_days(self, n, m, o):
        route = self.__prepare_route_with_n_start_route_parts_with_m_companies(
            n, m)

        route.days = o

        return route

    def __prepare_route_part_with_vertices(self, vertices):
        route_part = RoutePart(vertices)

        return route_part

    def __get_profit_for_companies(self, companies):
        profit = 0
        for company in companies:
            profit += company.profit

        return profit

    # count_profit

    def test_count_profit_when_no_companies_in_route_for_one_day_gives_correct_profit(self):
        route = self.__prepare_route_with_one_start_route_part()

        route.count_profit()

        expected_profit = 0
        self.assertEqual(route.profit, expected_profit)

    def test_count_profit_when_unique_companies_in_route_for_one_day_gives_correct_profit(self):
        route = self.__prepare_route_with_one_route_part_with_n_companies(2)

        route.count_profit()

        expected_profit = self.__get_profit_for_companies(
            TestData.companies[:2])
        self.assertEqual(route.profit, expected_profit)

    def test_count_profit_when_duplicated_companies_in_route_for_one_day_gives_correct_profit(self):
        route_part = self.__prepare_route_part_with_vertices(
            [TestData.depots[0], TestData.companies[0], TestData.companies[0], TestData.companies[1], TestData.depots[0]])
        route = self.__prepare_route((route_part,))

        route.count_profit()

        expected_profit = self.__get_profit_for_companies(
            TestData.companies[:2])
        self.assertEqual(route.profit, expected_profit)

    def test_count_profit_when_no_companies_in_route_for_n_days_gives_correct_profit(self):
        route = self.__prepare_route_with_n_start_route_parts(2)

        route.count_profit()

        expected_profit = 0
        self.assertEqual(route.profit, expected_profit)

    def test_count_profit_when_unique_companies_in_route_for_n_days_gives_correct_profit(self):
        route = self.__prepare_route_with_n_start_route_parts_with_m_companies(
            2, 2)

        route.count_profit()

        expected_profit = self.__get_profit_for_companies(
            TestData.companies[:4])
        self.assertEqual(route.profit, expected_profit)

    def test_count_profit_when_duplicated_companies_in_route_for_n_days_gives_correct_profit(self):
        route_parts = (
            self.__prepare_route_part_with_vertices(
                [TestData.depots[0], TestData.companies[0], TestData.hotels[0]]),
            self.__prepare_route_part_with_vertices(
                [TestData.hotels[0], TestData.companies[0], TestData.hotels[0]])
        )
        route = self.__prepare_route(route_parts)

        route.count_profit()

        expected_profit = self.__get_profit_for_companies(
            TestData.companies[:1])
        self.assertEqual(route.profit, expected_profit)

    # add_route_part

    def test_add_route_part_when_number_of_route_parts_is_equal_to_number_of_days_is_not_added(self):
        route = self.__prepare_route_with_n_start_route_parts_with_m_companies_for_o_days(
            1, 1, 1)

        route.add_route_part(self.__prepare_route_part_with_vertices([]))

        expected_routes_length = 1
        self.assertEqual(len(route.routes), expected_routes_length)

    def test_add_route_part_when_number_of_route_parts_is_less_than_number_of_days_is_added(self):
        route = self.__prepare_route_with_n_start_route_parts_with_m_companies_for_o_days(
            1, 1, 2)

        route.add_route_part(self.__prepare_route_part_with_vertices([]))

        expected_routes_length = 2
        self.assertEqual(len(route.routes), expected_routes_length)

    def test_add_route_part_when_number_of_route_parts_is_less_than_number_of_days_is_added_and_increase_route_distance(self):
        route = self.__prepare_route_with_n_start_route_parts_with_m_companies_for_o_days(
            1, 1, 2)
        distance_before = route.distance

        route.add_route_part(self.__prepare_route_part_with_vertices(
            [TestData.depots[0], TestData.companies[1], TestData.depots[0]]))

        expected_distance = distance_before + \
            (TestData.count_distance(
                TestData.depots[0], TestData.companies[1])) * 2
        self.assertEqual(route.distance, expected_distance)

    def test_add_route_part_when_number_of_route_parts_is_less_than_number_of_days_decrease_length_of_available_companies_set_if_contains_these_companies(self):
        route = self.__prepare_route_with_n_start_route_parts_with_m_companies_for_o_days(
            0, 0, 2)
        available_length_before = len(route.available_vertices)

        route.add_route_part(self.__prepare_route_part_with_vertices(
            [TestData.depots[0], TestData.companies[0], TestData.depots[0]]))

        expected_available_vertices_length = available_length_before - 1
        self.assertEqual(len(route.available_vertices),
                         expected_available_vertices_length)

    def test_add_route_part_when_number_of_route_parts_is_less_than_number_of_days_does_not_decrease_length_of_available_companies_set_if_does_not_contain_these_companies(self):
        route = self.__prepare_route_with_n_start_route_parts_with_m_companies_for_o_days(
            1, 1, 2)
        available_length_before = len(route.available_vertices)

        route.add_route_part(
            self.__prepare_route_part_with_vertices([TestData.depots[0], TestData.companies[0], TestData.depots[0]]))

        expected_available_vertices_length = available_length_before
        self.assertEqual(len(route.available_vertices),
                         expected_available_vertices_length)


class AddingStopsTestCase(unittest.TestCase):
    def setUp(self) -> None:
        pass

    def __count_distance(self, v_from, v_to):
        return TestData.count_distance(v_from, v_to)

    def test_add_on_first_in_start_route_part(self):
        route = Route(1, 10000, TestData.distances)
        route.available_vertices = set(
            [company.id for company in TestData.companies])
        route_part = RoutePart([TestData.depots[0], TestData.depots[0]])
        route.add_route_part(route_part)
        route.add_stop(route_part, 0, TestData.companies[0])
        expected_distance = self.__count_distance(
            TestData.depots[0], TestData.companies[0])
        expected_route_length = 3

        self.assertEqual(route.distance, expected_distance)
        self.assertEqual(route_part.distance, expected_distance)
        self.assertEqual(route_part.length, expected_route_length)
        self.assertEqual(route_part.route[0], TestData.companies[0])

    def test_add_on_first_the_same_as_first_in_start_route_part(self):
        route = Route(1, 10000, TestData.distances)
        route.available_vertices = set(
            [company.id for company in TestData.companies])
        route_part = RoutePart([TestData.depots[0], TestData.depots[0]])
        route.add_route_part(route_part)
        route.add_stop(route_part, 0, TestData.depots[0])
        expected_distance = 0
        expected_route_length = 3

        self.assertEqual(route.distance, expected_distance)
        self.assertEqual(route_part.distance, expected_distance)
        self.assertEqual(route_part.length, expected_route_length)
        self.assertEqual(route_part.route[0], TestData.depots[0])

    def test_add_on_first_in_existing_route_part(self):
        route = Route(1, 10000, TestData.distances)
        route.available_vertices = set(
            [company.id for company in TestData.companies])
        route_part = RoutePart(
            [TestData.depots[0], TestData.companies[0], TestData.depots[0]])
        route.add_route_part(route_part)
        route.add_stop(route_part, 0, TestData.companies[1])
        expected_distance = self.__count_distance(TestData.companies[1], TestData.depots[0]) + (
            self.__count_distance(TestData.depots[0], TestData.companies[0]) * 2)
        expected_route_length = 4

        self.assertEqual(route.distance, expected_distance)
        self.assertEqual(route_part.distance, expected_distance)
        self.assertEqual(route_part.length, expected_route_length)
        self.assertEqual(route_part.route[0], TestData.companies[1])

    def test_add_on_first_the_same_as_first_in_existing_route_part(self):
        route = Route(1, 10000, TestData.distances)
        route.available_vertices = set(
            [company.id for company in TestData.companies])
        route_part = RoutePart(
            [TestData.depots[0], TestData.companies[0], TestData.depots[0]])
        route.add_route_part(route_part)
        route.add_stop(route_part, 0, TestData.depots[0])
        expected_distance = self.__count_distance(
            TestData.depots[0], TestData.companies[0]) * 2
        expected_route_length = 4

        self.assertEqual(route.distance, expected_distance)
        self.assertEqual(route_part.distance, expected_distance)
        self.assertEqual(route_part.length, expected_route_length)
        self.assertEqual(route_part.route[0], TestData.depots[0])

    def test_add_on_last_in_start_route_part(self):
        route = Route(1, 10000, TestData.distances)
        route.available_vertices = set(
            [company.id for company in TestData.companies])
        route_part = RoutePart([TestData.depots[0], TestData.depots[0]])
        route.add_route_part(route_part)
        route.add_stop(route_part, 2, TestData.companies[0])
        expected_distance = self.__count_distance(
            TestData.depots[0], TestData.companies[0])
        expected_route_length = 3

        self.assertEqual(route.distance, expected_distance)
        self.assertEqual(route_part.distance, expected_distance)
        self.assertEqual(route_part.length, expected_route_length)
        self.assertEqual(route_part.route[-1], TestData.companies[0])

    def test_add_on_last_the_same_as_last_in_start_route_part(self):
        route = Route(1, 10000, TestData.distances)
        route.available_vertices = set(
            [company.id for company in TestData.companies])
        route_part = RoutePart([TestData.depots[0], TestData.depots[0]])
        route.add_route_part(route_part)
        route.add_stop(route_part, route_part.length, TestData.depots[0])
        expected_distance = 0
        expected_route_length = 3

        self.assertEqual(route.distance, expected_distance)
        self.assertEqual(route_part.distance, expected_distance)
        self.assertEqual(route_part.length, expected_route_length)
        self.assertEqual(route_part.route[0], TestData.depots[0])

    def test_add_on_last_in_existing_route_part(self):
        route = Route(1, 10000, TestData.distances)
        route.available_vertices = set(
            [company.id for company in TestData.companies])
        route_part = RoutePart(
            [TestData.depots[0], TestData.companies[0], TestData.depots[0]])
        route.add_route_part(route_part)
        route.add_stop(route_part, route_part.length, TestData.companies[1])
        expected_distance = self.__count_distance(TestData.companies[1], TestData.depots[0]) + (
            self.__count_distance(TestData.depots[0], TestData.companies[0]) * 2)
        expected_route_length = 4

        self.assertEqual(route.distance, expected_distance)
        self.assertEqual(route_part.distance, expected_distance)
        self.assertEqual(route_part.length, expected_route_length)
        self.assertEqual(route_part.route[-1], TestData.companies[1])

    def test_add_on_last_the_same_as_last_in_existing_route_part(self):
        route = Route(1, 10000, TestData.distances)
        route.available_vertices = set(
            [company.id for company in TestData.companies])
        route_part = RoutePart(
            [TestData.depots[0], TestData.companies[0], TestData.depots[0]])
        route.add_route_part(route_part)
        route.add_stop(route_part, route_part.length, TestData.depots[0])
        expected_distance = self.__count_distance(
            TestData.depots[0], TestData.companies[0]) * 2
        expected_route_length = 4

        self.assertEqual(route.distance, expected_distance)
        self.assertEqual(route_part.distance, expected_distance)
        self.assertEqual(route_part.length, expected_route_length)
        self.assertEqual(route_part.route[-1], TestData.depots[0])

    def test_add_on_non_edge_position_in_start_route_part(self):
        route = Route(1, 10000, TestData.distances)
        route.available_vertices = set(
            [company.id for company in TestData.companies])
        route_part = RoutePart([TestData.depots[0], TestData.depots[0]])
        route.add_route_part(route_part)
        route.add_stop(route_part, 1, TestData.companies[0])
        expected_distance = self.__count_distance(
            TestData.depots[0], TestData.companies[0]) * 2
        expected_route_length = 3

        self.assertAlmostEqual(route.distance, expected_distance)
        self.assertAlmostEqual(route_part.distance, expected_distance)
        self.assertEqual(route_part.length, expected_route_length)
        self.assertEqual(route_part.route[1], TestData.companies[0])

    def test_add_on_non_edge_position_in_existing_route_part(self):
        route = Route(1, 10000, TestData.distances)
        route.available_vertices = set(
            [company.id for company in TestData.companies])
        route_part = RoutePart(
            [TestData.depots[0], TestData.companies[0], TestData.depots[0]])
        route.add_route_part(route_part)
        route.add_stop(route_part, 1, TestData.companies[1])
        expected_distance = self.__count_distance(TestData.depots[0], TestData.companies[0]) + self.__count_distance(
            TestData.companies[0], TestData.companies[1]) + self.__count_distance(TestData.companies[1], TestData.depots[0])
        expected_route_length = 4

        self.assertAlmostEqual(route.distance, expected_distance)
        self.assertAlmostEqual(route_part.distance, expected_distance)
        self.assertEqual(route_part.length, expected_route_length)
        self.assertEqual(route_part.route[1], TestData.companies[1])
        self.assertEqual(route_part.route[2], TestData.companies[0])


class RemovingStopsTestCase(unittest.TestCase):
    def setUp(self) -> None:
        pass

    def __count_distance(self, v_from, v_to):
        return TestData.count_distance(v_from, v_to)

    def test_remove_first_vertex_in_start_route_part(self):
        route = Route(1, 10000, TestData.distances)
        route.available_vertices = set(
            [company.id for company in TestData.companies])
        route_part = RoutePart([TestData.depots[0], TestData.depots[0]])
        route.add_route_part(route_part)
        route.remove_stop(route_part, 0)
        expected_distance = 0
        expected_route_length = 1

        self.assertAlmostEqual(route.distance, expected_distance)
        self.assertAlmostEqual(route_part.distance, expected_distance)
        self.assertEqual(route_part.length, expected_route_length)

    def test_remove_first_vertex_in_existing_route_part(self):
        route = Route(1, 10000, TestData.distances)
        route.available_vertices = set(
            [company.id for company in TestData.companies])
        route_part = RoutePart(
            [TestData.depots[0], TestData.companies[0], TestData.depots[0]])
        route.add_route_part(route_part)
        route.remove_stop(route_part, 0)
        expected_distance = self.__count_distance(
            TestData.companies[0], TestData.depots[0])
        expected_route_length = 2

        self.assertAlmostEqual(route.distance, expected_distance)
        self.assertAlmostEqual(route_part.distance, expected_distance)
        self.assertEqual(route_part.length, expected_route_length)
        self.assertEqual(route_part.route[0], TestData.companies[0])

    def test_remove_last_vertex_in_start_route_part(self):
        route = Route(1, 10000, TestData.distances)
        route.available_vertices = set(
            [company.id for company in TestData.companies])
        route_part = RoutePart([TestData.depots[0], TestData.depots[0]])
        route.add_route_part(route_part)
        route.remove_stop(route_part, route_part.length - 1)
        expected_distance = 0
        expected_route_length = 1

        self.assertAlmostEqual(route.distance, expected_distance)
        self.assertAlmostEqual(route_part.distance, expected_distance)
        self.assertEqual(route_part.length, expected_route_length)

    def test_remove_last_vertex_in_existing_route_part(self):
        route = Route(1, 10000, TestData.distances)
        route.available_vertices = set(
            [company.id for company in TestData.companies])
        route_part = RoutePart(
            [TestData.depots[0], TestData.companies[0], TestData.depots[0]])
        route.add_route_part(route_part)
        route.remove_stop(route_part, route_part.length - 1)
        expected_distance = self.__count_distance(
            TestData.companies[0], TestData.depots[0])
        expected_route_length = 2

        self.assertAlmostEqual(route.distance, expected_distance)
        self.assertAlmostEqual(route_part.distance, expected_distance)
        self.assertEqual(route_part.length, expected_route_length)
        self.assertEqual(route_part.route[-1], TestData.companies[0])

    def test_remove_not_edge_vertex_in_existing_route_part(self):
        route = Route(1, 10000, TestData.distances)
        route.available_vertices = set(
            [company.id for company in TestData.companies])
        route_part = RoutePart(
            [TestData.depots[0], TestData.companies[0], TestData.depots[0]])
        route.add_route_part(route_part)
        route.remove_stop(route_part, 1)
        expected_distance = 0
        expected_route_length = 2

        self.assertAlmostEqual(route.distance, expected_distance)
        self.assertAlmostEqual(route_part.distance, expected_distance)
        self.assertEqual(route_part.length, expected_route_length)


class ReplacingStopsTestCase(unittest.TestCase):
    def setUp(self) -> None:
        pass

    def __count_distance(self, v_from, v_to):
        return TestData.count_distance(v_from, v_to)

    def test_replace_first_element_in_route_part_gives_correct_distance(self):
        route = Route(1, 10000, TestData.distances)
        route_part = RoutePart([TestData.depots[0], TestData.depots[0]])
        route.add_route_part(route_part)

        replacing_company = TestData.companies[0]
        expected_distance = self.__count_distance(
            TestData.companies[0], TestData.depots[0])

        route.replace_stop(route_part, 0, replacing_company)
        self.assertEqual(route.distance, expected_distance)
        self.assertEqual(route_part.distance, expected_distance)
        self.assertEqual(route_part.route[0], replacing_company)

    def test_replace_last_element_in_route_part_gives_correct_distance(self):
        route = Route(1, 10000, TestData.distances)
        route_part = RoutePart([TestData.depots[0], TestData.depots[0]])
        route.add_route_part(route_part)

        replacing_company = TestData.companies[0]
        expected_distance = self.__count_distance(
            TestData.companies[0], TestData.depots[0])

        route.replace_stop(route_part, route_part.length -
                           1, replacing_company)
        self.assertEqual(route.distance, expected_distance)
        self.assertEqual(route_part.distance, expected_distance)
        self.assertEqual(route_part.route[-1], replacing_company)

    def test_replace_not_edge_element_in_route_part_gives_correct_distance(self):
        route = Route(1, 10000, TestData.distances)
        route_part = RoutePart(
            [TestData.depots[0], TestData.companies[1], TestData.depots[0]])
        route.add_route_part(route_part)

        replacing_company = TestData.companies[0]
        expected_distance = self.__count_distance(
            TestData.companies[0], TestData.depots[0]) * 2

        route.replace_stop(route_part, 1, replacing_company)
        self.assertEqual(route.distance, expected_distance)
        self.assertEqual(route_part.distance, expected_distance)
        self.assertEqual(route_part.route[1], replacing_company)


class CrossoverTestCase(unittest.TestCase):
    def setUp(self) -> None:
        pass

    def __count_distance(self, v_from, v_to):
        return TestData.count_distance(v_from, v_to)

    def test_crossover_when_one_has_3_elements_and_another_is_bigger(self):
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
            RoutePart([TestData.depots[0], TestData.companies[1],
                       TestData.companies[2], TestData.companies[3], TestData.depots[0]])
        ]

        routes[0].add_route_part(route_parts[0])
        routes[1].add_route_part(route_parts[1])

        expected_first_route = [TestData.depots[0], TestData.companies[0],
                                TestData.companies[2], TestData.companies[3], TestData.depots[0]]
        expected_second_route = [TestData.depots[0],
                                 TestData.companies[1], TestData.depots[0]]
        expected_first_distance = self.__count_distance(TestData.depots[0], TestData.companies[0]) + self.__count_distance(
            TestData.companies[0], TestData.companies[2]) + self.__count_distance(TestData.companies[2], TestData.companies[3]) + self.__count_distance(TestData.companies[3], TestData.depots[0])
        expected_second_distance = self.__count_distance(
            TestData.depots[0], TestData.companies[1]) * 2

        first_crossover = routes[0].crossover(
            routes[0].get_route_part(0), routes[1].get_route_part(0), 1)
        second_crossover = routes[1].crossover(
            routes[1].get_route_part(0), routes[0].get_route_part(0), 1)

        self.assertEqual(first_crossover[0], expected_first_route)
        self.assertAlmostEqual(first_crossover[1], expected_first_distance)
        self.assertEqual(second_crossover[0], expected_second_route)
        self.assertAlmostEqual(second_crossover[1], expected_second_distance)

    def test_crossover_when_cross_index_is_on_first_half(self):
        routes = [
            Route(1, 10000, TestData.distances),
            Route(1, 10000, TestData.distances)
        ]

        routes[0].available_vertices = set(
            [company.id for company in TestData.companies])
        routes[1].available_vertices = set(
            [company.id for company in TestData.companies])

        route_parts = [
            RoutePart([TestData.depots[0], TestData.companies[0],
                       TestData.companies[1], TestData.depots[0]]),
            RoutePart([TestData.depots[0], TestData.companies[2],
                       TestData.companies[3], TestData.companies[4], TestData.depots[0]])
        ]

        routes[0].add_route_part(route_parts[0])
        routes[1].add_route_part(route_parts[1])

        expected_first_route = [TestData.depots[0], TestData.companies[0],
                                TestData.companies[3], TestData.companies[4], TestData.depots[0]]
        expected_second_route = [
            TestData.depots[0], TestData.companies[2], TestData.companies[1], TestData.depots[0]]
        expected_first_distance = self.__count_distance(TestData.depots[0], TestData.companies[0]) + self.__count_distance(
            TestData.companies[0], TestData.companies[3]) + self.__count_distance(TestData.companies[3], TestData.companies[4]) + self.__count_distance(TestData.companies[4], TestData.depots[0])
        expected_second_distance = self.__count_distance(TestData.depots[0], TestData.companies[2]) + self.__count_distance(
            TestData.companies[2], TestData.companies[1]) + self.__count_distance(TestData.companies[1], TestData.depots[0])

        first_crossover = routes[0].crossover(
            routes[0].get_route_part(0), routes[1].get_route_part(0), 1)
        second_crossover = routes[1].crossover(
            routes[1].get_route_part(0), routes[0].get_route_part(0), 1)

        self.assertEqual(first_crossover[0], expected_first_route)
        self.assertAlmostEqual(first_crossover[1], expected_first_distance)
        self.assertEqual(second_crossover[0], expected_second_route)
        self.assertAlmostEqual(second_crossover[1], expected_second_distance)

    def test_crossover_when_cross_index_is_on_second_half(self):
        routes = [
            Route(1, 10000, TestData.distances),
            Route(1, 10000, TestData.distances)
        ]

        routes[0].available_vertices = set(
            [company.id for company in TestData.companies])
        routes[1].available_vertices = set(
            [company.id for company in TestData.companies])

        route_parts = [
            RoutePart([TestData.depots[0], TestData.companies[0], TestData.companies[1],
                       TestData.companies[5], TestData.companies[6], TestData.depots[0]]),
            RoutePart([TestData.depots[0], TestData.companies[2], TestData.companies[3],
                       TestData.companies[4], TestData.companies[7], TestData.depots[0]])
        ]

        routes[0].add_route_part(route_parts[0])
        routes[1].add_route_part(route_parts[1])

        expected_first_route = [TestData.depots[0], TestData.companies[0], TestData.companies[1],
                                TestData.companies[5], TestData.companies[7], TestData.depots[0]]
        expected_second_route = [TestData.depots[0], TestData.companies[2],
                                 TestData.companies[3], TestData.companies[4], TestData.companies[6], TestData.depots[0]]
        expected_first_distance = self.__count_distance(TestData.depots[0], TestData.companies[0]) + self.__count_distance(TestData.companies[0], TestData.companies[1]) + self.__count_distance(
            TestData.companies[1], TestData.companies[5]) + self.__count_distance(TestData.companies[5], TestData.companies[7]) + self.__count_distance(TestData.companies[7], TestData.depots[0])
        expected_second_distance = self.__count_distance(TestData.depots[0], TestData.companies[2]) + self.__count_distance(TestData.companies[2], TestData.companies[3]) + self.__count_distance(
            TestData.companies[3], TestData.companies[4]) + self.__count_distance(TestData.companies[4], TestData.companies[6]) + self.__count_distance(TestData.companies[6], TestData.depots[0])

        first_crossover = routes[0].crossover(
            routes[0].get_route_part(0), routes[1].get_route_part(0), 3)
        second_crossover = routes[1].crossover(
            routes[1].get_route_part(0), routes[0].get_route_part(0), 3)

        self.assertEqual(first_crossover[0], expected_first_route)
        self.assertAlmostEqual(first_crossover[1], expected_first_distance)
        self.assertEqual(second_crossover[0], expected_second_route)
        self.assertAlmostEqual(second_crossover[1], expected_second_distance)


# class ManagingStopsTestCase(TestCase):
#     def setUp(self) -> None:
#         pass
#
#     def __count_distance(self, v_from, v_to):
#         return mpu.haversine_distance(v_from.get_coords(), v_to.get_coords())
#
#     def test_add_and_remove_the_same_vertex_on_first_position_at_start_route_part_gives_correct_distance(self):
#         route = Route(1, 10000, TestData.distances)
#         route_part = RoutePart([TestData.depots[0], TestData.depots[0]])
#         route.add_route_part(route_part)
#
#         self.assertEqual(route.distance, 0)
#
#         expected_route_length_after_add = 3
#         expected_distance_after_add = self.__count_distance(TestData.depots[0], TestData.companies[0])
#         expected_route_length_after_remove = 2
#         expected_distance_after_remove = 0
#
#         #add
#         route.add_stop(route_part, 0, TestData.companies[0])
#         self.assertEqual(route_part.length, expected_route_length_after_add)
#         self.assertAlmostEqual(route_part.distance, expected_distance_after_add)
#         self.assertEqual(route_part.route[0], TestData.companies[0])
#         self.assertEqual(route_part.route[1], TestData.depots[0])
#         self.assertEqual(route_part.route[2], TestData.depots[0])
#
#         #remove
#         route.remove_stop(route_part, 0)
#         self.assertEqual(route_part.length, expected_route_length_after_remove)
#         self.assertAlmostEqual(route_part.distance, expected_distance_after_remove)
#         self.assertEqual(route_part.route[0], TestData.depots[0])
#         self.assertEqual(route_part.route[1], TestData.depots[0])
#
#     def test_add_and_remove_the_same_vertex_on_first_position_at_existing_route_part_gives_correct_distance(self):
#         route = Route(1, 10000, TestData.distances)
#         route_part = RoutePart([TestData.depots[0], TestData.companies[0], TestData.depots[0]])
#         route.add_route_part(route_part)
#
#         self.assertEqual(route.distance, self.__count_distance(TestData.companies[0], TestData.depots[0]) * 2)
#
#         expected_route_length_after_add = 4
#         expected_distance_after_add = self.__count_distance(TestData.companies[1], TestData.depots[0]) + self.__count_distance(TestData.depots[0], TestData.companies[0]) * 2
#         expected_route_length_after_remove = 3
#         expected_distance_after_remove = self.__count_distance(TestData.companies[0], TestData.depots[0]) * 2
#
#         #add
#         route.add_stop(route_part, 0, TestData.companies[1])
#         self.assertEqual(route_part.length, expected_route_length_after_add)
#         self.assertAlmostEqual(route_part.distance, expected_distance_after_add)
#         self.assertEqual(route_part.route[0], TestData.companies[1])
#         self.assertEqual(route_part.route[1], TestData.depots[0])
#         self.assertEqual(route_part.route[2], TestData.companies[0])
#         self.assertEqual(route_part.route[3], TestData.depots[0])
#
#         #remove
#         route.remove_stop(route_part, 0)
#         self.assertEqual(route_part.length, expected_route_length_after_remove)
#         self.assertAlmostEqual(route_part.distance, expected_distance_after_remove)
#         self.assertEqual(route_part.route[0], TestData.depots[0])
#         self.assertEqual(route_part.route[1], TestData.companies[0])
#         self.assertEqual(route_part.route[2], TestData.depots[0])
#
#     def __recount_route(self, route):
#         distance = 0
#         for i, vertex in enumerate(route.route[1:]):
#             distance += self.__count_distance(route.route[i], vertex)
#
#         return distance
#
#     def test_add_and_remove_n_vertices_on_route_part_gives_correct_distance(self):
#         n = random.randint(2, 9)
#         route = Route(1, 10000, TestData.distances)
#         route_part = RoutePart([TestData.depots[0], TestData.depots[0]])
#
#         for i in range(n):
#             random_index = random.randint(0, route_part.length - 1)
#             random_company = TestData.companies[random.randint(0, len(TestData.companies) - 1)]
#             route.add_stop(route_part, random_index, random_company)
#             expected_distance = self.__recount_route(route_part)
#             self.assertAlmostEqual(route_part.distance, expected_distance)
#             self.assertEqual(route_part.route[random_index], random_company)
#
#         self.assertEqual(route_part.length, n + 2)
#
#         for i in range(route_part.length):
#             random_index = random.randint(0, route_part.length - 1)
#             route.remove_stop(route_part, random_index)
#             expected_distance = self.__recount_route(route_part)
#             self.assertAlmostEqual(route_part.distance, expected_distance)
