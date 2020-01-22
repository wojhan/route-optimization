from unittest import TestCase
from unittest.mock import Mock
import copy


from .utils import create_vertices, count_distance
from genetic import utils


class BreedingForOneDayTestCase(TestCase):
    def setUp(self):
        self.depot = create_vertices(utils.Depot, 1)
        self.companies = create_vertices(utils.Company, 30)
        self.hotels = create_vertices(utils.Hotel, 50)

        max_profit = 0
        for company in self.companies:
            max_profit += company.profit
        self.max_profit = max_profit

        route_with_one_company = [self.depot[0]] + [self.companies[1]] + [self.depot[0]]

        route_with_duplicates = [self.depot[0]] + [self.companies[1]] + [self.companies[1]] + [self.companies[1]] + [self.depot[0]]

        routes_without_common_genes = [
            [self.depot[0]] + self.companies[:3] + [self.depot[0]],
            [self.depot[0]] + self.companies[3:6] + [self.depot[0]],
            [self.depot[0]] + self.companies[6:9] + [self.depot[0]],
            [self.depot[0]] + self.companies[9:12] + [self.depot[0]],
            [self.depot[0]] + self.companies[12:15] + [self.depot[0]],
            [self.depot[0]] + self.companies[15:18] + [self.depot[0]],
            [self.depot[0]] + self.companies[18:21] + [self.depot[0]],
            [self.depot[0]] + self.companies[21:24] + [self.depot[0]],
            [self.depot[0]] + self.companies[24:27] + [self.depot[0]],
            [self.depot[0]] + self.companies[27:30] + [self.depot[0]],
        ]

        routes_with_common_genes = [
            [self.depot[0]] + self.companies[:3] + [self.depot[0]],
            [self.depot[0]] + self.companies[2:4] +
            [self.companies[10]] + [self.depot[0]],
            [self.depot[0]] + self.companies[3:5] +
            [self.companies[12]] + [self.depot[0]],
            [self.depot[0]] + self.companies[6:9] + [self.depot[0]],
            [self.depot[0]] + self.companies[8:11] + [self.depot[0]],
            [self.depot[0]] + self.companies[15:18] + [self.depot[0]],
            [self.depot[0]] + self.companies[18:21] + [self.depot[0]],
            [self.depot[0]] + self.companies[21:24] + [self.depot[0]],
            [self.depot[0]] + self.companies[24:27] + [self.depot[0]],
            [self.depot[0]] + self.companies[27:30] + [self.depot[0]],
        ]

        self.population_without_common_genes = []
        self.population_with_common_genes = []
        self.population_with_one_company = [
            utils.Route([utils.SubRoute(route_with_one_company, self.max_profit)], self.max_profit),
            utils.Route([utils.SubRoute(route_with_one_company, self.max_profit)], self.max_profit),
            ]
        self.population_with_duplicates = [
            utils.Route([utils.SubRoute(route_with_duplicates, self.max_profit)], self.max_profit),
            utils.Route([utils.SubRoute(route_with_duplicates, self.max_profit)], self.max_profit),
        ]

        distance = 0

        for i in range(10):
            subroute = utils.SubRoute(
                routes_without_common_genes[i], self.max_profit)
            route=utils.Route([subroute], self.max_profit)
            distance=max(distance, route.distance)
            self.population_without_common_genes.append(route)

            subroute=utils.SubRoute(
                routes_with_common_genes[i], self.max_profit)
            route=utils.Route([subroute], self.max_profit)
            distance=max(distance, route.distance)
            self.population_with_common_genes.append(route)

        self.tmax=int(10*distance)

    def test_init_with_one_day_and_10_routes_in_population(self):
        # When breeding is initialized
        breeding=utils.Breeding(
            self.companies, self.population_without_common_genes, self.tmax, self.max_profit, 1, Mock())
        # Then population is equal to <population>
        self.assertEqual(breeding.population,
                         self.population_without_common_genes)
        # And population's length is equal to 10
        self.assertEqual(len(breeding.population), 10)
        # And max profit is equal to <max_profit>
        self.assertEqual(breeding.max_profit, self.max_profit)
        # And vertices is equal to <companies>
        self.assertEqual(breeding.vertices, self.companies)
        # And days is eqal to 1 day
        self.assertEqual(breeding.days, 1)

    def test_crossover_when_no_common_genes_one_day_for_population(self):
        breeding = utils.Breeding(
            self.companies, self.population_without_common_genes, self.tmax, self.max_profit, 1, Mock())
        # When crossover is called
        parents = breeding.crossover()
        # Then ouput parents are the same as origin
        expected_population = []
        for couple in parents:
            for parent in couple:
                expected_population.append(parent)

        for route in expected_population:
            self.assertIn(route, self.population_without_common_genes)

    def test_crossover_when_common_genes_one_day_for_population(self):
        breeding = utils.Breeding(
            self.companies, self.population_with_common_genes, self.tmax, self.max_profit, 1, Mock())
        # When crossover is called
        parents = breeding.crossover()
        # Then each route doesn't exceed distance limit
        for couple in parents:
            for route in couple:
                self.assertLessEqual(route.distance, self.tmax)

    def test_crossover_when_common_genes_one_day_two_children_below_limit(self):
        parent_a = self.population_with_common_genes[1].routes[0].route
        parent_b = self.population_with_common_genes[2].routes[0].route

        possible_routes = [
            parent_a[:2] + parent_b[1:],
            parent_b[:1] + parent_a[2:]
        ]

        tmax = 0
        for route in possible_routes:
            subroute = utils.SubRoute(route, self.max_profit)
            tmax = max(tmax, subroute.distance)

        # When two parents has common genes and their routes are below limit
        breeding = utils.Breeding(
            self.companies, self.population_with_common_genes[1:3], tmax, self.max_profit, 1, Mock())
        result = breeding.crossover()
        # Then routes are <possible_routes>
        for couple in result:
            for route in couple:
                self.assertIn(route.routes[0].route, possible_routes)
                self.assertLessEqual(route.routes[0].distance, tmax)

    def test_crossover_when_common_genes_one_day_one_child_below_limit(self):
        parent_a = self.population_with_common_genes[1].routes[0].route
        parent_b = self.population_with_common_genes[2].routes[0].route

        subroute_a = utils.SubRoute(
            parent_a[:2] + parent_b[1:], self.max_profit)
        subroute_b = utils.SubRoute(
            parent_b[:1] + parent_a[2:], self.max_profit)

        if subroute_a.distance > subroute_b.distance:
            tmax = subroute_b.distance
            possible_routes = [
                parent_a,
                parent_b,
                parent_b[:1] + parent_a[2:]
            ]
        else:
            tmax = subroute_a.distance
            possible_routes = [
                parent_a,
                parent_b,
                parent_a[:2] + parent_b[1:]
            ]

        # When two parents has common genes and one route is below limit
        breeding = utils.Breeding(
            self.companies, self.population_with_common_genes[1:3], tmax, self.max_profit, 1, Mock())
        result = breeding.crossover()
        # Then routes are <possible_routes>
        for couple in result:
            for route in couple:
                self.assertIn(route.routes[0].route, possible_routes)

    def test_crossover_when_common_genes_one_day_no_children_below_limit(self):
        population = copy.deepcopy(self.population_with_common_genes[1:3])
        # When two parents has common genes and any route is below limit
        breeding = utils.Breeding(
            self.companies, self.population_with_common_genes[1:3], 0, self.max_profit, 1, Mock())
        result = breeding.crossover()
        possible_routes = [route.routes[0].route.__repr__()
                           for route in population]
        # Then routes are the same as origin
        for couple in result:
            for route in couple:
                self.assertIn(
                    route.routes[0].route.__repr__(), possible_routes)

    def test_crossover_when_common_genes_one_day_returns_whole_population(self):
        population_length_before = len(self.population_with_common_genes)

        # When crossover has been doing
        breeding = utils.Breeding(
            self.companies, self.population_with_common_genes, self.tmax, self.max_profit, 1, Mock())
        result = breeding.crossover()
        new_population = []
        for couple in result:
            for route in couple:
                new_population.append(route)
        # Then result length is equal to <population_length_before>
        self.assertEqual(len(new_population), population_length_before)

    def test_mutate_when_no_companies_to_add_one_day(self):
        population = copy.deepcopy(self.population_without_common_genes[1:3])
        population_length_before = len(
            self.population_without_common_genes[1:3])

        possible_routes = [route.routes[0].route.__repr__()
                           for route in population]

        # When mutation is processing and there's no any companies to add
        breeding = utils.Breeding(
            [], self.population_without_common_genes[1:3], self.tmax, self.max_profit, 1, Mock())
        crossovered = breeding.crossover()
        new_population = breeding.mutate(crossovered)
        # Then population has no changed and its length is equal to <population_length_before>
        for route in new_population:
            self.assertIn(route.routes[0].route.__repr__(), possible_routes)
        self.assertEqual(len(new_population), population_length_before)

    def test_mutate_when_one_company_to_add_one_day_below_limit(self):
        population = copy.deepcopy(self.population_without_common_genes[1:3])
        population_length_before = len(
            self.population_without_common_genes[1:3])

        impossible_routes = [route.routes[0].route.__repr__()
                             for route in population]

        # When mutation is processing and there's an one company to add
        breeding = utils.Breeding(
            [self.companies[0]], self.population_without_common_genes[1:3], 500000, self.max_profit, 1, Mock())
        crossovered = breeding.crossover()
        new_population = breeding.mutate(crossovered)
        # Then population is changed and its length is equal to <population_length_before>
        for route in new_population:
            self.assertNotIn(
                route.routes[0].route.__repr__(), impossible_routes)
        self.assertEqual(len(new_population), population_length_before)
        # And a company is in new routes
        for route in new_population:
            self.assertIn(self.companies[0], route.routes[0].route)

    def test_mutate_when_one_company_to_add_one_day_above_limit(self):
        population = self.population_with_one_company
        population_length_before = len(population)

        possible_route = utils.SubRoute([self.depot[0], self.depot[0]], self.max_profit).route.__repr__()

        # When mutation is processing and there's an one company which couldn't be added
        breeding = utils.Breeding([self.companies[0]], self.population_with_one_company, 0, self.max_profit, 1, Mock())
        crossovered = breeding.crossover()
        new_population = breeding.mutate(crossovered)
        # Then population is the same as origin and its length is equal to <population_length_before>
        for route in new_population:
            self.assertIn(route.routes[0].route.__repr__(), possible_route)
        self.assertEqual(len(new_population), population_length_before)

    def test_mutate_when_route_has_duplicates_one_day(self):
        population = self.population_with_duplicates
        population_length_before = len(population)

        possible_route = utils.SubRoute([self.depot[0], self.companies[1], self.depot[0]], self.max_profit).route.__repr__()

        # When mutation is processing and the population has duplicates in its routes
        breeding = utils.Breeding([], self.population_with_duplicates, self.tmax, self.max_profit, 1, Mock())
        crossovered = breeding.crossover()
        new_population = breeding.mutate(crossovered)
        # Then population is equal to <possible_route> and its length is equal to <population_length>
        for route in new_population:
            self.assertIn(route.routes[0].route.__repr__(), possible_route)
        self.assertEqual(len(new_population), population_length_before)

        # When available companies are in route
        breeding.vertices = [self.companies[1], self.companies[1]]
        new_population = breeding.mutate(crossovered)
        # Then they are ignored and population is equal to <possible_route> and its length is equal to <population_length>
        for route in new_population:
            self.assertIn(route.routes[0].route.__repr__(), possible_route)
        self.assertEqual(len(new_population), population_length_before)

    def test_mutate_when_route_has_no_companies_in_route_one_day(self):
        pass

    def test_mutate_when_odd_population_one_day(self):
        pass

