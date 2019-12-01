from unittest.mock import Mock
from django.test import TestCase
from genetic import utils

import random
import mpu

mock_vertices = [
    {'coords': {'lat': 53.3970475, 'lng': 20.9841555}, 'profit': 0},
    {'coords': {'lat': 52.5193174, 'lng': 19.6535929}, 'profit': 3},
    {'coords': {'lat': 54.5435069, 'lng': 16.0867389}, 'profit': 9},
    {'coords': {'lat': 51.8864568, 'lng': 14.97223769}, 'profit': 10},
    {'coords': {'lat': 50.3696194, 'lng': 21.70995514}, 'profit': 5},
    {'coords': {'lat': 49.2586957, 'lng': 15.94141079}, 'profit': 3},
    {'coords': {'lat': 52.7308204, 'lng': 23.31740274}, 'profit': 2},
    {'coords': {'lat': 53.6898920, 'lng': 22.58589941}, 'profit': 8},
    {'coords': {'lat': 54.6124091, 'lng': 14.38239045}, 'profit': 7},
    {'coords': {'lat': 52.3850783, 'lng': 15.96447691}, 'profit': 4},
    {'coords': {'lat': 50.1594155, 'lng': 15.94546004}, 'profit': 10},
    {'coords': {'lat': 50.4360163, 'lng': 18.32514358}, 'profit': 0},
    {'coords': {'lat': 49.0939224, 'lng': 23.45559379}, 'profit': 0},
]


routes = [
    {'route': [0, 7, 2, 11], 'distance': 1025.8009529278534, 'profit': 17},
    {'route': [0, 3, 11], 'distance': 722.8622216768758, 'profit': 10},
    {'route': [0, 6, 5, 11], 'distance': 1031.967418866743, 'profit': 5},
    {'route': [0, 4, 6, 11], 'distance': 1054.2849175575852, 'profit': 7},
    {'route': [0, 7, 2, 9, 11], 'distance': 1056.3741687114532, 'profit': 21},
    {'route': [0, 2, 11], 'distance': 825.8169492669477, 'profit': 9},
    {'route': [0, 3, 11], 'distance': 722.8622216768758, 'profit': 10},
    {'route': [0, 3, 10, 11], 'distance': 814.4064022871692, 'profit': 20},
    {'route': [0, 8, 2, 11], 'distance': 1043.1664274011773, 'profit': 16},
    {'route': [0, 1, 11], 'distance': 381.4076341404949, 'profit': 3},
]

# suma = 0
# suma += mpu.haversine_distance((mock_vertices[0]['coords']['lat'], mock_vertices[0]['coords']['lng']),
#                                (mock_vertices[7]['coords']['lat'], mock_vertices[7]['coords']['lng']))
# suma += mpu.haversine_distance((mock_vertices[7]['coords']['lat'], mock_vertices[7]['coords']['lng']),
#                                (mock_vertices[2]['coords']['lat'], mock_vertices[2]['coords']['lng']))
# suma += mpu.haversine_distance((mock_vertices[2]['coords']['lat'], mock_vertices[2]['coords']['lng']),
#                                (mock_vertices[11]['coords']['lat'], mock_vertices[11]['coords']['lng']))
# print('0-7-2-11 = {}'.format(suma))

# suma = 0
# suma += mpu.haversine_distance((mock_vertices[0]['coords']['lat'], mock_vertices[0]['coords']['lng']),
#                                (mock_vertices[3]['coords']['lat'], mock_vertices[3]['coords']['lng']))
# suma += mpu.haversine_distance((mock_vertices[3]['coords']['lat'], mock_vertices[3]['coords']['lng']),
#                                (mock_vertices[11]['coords']['lat'], mock_vertices[11]['coords']['lng']))
# print('0-3-11 = {}'.format(suma))

