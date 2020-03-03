import logging
from datetime import datetime

import billiard as multiprocessing
import math

import channels.layers
import mpu
import random
import numpy as np
import ray
from asgiref.sync import async_to_sync
from typing import List

from .routes import RoutePart, Route
from .vertices import Hotel, Depot
from .utils import crossover

logger = logging.getLogger('data')

class RouteObserver:
    def __init__(self, business_trip_id: int) -> None:
        """
        Arguments:
            business_trip_id {int} -- id of business_trip to observing a progress of actual route optimizer
        """
        self.group_name = 'business_trip_%s' % business_trip_id
        self.channel_layer = channels.layers.get_channel_layer()
        self.progress = 0
        self.last_time = datetime.now()

    def set_progress(self, current: float, total: float) -> None:
        """
        Setting a progress for actual processing route

        Arguments:
            current {float} -- current value of processed data
            total {float} -- total value of data to be processed
        """
        self.total = total
        self.progress = current
        self.update()

    def increment(self, value: int = 1) -> None:
        """
        Increments of progress for actual processing route. It is updating
        every 200 instructions processed using websocket messages.

        Keyword Arguments:
            value {int} -- incrementation value (default: {1})
        """
        self.progress += value
        if self.progress % int(self.total / 200) == 0:
            self.update()

    def update(self) -> None:
        """
        Sending websocket message with current progress
        """
        now = datetime.now()
        diff = now - self.last_time
        left_progress = (1 - round(self.progress / self.total, 2)) * 100
        time_left = left_progress * diff.seconds
        self.last_time = datetime.now()
        async_to_sync(self.channel_layer.group_send)(self.group_name, {'type': 'progress_message',
                                                                       'message': round((self.progress / self.total),
                                                                                        2), 'timeLeft': time_left})
