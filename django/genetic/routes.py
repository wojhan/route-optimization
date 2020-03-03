from typing import List, Dict
from .vertices import Vertex, Company

import numpy as np


class RoutePart:
    def __init__(self, route: List[Vertex]) -> None:
        self.distance = 0
        self.profit = 0
        self.route = route
        # self.distances = distances

    @property
    def length(self):
        return len(self.route)

    def add_stop(self, index, vertex: Vertex):
        self.route.insert(index, vertex)

    def remove_stop(self, index: int) -> None:
        del self.route[index]

    def replace_stop(self, index: int, vertex: Vertex) -> None:
        if index < len(self.route):
            self.route[index] = vertex

    def recount_route(self, distances) -> None:
        distance = 0
        for i, vertex in enumerate(self.route[1:]):
            distance += distances[self.route[i].id, vertex.id][1]
        self.distance = distance


class Route:
    def __init__(self, days, max_distance, distances) -> None:
        self.distance = 0
        self.profit = 0
        self.routes = list()
        self.days = days
        self.max_distance = max_distance
        self.distances = distances
        self.available_vertices = set()

    def count_distance(self, v_from, v_to):
        # return self.distances[v_from.uuid][v_to.uuid]
        return self.distances[v_from.id, v_to.id][1]

    def count_profit(self):
        vertices = list()

        profit = 0
        for part in self.routes:
            vertices += part.route

        vertices = set(vertices)

        for vertex in vertices:
            profit += vertex.profit

        self.profit = profit

    def recount_route_part(self, route_part: RoutePart):
        route_part.recount_route(self.distances)

    def get_route_part(self, day: int) -> RoutePart:
        return self.routes[day]

    def __count_part_route_part(self, route_part: RoutePart, start_index: int, stop_index: int) -> float:
        if start_index > stop_index:
            raise ValueError("start index is bigger than stop index")

        if start_index < 0 or start_index > route_part.length - 1:
            raise ValueError("start index is negative or is bigger than route length")

        if stop_index > route_part.length - 1:
            raise ValueError("stop index is bigger than route length")

        distance = 0

        for i, vertex in enumerate(route_part.route[start_index + 1:stop_index + 1]):
            distance += self.count_distance(route_part.route[start_index + i], vertex)

        return distance

    def add_route_part(self, route_part: RoutePart):
        if len(self.routes) < self.days:
            self.recount_route_part(route_part)
            self.routes.append(route_part)
            self.distance += route_part.distance

            for vertex in route_part.route[1:-1]:
                self.available_vertices.discard(vertex.id)

    def __increment_distance(self, route_part: RoutePart, value: float) -> None:
        route_part.distance += value
        self.distance += value

    def __decrement_distance(self, route_part: RoutePart, value: float) -> None:
        self.__increment_distance(route_part, -value)

    def __add_on_first_in_route_part(self, route_part: RoutePart, vertex) -> bool:
        distance = self.count_distance(vertex, route_part.route[0])
        if route_part.distance + distance <= self.max_distance:
            route_part.add_stop(0, vertex)
            self.__increment_distance(route_part, distance)
            return True
        return False

    def __add_on_last_in_route_part(self, route_part: RoutePart, vertex) -> bool:
        distance = self.count_distance(route_part.route[-1], vertex)
        if route_part.distance + distance <= self.max_distance:
            route_part.add_stop(route_part.length, vertex)
            self.__increment_distance(route_part, distance)
            return True
        return False

    def __add_stop(self, route_part: RoutePart, index, vertex) -> bool:
        existing_distance = self.count_distance(route_part.route[index - 1], route_part.route[index])
        distance_to_new = self.distances[route_part.route[index - 1].id][vertex.id][1]
        distance_from_new = self.distances[route_part.route[index].id][vertex.id][1]

        distance = distance_to_new + distance_from_new - existing_distance

        if route_part.distance + distance <= self.max_distance:
            route_part.add_stop(index, vertex)
            self.__increment_distance(route_part, distance)
            return True
        return False

    def add_stop(self, route_part, index, vertex) -> bool:
        add_method = self.__add_stop

        if index < 0 or index > route_part.length:
            raise ValueError("insertion index is bigger than route length or is negative")

        if isinstance(vertex, Company) and vertex.id not in self.available_vertices:
            return False

        added = False

        if index == 0:
            add_method = self.__add_on_first_in_route_part
        elif index == route_part.length:
            add_method = self.__add_on_last_in_route_part
        else:
            added = add_method(route_part, index, vertex)
            if added:
                self.available_vertices.discard(vertex.id)
            return added

        added = add_method(route_part, vertex)

        if added:
            self.available_vertices.discard(vertex.id)

        return added

    def __remove_on_first_in_route_part(self, route_part: RoutePart) -> None:
        distance = self.count_distance(route_part.route[0], route_part.route[1]) if route_part.length >= 2 else 0
        route_part.remove_stop(0)
        self.__decrement_distance(route_part, distance)

    def __remove_on_last_in_route_part(self, route_part: RoutePart) -> None:
        distance = self.count_distance(route_part.route[-2], route_part.route[-1])
        route_part.remove_stop(-1)
        self.__decrement_distance(route_part, distance)

    def __remove_stop(self, route_part: RoutePart, index: int) -> None:
        existing_distance_from = self.count_distance(route_part.route[index - 1], route_part.route[index])
        existing_distance_to = self.count_distance(route_part.route[index], route_part.route[index + 1])
        existing_distance = existing_distance_from + existing_distance_to
        new_distance = self.count_distance(route_part.route[index - 1], route_part.route[index + 1])

        route_part.remove_stop(index)
        self.__decrement_distance(route_part, existing_distance)
        self.__increment_distance(route_part, new_distance)

    def remove_stop(self, route_part: RoutePart, index: int) -> None:
        remove_method = self.__remove_stop

        if index < 0 or index > route_part.length - 1:
            raise ValueError("Deletion index is bigger than route length or is negative")

        if index == 0:
            remove_method = self.__remove_on_first_in_route_part
        elif index == route_part.length - 1:
            remove_method = self.__remove_on_last_in_route_part
        else:
            if isinstance(route_part.route[index], Company):
                self.available_vertices.add(route_part.route[index].id)
            remove_method(route_part, index)
            return

        if isinstance(route_part.route[index], Company):
            self.available_vertices.add(route_part.route[index].id)
        remove_method(route_part)

    def __replace_first_stop(self, route_part: RoutePart, vertex: Vertex) -> bool:
        existing_distance = self.count_distance(route_part.route[0], route_part.route[1])
        new_distance = self.count_distance(vertex, route_part.route[1])
        distance = new_distance - existing_distance

        if route_part.distance + distance > self.max_distance:
            return False

        route_part.replace_stop(0, vertex)
        self.__increment_distance(route_part, distance)
        return True

    def __replace_last_stop(self, route_part: RoutePart, vertex: Vertex) -> bool:
        existing_distance = self.count_distance(route_part.route[-2], route_part.route[-1])
        new_distance = self.count_distance(route_part.route[-2], vertex)
        distance = new_distance - existing_distance

        if route_part.distance + distance > self.max_distance:
            return False

        route_part.replace_stop(route_part.length - 1, vertex)
        self.__increment_distance(route_part, distance)
        return True

    def __replace_stop(self, route_part: RoutePart, index: int, vertex: Vertex) -> bool:
        existing_distance_to_vertex = self.count_distance(route_part.route[index - 1], route_part.route[index])
        existing_distance_from_vertex = self.count_distance(route_part.route[index], route_part.route[index + 1])
        existing_distance = existing_distance_from_vertex + existing_distance_to_vertex

        new_distance_to_vertex = self.count_distance(route_part.route[index - 1], vertex)
        new_distance_from_vertex = self.count_distance(vertex, route_part.route[index + 1])
        new_distance = new_distance_from_vertex + new_distance_to_vertex

        distance = new_distance - existing_distance

        if route_part.distance + distance > self.max_distance:
            return False
        route_part.replace_stop(index, vertex)
        self.__increment_distance(route_part, distance)
        return True

    def replace_stop(self, route_part: RoutePart, index: int, vertex: Vertex) -> bool:

        if index < 0 or index > route_part.length - 1:
            raise ValueError("Replace index is bigger than route length or is negative")

        replace_method = self.__replace_stop

        if index == 0:
            replace_method = self.__replace_first_stop
        elif index == route_part.length - 1:
            replace_method = self.__replace_last_stop
        else:
            replaced = replace_method(route_part, index, vertex)
            if replaced:
                if isinstance(vertex, Company):
                    self.available_vertices.discard(vertex)
            return replaced

        replaced = replace_method(route_part, vertex)
        if replaced:
            if isinstance(vertex, Company):
                self.available_vertices.discard(vertex)
        return replaced

    def crossover(self, origin: RoutePart, another: RoutePart, cross_index: int):
        if cross_index < 0 or cross_index > origin.length - 2 or cross_index > another.length - 2:
            return [None, None]

        new_distance = 0

        # origin part distance
        if cross_index < origin.length / 2:
            part_distance = self.__count_part_route_part(origin, 0, cross_index)
            new_distance += part_distance
        else:
            part_distance = self.__count_part_route_part(origin, cross_index, origin.length - 1)
            new_distance += origin.distance - part_distance

        for vertex in origin.route[cross_index + 1:]:
            if isinstance(vertex, Company):
                self.available_vertices.add(vertex.id)

        # another part distance
        possible_to_add = [company for company in another.route[cross_index + 1:-1] if company.id in self.available_vertices]
        tmp_route_part = RoutePart(possible_to_add + [another.route[-1]])
        self.recount_route_part(tmp_route_part)

        new_distance += tmp_route_part.distance
        new_distance += self.count_distance(origin.route[cross_index], tmp_route_part.route[0])

        if new_distance > self.max_distance:
            for vertex in origin.route[cross_index + 1:]:
                if isinstance(vertex, Company):
                    self.available_vertices.discard(vertex.id)
            return [None, None]

        for vertex in another.route[cross_index + 1:]:
            self.available_vertices.discard(vertex.id)

        new_route = origin.route[:cross_index + 1] + tmp_route_part.route

        return new_route, new_distance

    def __str__(self):
        route = list()

        for r in self.routes[:-1]:
            route += r.route

        route.append(self.routes[-1].route[-1])

        return "->".join(map(str, route))