# suma = 0
# suma += mpu.haversine_distance((mock_vertices[0]['coords']['lat'], mock_vertices[0]['coords']['lng']),
#                                (mock_vertices[6]['coords']['lat'], mock_vertices[6]['coords']['lng']))
# suma += mpu.haversine_distance((mock_vertices[6]['coords']['lat'], mock_vertices[6]['coords']['lng']),
#                                (mock_vertices[5]['coords']['lat'], mock_vertices[5]['coords']['lng']))
# suma += mpu.haversine_distance((mock_vertices[5]['coords']['lat'], mock_vertices[5]['coords']['lng']),
#                                (mock_vertices[11]['coords']['lat'], mock_vertices[11]['coords']['lng']))
# print('0-6-5-11 = {}'.format(suma))

# suma = 0
# suma += mpu.haversine_distance((mock_vertices[0]['coords']['lat'], mock_vertices[0]['coords']['lng']),
#                                (mock_vertices[4]['coords']['lat'], mock_vertices[4]['coords']['lng']))
# suma += mpu.haversine_distance((mock_vertices[4]['coords']['lat'], mock_vertices[4]['coords']['lng']),
#                                (mock_vertices[6]['coords']['lat'], mock_vertices[6]['coords']['lng']))
# suma += mpu.haversine_distance((mock_vertices[6]['coords']['lat'], mock_vertices[6]['coords']['lng']),
#                                (mock_vertices[11]['coords']['lat'], mock_vertices[11]['coords']['lng']))
# print('0-4-6-11 = {}'.format(suma))

# suma = 0
# suma += mpu.haversine_distance((mock_vertices[0]['coords']['lat'], mock_vertices[0]['coords']['lng']),
#                                (mock_vertices[7]['coords']['lat'], mock_vertices[7]['coords']['lng']))
# suma += mpu.haversine_distance((mock_vertices[7]['coords']['lat'], mock_vertices[7]['coords']['lng']),
#                                (mock_vertices[2]['coords']['lat'], mock_vertices[2]['coords']['lng']))
# suma += mpu.haversine_distance((mock_vertices[2]['coords']['lat'], mock_vertices[2]['coords']['lng']),
#                                (mock_vertices[9]['coords']['lat'], mock_vertices[9]['coords']['lng']))
# suma += mpu.haversine_distance((mock_vertices[9]['coords']['lat'], mock_vertices[9]['coords']['lng']),
#                                (mock_vertices[11]['coords']['lat'], mock_vertices[11]['coords']['lng']))
# print('0-7-2-9-11 = {}'.format(suma))

# suma = 0
# suma += mpu.haversine_distance((mock_vertices[0]['coords']['lat'], mock_vertices[0]['coords']['lng']),
#                                (mock_vertices[2]['coords']['lat'], mock_vertices[2]['coords']['lng']))
# suma += mpu.haversine_distance((mock_vertices[2]['coords']['lat'], mock_vertices[2]['coords']['lng']),
#                                (mock_vertices[11]['coords']['lat'], mock_vertices[11]['coords']['lng']))
# print('0-2-11 = {}'.format(suma))

# suma = 0
# suma += mpu.haversine_distance((mock_vertices[0]['coords']['lat'], mock_vertices[0]['coords']['lng']),
#                                (mock_vertices[3]['coords']['lat'], mock_vertices[3]['coords']['lng']))
# suma += mpu.haversine_distance((mock_vertices[3]['coords']['lat'], mock_vertices[3]['coords']['lng']),
#                                (mock_vertices[10]['coords']['lat'], mock_vertices[10]['coords']['lng']))
# suma += mpu.haversine_distance((mock_vertices[10]['coords']['lat'], mock_vertices[10]['coords']['lng']),
#                                (mock_vertices[11]['coords']['lat'], mock_vertices[11]['coords']['lng']))
# print('0-3-10-11 = {}'.format(suma))