class RouteOptimizer:
    def __init__(self, business_trip_id: int, data: dict,
                 max_distance: int, days: int, crossover_probability: float = 0.7, mutation_probability: float = 0.4,
                 elitsm_rate: float = 0.1, population_size: int = 60, iterations:int = 1000):
        self.population: List[List[Route]] = list()
        self.depot = data['depot']
        self.companies = data['companies']
        self.hotels = data['hotels']
        self.business_trip_id = business_trip_id
        self.max_distance = max_distance
        self.days = days
        self.generate_tries = 5
        self.crossover_probability = crossover_probability
        self.mutation_probability = mutation_probability
        self.elitsm_rate = elitsm_rate
        self.population_size = population_size
        self.observer = RouteObserver(business_trip_id)
        self.iterations = iterations

        self.observer.set_progress(0, self.__get_total_progress())

        logger.info('Started generating route for business trip id %d' % business_trip_id)
        self.__count_distances()

    def __get_total_progress(self):
        count_distance = 2 * len([self.depot] + self.companies + self.hotels)**2
        generate_routes = self.population_size * self.generate_tries * self.days
        breed = self.iterations * (1 + 3 * self.population_size)

        return count_distance + generate_routes + breed

    def __count_distances(self) -> dict:
        logger.info('Started counting distances for route.')
        all_vertices_length = len([self.depot] + self.companies + self.hotels)
        distances_array = np.zeros((all_vertices_length, all_vertices_length), dtype=[('id', int), ('distance', float)])
        profits_by_distances_array = np.zeros((all_vertices_length, all_vertices_length), dtype=[('id', int), ('profit', float)])
        self.vertex_uuids = dict()
        self.vertex_ids = dict()

        all_vertices = [self.depot] + self.companies + self.hotels

        for i, vertex in enumerate(all_vertices):
            vertex.id = i

        for i, vertex in enumerate(all_vertices):
            self.vertex_ids[i] = vertex
            for j, another_vertex in enumerate(all_vertices):
                distance = mpu.haversine_distance(vertex.get_coords(), another_vertex.get_coords())
                profits_by_distances_array[i, j] = (another_vertex.id, another_vertex.profit / distance if distance != 0 else 0)
                profits_by_distances_array[j, i] = (vertex.id, vertex.profit / distance if distance != 0 else 0)
                distances_array[i,j] = (another_vertex.id, distance)
                distances_array[j,i] = (vertex.id, distance)

        self.distances = distances_array
        self.profits_by_distances = profits_by_distances_array
        logger.info('Finished counting distances for route')

    def __add_random_profitable_company_to_route(self, route:Route, route_part: RoutePart, index:int, top: int) -> None:
        profitable = np.sort(self.profits_by_distances[route_part.route[index].id], order='profit')[::-1]
        result = list()

        for id in profitable:
            if id[0] in route.available_vertices:
                company = self.vertex_ids[id[0]]
                result.append(company)

            if len(result) == top:
                break

        top = len(result)

        if top:
            # random_company = result[random.randint(0, top - 1)]
            random_company = result[int(round(random.random() * (top - 1)))]
            route.add_stop(route_part, index, random_company)

    def __add_random_nearest_company_to_route(self, route: Route, route_part: RoutePart, index: int, top: int):
        nereast = np.sort(self.distances[route_part.route[index].id], order='distance')
        result = list()
        
        for id in nereast:
            if id[0] in route.available_vertices:
                company = self.vertex_ids[id[0]]
                result.append(company)
                
            if len(result) == top:
                break

        top = len(result)

        if top:
            random_company = result[int(round(random.random() * (top - 1)))]
            route.add_stop(route_part, index, random_company)

    def __add_random_company_to_route(self, route: Route, route_part: RoutePart, index: int):
        random_index_company = int(round(random.random() * (len(route.available_vertices) - 1)))
        availabe_list = list(route.available_vertices)
        random_company = self.vertex_ids[availabe_list[random_index_company]]

        route.add_stop(route_part, index, random_company)

    def __add_nearest_hotel_to_route(self, route: Route):
        if self.days > 1:
            for day, route_part in enumerate(route.routes):
                indexes = (0, route_part.length - 1)
                nearest = (
                    np.sort(self.distances[route_part.route[1].id], order='distance'),
                    np.sort(self.distances[route_part.route[-2].id], order='distance'),
                )
                if day == 0:
                    indexes = (route_part.length - 1,)
                    nearest = (np.sort(self.distances[route_part.route[-2].id], order='distance'),)
                elif day == self.days - 1:
                    indexes = (0,)
                    nearest = (np.sort(self.distances[route_part.route[1].id], order='distance'),)

                for i, index in enumerate(indexes):
                    for id in nearest[i]:
                        vertex = self.vertex_ids[id[0]]

                        if isinstance(vertex, Hotel):
                            replaced = route.replace_stop(route_part, index, vertex)
                            if not replaced:
                                raise Exception("No possible hotels dude")
                            break

    def generate_random_routes(self):
        logger.info('Started generating random routes. Population size = %d, number of days = %d' % (self.population_size, self.days))
        population: List[Route] = list()
        for i in range(self.population_size):
            route = Route(self.days, self.max_distance * 0.7, self.distances)
            route.available_vertices = set([company.id for company in self.companies])
            route.vertices_ids = self.vertex_ids

            to_process = list()
            tries = list()

            for j in range(self.days):
                route_part = RoutePart([self.depot, self.depot])
                route.add_route_part(route_part)
                to_process.append(route_part)
                tries.append(0)

            current_index = 0
            while to_process and route.available_vertices:
                current = to_process[current_index]
                if tries[current_index] == self.generate_tries - 1:
                    del to_process[current_index]
                    if len(to_process) == 0:
                        break
                    current_index = (current_index + 1) % len(to_process)
                    continue

                random_index = random.randint(1, current.length - 2) if current.length > 2 else 1
                self.__add_random_company_to_route(route, current, random_index)
                random_index = random.randint(1, current.length - 2) if current.length > 2 else 1
                self.__add_random_profitable_company_to_route(route, current, random_index, 5)
                random_index = random.randint(1, current.length - 2) if current.length > 2 else 1
                self.__add_random_nearest_company_to_route(route, current, random_index, 5)
                route.max_distance = self.max_distance
                self.__add_nearest_hotel_to_route(route)

                tries[current_index] += 1
                current_index = (current_index + 1) % len(to_process)
                self.observer.increment()
            population.append(route)
            route.count_profit()
        population.sort(key=lambda x: x.profit, reverse=True)
        self.population.append(population)

        logger.info('Finished generating random routes for route')

    def __tournament_choose(self, elements, t_size, n_elements):
        if len(elements) <= t_size:
            t_size = len(elements)

        chosen_elements = [elements[index] for index in random.sample(range(len(elements)), t_size)]
        chosen_elements.sort(key=lambda x: x.profit, reverse=True)

        return chosen_elements[:n_elements]

    def __do_elitism_operation(self, t_size: int = 5):
        elite_number = math.floor(self.elitsm_rate * self.population_size)
        next_population = self.population[-1][:elite_number].copy()

        for i in range(self.population_size - elite_number):
            route = self.__tournament_choose(self.population[-1][elite_number:], t_size, 1)
            next_population.append(route[0])
            # self.observer.increment()

        self.population.append(next_population)
        self.observer.increment()

    def __couple_routes(self, population) -> List[List[Route]]:
        couples = list()
        pop = population.copy()

        for i in range(0, len(population), 2):
            random_indexes = random.sample(range(0, len(pop)), 2)
            first = pop[random_indexes[0]]
            second = pop[random_indexes[1]]
            couples.append([first, second])
            pop.remove(first)
            pop.remove(second)
            self.observer.increment()

        return couples

    def __pack_to_crossover(self, couples: List[List[Route]]) -> List[List]:
        packed = list()
        for couple in couples:
            packed.append([couple, self.crossover_probability, self.mutation_probability])

        return packed

    def __get_entropy(self, population: List[Route]):
        profit_sum = 0

        for route in population:
            profit_sum += route.profit

        return profit_sum / len(population)

    def run(self):
        for i in range(1, self.iterations + 1):
            self.population.append(self.population[-1].copy())
            logger.info('Started processing %d iteration of %d' % (i, self.iterations))
            # self.__do_elitism_operation(t_size=2)
            elite_number = math.floor(self.elitsm_rate * self.population_size)
            couples = self.__couple_routes(self.population[-1][elite_number:])
            packed_to_crossover = self.__pack_to_crossover(couples)

            self.population[-1] = self.population[-1][:elite_number]
            # self.population[-1] = []

            self.observer.increment(int(self.population_size*1.5))

            for packed in packed_to_crossover:
                couple = crossover(packed)
                couple[0].count_profit()
                couple[1].count_profit()
                self.population[-1].append(couple[0])
                self.population[-1].append(couple[1])
                self.observer.increment()

                for day, route in enumerate(couple[0].routes):
                    if day == 0:
                        if not isinstance(route.route[0], Depot):
                            raise Exception()
                        if self.days > 1 and not isinstance(route.route[-1], Hotel):
                            raise Exception()
                    elif day == len(couple[0].routes) - 1:
                        if not isinstance(route.route[-1], Depot):
                            raise Exception()
                        if self.days > 1 and not isinstance(route.route[0], Hotel):
                            raise Exception()
                    else:
                        if not isinstance(route.route[0], Hotel):
                            raise Exception()
                        if not isinstance(route.route[-1], Hotel):
                            raise Exception()

                for day, route in enumerate(couple[1].routes):
                    if day == 0:
                        if not isinstance(route.route[0], Depot):
                            raise Exception()
                        if self.days > 1 and not isinstance(route.route[-1], Hotel):
                            raise Exception()
                    elif day == len(couple[1].routes) - 1:
                        if not isinstance(route.route[-1], Depot):
                            raise Exception()
                        if self.days > 1 and not isinstance(route.route[0], Hotel):
                            raise Exception()
                    else:
                        if not isinstance(route.route[0], Hotel):
                            raise Exception()
                        if not isinstance(route.route[-1], Hotel):
                            raise Exception()


            self.population[-1].sort(key=lambda x: x.profit, reverse=True)
            entropy = self.__get_entropy(self.population[-1])

            if 0.9 * self.population[-1][0].profit <= entropy <= 1.1 * self.population[-1][0].profit:
                logger.info('Finished processing iteration %d of %d' % (i, self.iterations))
                break
            logger.info('Finished processing iteration %d of %d' % (i, self.iterations))
