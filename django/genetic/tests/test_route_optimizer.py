import unittest

from genetic.route_optimizer import RouteOptimizer
from .utils import TestData

class RouteOptimizerTestCase(unittest.TestCase):
    def setUp(self) -> None:
        pass

    def __get_route_optimizer_without_breeding(self, days, pop_size = 1, elite_rate = 0.1):
        data = dict(depot=TestData.depots[0], companies=list(TestData.companies), hotels=list(TestData.hotels))
        ro = RouteOptimizer(1, data, 10000, days, population_size=pop_size, crossover_probability=0, mutation_probability=0, elitsm_rate=elite_rate)
        return ro

    def __get_route_optimizer_default_object(self, days, pop_size = 1):
        data = dict(depot=TestData.depots[0], companies=list(TestData.companies), hotels=list(TestData.hotels))
        ro = RouteOptimizer(1, data, 10000, days, population_size=pop_size)
        return ro

    def __get_route_optimizer_with_no_companies_possible(self, days):
        data = dict(depot=TestData.depots[0], companies=list(), hotels=list(TestData.hotels))
        ro = RouteOptimizer(1, data, 0, days, population_size=1)
        return ro

    def __get_route_optimizer_with_only_one_possible_company(self, days):
        data = dict(depot=TestData.depots[0], companies=[TestData.companies[0]], hotels=list(TestData.hotels))
        ro = RouteOptimizer(1, data, 10000, days, population_size=1)
        return ro

    def test_init_sets_population_as_a_empty_list(self):
        ro = self.__get_route_optimizer_default_object(1)

        expected_length = 0
        self.assertEqual(len(ro.population), expected_length)

    def test_init_distances_length_is_equal_to_sum_of_vertices(self):
        ro = self.__get_route_optimizer_default_object(1)

        expected_length = len(TestData.depots + TestData.companies + TestData.hotels)
        self.assertEqual(len(ro.distances), expected_length)

    # def test_init_distances_each_distance_dict_is_equal_to_sum_of_vertices(self):
    #     ro = self.__get_route_optimizer_default_object(1)
    #
    #     expected_length = len(TestData.depots + TestData.companies + TestData.hotels)
    #     for distances in ro.distances):
    #         self.assertEqual(len(distances), expected_length)
    #
    # def test_init_each_pair_of_distances_has_the_same_value(self):
    #     ro = self.__get_route_optimizer_default_object(1)
    #
    #     for key, distances in ro.distances.items():
    #         for key1, distances1 in distances.items():
    #             self.assertEqual(ro.distances[key][key1], ro.distances[key1][key])

    # generate_random_routes

    def test_generate_random_route_for_one_day_is_less_than_equal_max_distance(self):
        ro = self.__get_route_optimizer_with_no_companies_possible(1)

        ro.generate_random_routes()

        expected_distance = 0
        self.assertLessEqual(ro.population[0][0].distance, expected_distance)

    def test_generate_random_route_for_one_day_has_depot_on_first_element_of_route(self):
        ro = self.__get_route_optimizer_default_object(1)

        ro.generate_random_routes()

        expected_first_element = TestData.depots[0]
        self.assertEqual(ro.population[0][0].get_route_part(0).route[0], expected_first_element)

    def test_generate_random_route_for_one_day_has_depot_on_last_element_of_route(self):
        ro = self.__get_route_optimizer_default_object(1)

        ro.generate_random_routes()

        expected_last_element = TestData.depots[0]
        self.assertEqual(ro.population[0][0].get_route_part(0).route[-1], expected_last_element)

    def test_generate_random_route_for_one_day_has_n_additional_companies_in_route(self):
        ro = self.__get_route_optimizer_default_object(1)

        ro.generate_random_routes()

        expected_route_length = min(3*ro.generate_tries, len(TestData.companies)) + 2
        self.assertEqual(len(ro.population[0][0].get_route_part(0).route), expected_route_length)

    def test_generate_random_route_for_one_day_creates_a_population_with_only_one_route(self):
        ro = self.__get_route_optimizer_default_object(1)

        ro.generate_random_routes()

        expected_population_length = 1
        self.assertEqual(len(ro.population[0]), expected_population_length)

    def test_generate_random_route_for_one_day_has_no_duplicated_companies_in_route(self):
        ro = self.__get_route_optimizer_default_object(1)

        ro.generate_random_routes()

        route_set_length = len(set(ro.population[0][0].get_route_part(0).route))
        expected_route_length = route_set_length + 1
        self.assertEqual(len(ro.population[0][0].get_route_part(0).route), expected_route_length)

    def test_generate_random_route_for_one_day_has_correct_profit(self):
        ro = self.__get_route_optimizer_with_only_one_possible_company(1)

        ro.generate_random_routes()

        expected_profit = TestData.companies[0].profit
        self.assertEqual(ro.population[0][0].profit, expected_profit)

    def test_generate_random_route_for_two_days_has_route_part_distances_less_than_equal_max_distance(self):
        ro = self.__get_route_optimizer_with_no_companies_possible(2)

        ro.generate_random_routes()

        maximum_value = 0
        for route_part in ro.population[0][0].routes:
            self.assertLessEqual(route_part.distance, maximum_value)

    def test_generate_random_route_for_two_days_has_depot_on_first_element_of_first_route_part(self):
        ro = self.__get_route_optimizer_default_object(2)

        ro.generate_random_routes()

        expected_first_element = TestData.depots[0]
        first_element_of_first_route_part = ro.population[0][0].get_route_part(0).route[0]
        self.assertEqual(first_element_of_first_route_part, expected_first_element)

    def test_generate_random_route_for_two_days_has_depot_on_last_element_of_second_route_part(self):
        ro = self.__get_route_optimizer_default_object(2)

        ro.generate_random_routes()

        expected_last_element = TestData.depots[0]
        last_element_of_second_route_part = ro.population[0][0].get_route_part(1).route[-1]
        self.assertEqual(last_element_of_second_route_part, expected_last_element)

    # def test_generate_random_route_for_two_days_both_route_parts_has_common_hotel(self):
    #     ro = self.__get_route_optimizer_default_object(2)
    #
    #     ro.generate_random_routes()
    #
    #     first_route_hotel = ro.population[0][0].get_route_part(0).route[-1]
    #     second_route_hotel = ro.population[0][0].get_route_part(1).route[0]
    #     self.assertEqual(first_route_hotel, second_route_hotel)

    def test_generate_random_route_for_two_days_has_no_duplicated_companies(self):
        ro = self.__get_route_optimizer_with_only_one_possible_company(2)

        ro.generate_random_routes()

        first_route_part_route = ro.population[0][0].get_route_part(0).route
        second_route_part_route = ro.population[0][0].get_route_part(1).route
        route_length = len(first_route_part_route[1:-1] + second_route_part_route[1:-1]) + 4
        expected_route_length = len(set(first_route_part_route[1:-1] + second_route_part_route[1:-1])) + 4
        self.assertEqual(route_length, expected_route_length)

    def test_generate_random_route_for_more_than_two_days_has_route_part_distances_less_than_equal_max_distance(self):
        ro = self.__get_route_optimizer_with_no_companies_possible(3)

        ro.generate_random_routes()

        maximum_value = 0
        for route_part in ro.population[0][0].routes:
            self.assertLessEqual(route_part.distance, maximum_value)

    # def test_generate_random_route_for_more_than_two_days_has_the_common_hotels_where_stopping_and_starting(self):
    #     ro = self.__get_route_optimizer_default_object(3)
    #
    #     ro.generate_random_routes()
    #
    #     self.assertEqual(ro.population[0][0].get_route_part(0).route[-1], ro.population[0][0].get_route_part(1).route[0])
    #     self.assertEqual(ro.population[0][0].get_route_part(1).route[-1], ro.population[0][0].get_route_part(2).route[0])

    def test_generate_random_route_for_more_than_two_days_starts_at_depot(self):
        ro = self.__get_route_optimizer_default_object(3)

        ro.generate_random_routes()

        expected_start_element = TestData.depots[0]
        self.assertEqual(ro.population[0][0].get_route_part(0).route[0], expected_start_element)

    def test_generate_random_route_for_more_than_two_days_stops_at_depot(self):
        ro = self.__get_route_optimizer_default_object(3)

        ro.generate_random_routes()

        expected_stop_element = TestData.depots[0]
        self.assertEqual(ro.population[0][0].get_route_part(2).route[-1], expected_stop_element)

    # run

    # def test_run_elite_number_population_has_no_changed_for_one_iteration(self):
    #     ro = self.__get_route_optimizer_without_breeding(1, pop_size=20)
    #
    #     ro.generate_random_routes()
    #     ro.run(1)
    #
    #     self.assertEqual(ro.population[0][0], ro.population[1][0])
    #
    # def test_run_elite_number_population_has_no_changed_for_more_than_one_iteration(self):
    #     ro = self.__get_route_optimizer_without_breeding(1, pop_size=20)
    #
    #     ro.generate_random_routes()
    #     ro.run(2)
    #
    #     self.assertEqual(ro.population[0][0], ro.population[1][0])
    #     self.assertEqual(ro.population[1][0], ro.population[2][0])
    #
    # def test_run_has_correct_length_of_population_for_one_iteration(self):
    #     ro = self.__get_route_optimizer_default_object(1, pop_size=20)
    #
    #     ro.generate_random_routes()
    #     ro.run(1)
    #
    #     expected_population_length = 20
    #     self.assertEqual(len(ro.population[-1]), expected_population_length)
    #
    # def test_run_has_correct_length_of_population_for_more_than_one_iteration(self):
    #     ro = self.__get_route_optimizer_default_object(1, pop_size=20)
    #
    #     ro.generate_random_routes()
    #     ro.run(2)
    #
    #     expected_population_length = 20
    #     for pop in ro.population:
    #         self.assertEqual(len(pop), expected_population_length)