# suma = 0
# suma += mpu.haversine_distance((mock_vertices[0]['coords']['lat'], mock_vertices[0]['coords']['lng']),
#                                (mock_vertices[8]['coords']['lat'], mock_vertices[8]['coords']['lng']))
# suma += mpu.haversine_distance((mock_vertices[8]['coords']['lat'], mock_vertices[8]['coords']['lng']),
#                                (mock_vertices[2]['coords']['lat'], mock_vertices[2]['coords']['lng']))
# suma += mpu.haversine_distance((mock_vertices[2]['coords']['lat'], mock_vertices[2]['coords']['lng']),
#                                (mock_vertices[11]['coords']['lat'], mock_vertices[11]['coords']['lng']))
# print('0-8-2-11 = {}'.format(suma))

# suma = 0
# suma += mpu.haversine_distance((mock_vertices[0]['coords']['lat'], mock_vertices[0]['coords']['lng']),
#                                (mock_vertices[1]['coords']['lat'], mock_vertices[1]['coords']['lng']))
# suma += mpu.haversine_distance((mock_vertices[1]['coords']['lat'], mock_vertices[1]['coords']['lng']),
#                                (mock_vertices[11]['coords']['lat'], mock_vertices[11]['coords']['lng']))
# print('0-1-11 = {}'.format(suma))

# print('0-7', mpu.haversine_distance((mock_vertices[0].coords['lat'], mock_vertices[0].coords['lng']), (mock_vertices[0].coords['lat'], mock_vertices[0].coords['lng'])))


def random_routes():
    depots = [create_vertex_mock(str(0), mock_vertices[0]['coords'])]
    companies = [create_vertex_mock(
        str(i), mock_vertices[i]['coords'], mock_vertices[i]['profit']) for i in range(1, 11)]
    hotels = [create_vertex_mock(str(11), mock_vertices[11]['coords']), create_vertex_mock(
        str(12), mock_vertices[12]['coords'])]
    population = []

    for _ in range(10):
        route = utils.Route([depots[0], hotels[0]], 61)
        tmp_vertices = companies.copy()

        while route.distance <= 1100 and tmp_vertices:
            random_insert_index = random.randint(
                1, len(route.route) - 2) if len(route.route) > 2 else 1
            random_vertex_index = random.randint(0, len(tmp_vertices) - 1)

            vertex = tmp_vertices[random_vertex_index]

            route.add_stop(random_insert_index, vertex)

            if route.distance > 1100:
                route.remove_stop(vertex)
                break
            else:
                tmp_vertices.remove(vertex)

        population.append(route)


def create_vertex_mock(name, coords, profit=0, vertex_class='company'):
    if vertex_class == 'depot':
        mock_vertex = Mock(name, coords, spec_set=utils.Depot(name, coords))

    if vertex_class == 'hotel':
        mock_vertex = Mock(name, coords, spec_set=utils.Hotel(name, coords))

    if vertex_class == 'company':
        mock_vertex = Mock(name, coords, profit,
                           spec_set=utils.Company(name, coords, profit))

    mock_vertex.profit = profit
    mock_vertex.name = name
    mock_vertex.lat = coords['lat']
    mock_vertex.lng = coords['lng']

    return mock_vertex


def generate_test_population(tmax):
    depots = [create_vertex_mock(0, mock_vertices[0]['coords'], 0, 'depot')]
    companies = [create_vertex_mock(
        i, mock_vertices[i]['coords'], mock_vertices[i]['profit']) for i in range(1, 11)]
    hotels = [create_vertex_mock(11, mock_vertices[11]['coords'], 0, 'hotel'), create_vertex_mock(
        12, mock_vertices[12]['coords'], 0, 'hotel')]

    # TODO: generate population
    route_optimizer_attrs = {
        'depots': depots,
        'companies': companies,
        'hotels': hotels,
        'tmax': tmax,
        'population': []
    }
    route_optimizer = Mock(depots, companies, hotels, tmax)
    route_optimizer
    route_optimizer.count_max_profit.return_value = 61
    # route_optimizer.recount_route.side_effect = mock_route_recount_route