class BreedingForTwoDaysTestCase(TestCase):
    def setUp(self):
        self.depot = create_vertices(utils.Depot, 1)
        self.companies = create_vertices(utils.Company, 36)
        self.hotels = create_vertices(utils.Hotel, 50)

        max_profit = 0
        for company in self.companies:
            max_profit += company.profit
        self.max_profit = max_profit

        routes_with_one_company = [
            [self.depot[0]] + [self.companies[1]] + [self.hotels[0]], 
            [self.hotels[0]] + [self.companies[2]] + [self.depot[0]]
        ]

        routes_with_duplicates = [
            [self.depot[0]] + [self.companies[1]] + [self.companies[1]] + [self.companies[1]] + [self.hotels[0]],
            [self.hotels[0]] + [self.companies[2]] + [self.companies[2]] + [self.companies[2]] + [self.depot[0]]
        ]

        routes_without_common_genes = [
            [[self.depot[0]] + self.companies[:3] + [self.hotels[0]], [self.hotels[0]] + self.companies[15:18] + [self.depot[0]]],
            [[self.depot[0]] + self.companies[3:6] + [self.hotels[0]], [self.hotels[0]] + self.companies[18:21] + [self.depot[0]]],
            [[self.depot[0]] + self.companies[6:9] + [self.hotels[0]], [self.hotels[0]] + self.companies[21:24] + [self.depot[0]]],
            [[self.depot[0]] + self.companies[9:12] + [self.hotels[0]], [self.hotels[0]] + self.companies[24:27] + [self.depot[0]]],
            [[self.depot[0]] + self.companies[12:15] + [self.hotels[0]], [self.hotels[0]] + self.companies[27:30] + [self.depot[0]]],
            [[self.depot[0]] + self.companies[30:33] + [self.hotels[0]], [self.hotels[0]] + self.companies[33:36] + [self.depot[0]]]
        ]

        routes_with_common_genes = [
            [[self.depot[0]] + self.companies[:2] + [self.companies[21]] + [self.companies[30]] + [self.hotels[0]], [self.hotels[0]] + self.companies[2:4] + [self.companies[24]] + [self.companies[32]] + [self.depot[0]]],
            [[self.depot[0]] + self.companies[2:4] + [self.companies[21]] + [self.companies[31]] + [self.hotels[0]], [self.hotels[0]] + self.companies[4:6] + [self.companies[24]] + [self.companies[33]] + [self.depot[0]]]
        ]

        self.population_without_common_genes = []
        self.population_with_common_genes = []
        self.population_with_one_company = [
            utils.Route([utils.SubRoute(routes_with_one_company[0], self.max_profit), utils.SubRoute(routes_with_one_company[1], self.max_profit)], self.max_profit),
            utils.Route([utils.SubRoute(routes_with_one_company[0], self.max_profit), utils.SubRoute(routes_with_one_company[1], self.max_profit)], self.max_profit),
            ]
        self.population_with_duplicates = [
            utils.Route([utils.SubRoute(routes_with_duplicates[0], self.max_profit), utils.SubRoute(routes_with_duplicates[1], self.max_profit)], self.max_profit),
            utils.Route([utils.SubRoute(routes_with_duplicates[1], self.max_profit), utils.SubRoute(routes_with_duplicates[1], self.max_profit)], self.max_profit),
        ]

        distance = 0

        for i, route in enumerate(routes_without_common_genes):
            subroute1 = utils.SubRoute(routes_without_common_genes[i][0], self.max_profit)
            subroute2 = utils.SubRoute(routes_without_common_genes[i][1], self.max_profit)
            route = utils.Route([subroute1, subroute2], self.max_profit)
            distance = max(distance, route.distance)
            self.population_without_common_genes.append(route)

        for i, route in enumerate(routes_with_common_genes):
            subroute1 = utils.SubRoute(routes_with_common_genes[i][0], self.max_profit)
            subroute2 = utils.SubRoute(routes_with_common_genes[i][1], self.max_profit)
            route = utils.Route([subroute1, subroute2], self.max_profit)
            distance = max(distance, route.distance)
            self.population_with_common_genes.append(route)

        self.tmax=int(2*distance)

    def test_init_with_6_routes_in_population(self):
        # When breeding is initialized
        breeding=utils.Breeding(
            self.companies, self.population_without_common_genes, self.tmax, self.max_profit, 2, Mock())
        # Then population is equal to <population>
        self.assertEqual(breeding.population,
                         self.population_without_common_genes)
        # And population's length is equal to 10
        self.assertEqual(len(breeding.population), 6)
        # And max profit is equal to <max_profit>
        self.assertEqual(breeding.max_profit, self.max_profit)
        # And vertices is equal to <companies>
        self.assertEqual(breeding.vertices, self.companies)
        # And days is eqal to 1 day
        self.assertEqual(breeding.days, 2)

    def test_crossover_when_no_common_genes_for_population(self):
        breeding = utils.Breeding(
            self.companies, self.population_without_common_genes, self.tmax, self.max_profit, 1, Mock())
        # When crossover is called
        parents = breeding.crossover()
        # Then ouput parents are the same as origin
        expected_population = []
        for couple in parents:
            for parent in couple:
                expected_population.append(parent)

        for route in expected_population:
            self.assertIn(route, self.population_without_common_genes)

    def test_crossover_when_common_genes_for_population(self):
        breeding = utils.Breeding(
            self.companies, self.population_with_common_genes, self.tmax, self.max_profit, 1, Mock())
        # When crossover is called
        parents = breeding.crossover()
        # Then each route doesn't exceed distance limit
        for couple in parents:
            for route in couple:
                self.assertLessEqual(route.distance, self.tmax)