class RouteOptimizerCase(TestCase):
    def setUp(self):
        pass

    def test_creating_optimizer_instance(self):
        depots = [create_vertex_mock(
            str(0), mock_vertices[0]['coords'], 0, 'depot')]
        companies = [create_vertex_mock(
            str(i), mock_vertices[i]['coords'], mock_vertices[i]['profit']) for i in range(1, 11)]
        hotels = [create_vertex_mock(str(11), mock_vertices[11]['coords'], 0, 'hotel'), create_vertex_mock(
            str(12), mock_vertices[12]['coords'], 0, 'hotel')]
        ro = utils.RouteOptimizer(depots, companies, hotels, 1100, 2)

        for index, vertex in enumerate(ro.distances):
            for another_vertex_index, another_vertex in enumerate(ro.distances):
                if index == another_vertex_index:
                    self.assertEqual(ro.distances[index][index], 100000)
                else:
                    self.assertEqual(
                        ro.distances[index][another_vertex_index], ro.distances[another_vertex_index][index])


class RouteTestCase(TestCase):
    def setUp(self):
        # random_routes()
        # mock_routes = []
        # for route in routes:
        #     route = utils.Route()
        pass

    def test_counting_distance_on_start(self):
        mock_routes = []
        for route in routes:
            route_order = route['route']
            route_max_profit = route['profit']
            route_vertices = []
            for vertex in route_order:
                mock_vertex = utils.Company(
                    str(vertex), mock_vertices[vertex]['coords'], mock_vertices[vertex]['profit'])
                if vertex == 0:
                    mock_vertex = utils.Depot(
                        str(vertex), mock_vertices[vertex]['coords'])
                if vertex in (11, 12):
                    mock_vertex = utils.Hotel(
                        str(vertex), mock_vertices[vertex]['coords'])

                route_vertices.append(mock_vertex)
            mock_route = utils.Route(route_vertices, route_max_profit)
            mock_routes.append(mock_route)

        for i, route in enumerate(mock_routes):
            self.assertEqual(route.distance, routes[i]['distance'])

    def test_counting_distance_on_adding_and_removing_vertices(self):
        mock_routes = []
        vertices_to_add = []

        for route in routes:
            route_order = route['route']
            route_max_profit = route['profit']
            route_vertices = []
            for index, vertex in enumerate((route_order[0], route_order[-1])):
                if index == 0:
                    mock_vertex = utils.Depot(
                        str(vertex), mock_vertices[vertex]['coords'])
                else:
                    mock_vertex = utils.Hotel(
                        str(vertex), mock_vertices[vertex]['coords'])
                route_vertices.append(mock_vertex)
            mock_route = utils.Route(route_vertices, route_max_profit)
            mock_routes.append(mock_route)
            vertices_to_add.append([])
            for index, vertex in enumerate(route_order[1:len(route_order)-1]):
                vertices_to_add[-1].append(utils.Company(
                    str(vertex), mock_vertices[vertex]['coords'], mock_vertices[vertex]['profit']))

        base_distance = mpu.haversine_distance(
            (mock_vertices[0]['coords']['lat'], mock_vertices[0]['coords']['lng']), (mock_vertices[11]['coords']['lat'], mock_vertices[11]['coords']['lng']))

        for i, route in enumerate(mock_routes):
            self.assertEqual(route.distance, base_distance)

        for i, route in enumerate(mock_routes):
            for j, vertex in enumerate(vertices_to_add[i]):
                route.add_stop(len(route.route) - 1, vertex)
            self.assertEqual(route.distance, routes[i]['distance'])

            for j, vertex in enumerate(vertices_to_add[i]):
                route.remove_stop(vertex)
            self.assertEqual(route.distance, base_distance)

        # import pdb
        # pdb.set_trace()

        # utils.Route(self, )

# class BreedingCrossoverTestCase(TestCase):
#     def setUp(self):
#         # self.mock_vertices = []
#         # for i in range(20):
#         #     self.mock_vertices.append(Mock(i, mock_vertices[i]))

#         generate_test_population()

#     def test_breeding_init(self):
#         pass
