import copy
import json
import random
from datetime import datetime
from typing import List, Tuple

import channels.layers
import mpu
from asgiref.sync import async_to_sync


class WrongSubRoute(Exception):
    pass


class Vertex:
    def __init__(self, name, coords):
        self.name = name
        self.lat = coords['lat']
        self.lng = coords['lng']
        self.profit = 0

    def get_coords(self) -> Tuple[float]:
        return (self.lat, self.lng)

    def __repr__(self):
        return self.name

    def __str__(self):
        return self.name


class Depot(Vertex):
    def __init__(self, name, coords):
        super().__init__(name, coords)
        self.stop_type = 'depot'


class Company(Vertex):
    def __init__(self, name, coords, profit):
        super().__init__(name, coords)
        self.stop_type = 'company'
        self.profit = profit

    def __repr__(self):
        return self.name + ' profit - ' + str(self.profit)


class Hotel(Vertex):
    def __init__(self, name, coords):
        super().__init__(name, coords)
        self.stop_type = 'hotel'

class SubRoute:
    def __init__(self, route, max_profit):
        self.route = route
        self.max_profit = max_profit
        self.distance = 0
        self.profit = 0
        self.fitness = 0

        self.recount_route()
    
    def count_distance(self, company_from: Vertex, company_to: Vertex) -> float:
        return mpu.haversine_distance((company_from.lat, company_from.lng), (company_to.lat, company_to.lng))

    def recount_distance(self):
        self.distance = 0
        for index, v in enumerate(self.route):
            if index == 0:
                continue
            self.distance += self.count_distance(self.route[index - 1], v)

    def recount_profit(self):
        self.profit = 0
        for index, v in enumerate(list(set(self.route))):
            self.profit += v.profit

    def recount_route(self):
        self.recount_distance()
        self.recount_profit()

    def add_stop(self, index, company):
        #TODO: Validate if can be added
        self.route.insert(index, company)
        self.recount_route()

    def remove_stop(self, company):
        #TODO: Validate if exists
        self.route.remove(company)
        self.recount_route()

    def swap_stops(self, a, b):
        #TODO: Verify if can be swapped
        tmp = copy.copy(self.route[a])
        self.route[a] = self.route[b]
        self.route[b] = tmp
        self.recount_route()

    def __repr__(self):
        string = ''
        for r in self.route[:-1]:
            string += r.name + '->'

        return string + self.route[-1].name

class Route:
    def __init__(self, routes, max_profit):
        self.routes = routes
        self.max_profit = max_profit
        self.distance = 0
        self.sub_distance = []
        self.profit = 0
        self.fitness = 0

        self.recount_route()

    def recount_distance(self):
        self.distance = 0
        for route in self.routes:
            route.recount_distance()
            self.distance += route.distance

    def recount_profit(self):
        self.profit = 0
        for route in self.routes:
            route.recount_profit()
            self.profit += route.profit

    def recount_route(self):
        self.recount_distance()
        self.recount_profit()

    def get_route(self):
        route = []
        route.append(self.routes[0].route[0])
        for index, subroute in enumerate(self.routes):
            route += subroute.route[1:]
        return route

    def get_route_vertex_names(self) -> List[str]:
        names = []
        names.append(self.routes[0].route[0].name)
        for subroute in self.routes:
            for vertex in subroute.route[1:]:
                names.append(vertex.name)
        return names

    def __repr__(self):
        string = ''
        for r in self.routes:
            string += r.__repr__()

        return string

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
        if self.progress % int(self.total/200) == 0:
            self.update()

    def update(self) -> None:
        """
        Sending websocket message with current progress
        """
        now = datetime.now()
        diff = now - self.last_time
        left_progress = (1 - round(self.progress / self.total, 2))*100
        time_left = left_progress*diff.seconds
        self.last_time = datetime.now()
        async_to_sync(self.channel_layer.group_send)(self.group_name, {'type': 'progress_message', 'message': round((self.progress / self.total), 2), 'timeLeft': time_left})        

class RouteOptimizer:
    def __init__(self, business_trip_id: int, depots: List[Depot], companies: List[Company], hotels: List[Hotel], tmax: int, days: int):
        """        
        Arguments:
            business_trip_id {int} -- id of business trip
            depots {List[Depot]} -- List of depots
            companies {List[Company]} -- List of companies added in requistions
            hotels {List[Hotel]} -- List of hotels
            tmax {int} -- max kilometers per day
            days {int} -- number of days of business trip
        """
        self.depots = depots
        self.companies = companies
        self.hotels = hotels
        self.tmax = tmax
        self.population = []
        self.days = days
        self.max_profit = self.count_max_profit()
        self.business_trip_id = business_trip_id
        self.observer = RouteObserver(business_trip_id)

        self.observer.set_progress(0, 1.01*((100*self.days) + (2000*(100 + (50*days) + (100*days) + (100*days) + 50))))

        self.count_distances()
        self.generate_random_routes(100)

    def count_max_profit(self) -> int:
        """
        Counts max profit which could be reached if all companies were 
        added to route
        
        Returns:
            int -- sum of profits of all potential companies in route optimizer
        """
        max_profit = 0
        for company in self.companies:
            max_profit += company.profit
        return max_profit

    def count_distances(self) -> None:
        """
        Counts distances and profits by distances. Each one is a two-dimensional 
        array containing related values.
        For example distances[0][1] is a distance from 0 vertex to 1.
        """
        self.distances = []
        self.profits = []
        self.profits_by_distances = []
        self.all_vertices = self.depots + self.companies + self.hotels

        for i, vertex in enumerate(self.all_vertices):
            self.profits.append(vertex.profit)
            vertex_distances = []
            vertex_profits_by_distances = []
            for j, another_vertex in enumerate(self.all_vertices):
                if i == j:
                    vertex_distances.append(100000)
                    vertex_profits_by_distances.append(0)
                    continue
                distance = mpu.haversine_distance(
                    (vertex.lat, vertex.lng), (another_vertex.lat, another_vertex.lng))
                profit_by_distance = another_vertex.profit / distance if distance != 0 else 0
                vertex_distances.append(distance)
                vertex_profits_by_distances.append(profit_by_distance)
            self.distances.append(vertex_distances)
            self.profits_by_distances.append(vertex_profits_by_distances)

    def get_vertex_index(self, vertex: Vertex) -> int:
        """
        Help function to get index of specific vertex in all vertices
        available in route optimizer.
        
        Arguments:
            vertex {Vertex} -- Vertex instance to find a index of it
        
        Returns:
            int -- index of found vertex
        """
        if isinstance(vertex, Company):
            vertex_index = self.companies.index(vertex) + len(self.depots)
        elif isinstance(vertex, Hotel):
            vertex_index = self.hotels.index(
                vertex) + len(self.depots + self.companies)
        else:
            vertex_index = self.depots.index(vertex)
        return vertex_index

    def get_random_profitable_next_company_for_vertex(self, vertex: Vertex, remain_vertices: List[Vertex], top: int=5, most: bool=True) -> Company:
        """
        Searching a random profitable company which is next to vertex. 
        Using tournament selection for most profitable company.

        Arguments:
            vertex {Vertex} -- vertex from which the next to it random profitable company will be finding
            remain_vertices {List[Vertex]} -- list of remains vertices to get
        
        Keyword Arguments:
            top {int} -- number of the best elements to get the best from tournament selection (default: {5})
            most {bool} -- if True then sorting is descending (default: {True})
        
        Returns:
            Company -- found company
        """
        most_profitable = []
        vertex_index = self.get_vertex_index(vertex)

        for value in remain_vertices:
            company_index = self.companies.index(value)

            most_profitable.append(
                (self.companies[company_index], self.profits_by_distances[vertex_index][len(self.depots) + company_index]))

        most_profitable.sort(key=lambda x: x[1], reverse=most)
        random_index = random.randint(0, top if len(
            most_profitable) - 1 >= top else len(most_profitable) - 1)
        return most_profitable[random_index]

    def get_nearest_hotel_for_vertex(self, vertex: Vertex) -> Hotel:
        """
        Getting the nearest hotel for specific vertex
        
        Arguments:
            vertex {Vertex} -- vertex from which hotel will be searching on
        
        Returns:
            Hotel -- found the nearest hotel
        """
        nearby = []
        vertex_index = self.get_vertex_index(vertex)

        for index, value in enumerate(self.hotels):
            nearby.append((value, self.distances[vertex_index][len(self.depots) + len(self.companies) + index]))

        nearby.sort(key=lambda x: x[1])
        return nearby[0][0]

    def get_random_nearest_next_company_for_vertex(self, vertex: Vertex, remain_vertices: List[Company], top: int=5) -> Company:
        """Getting a random company which is the nearest to given vertex
        
        Arguments:
            vertex {Vertex} -- vertex from which company will be searching on
            remain_vertices {List[Company]} -- list of available companies to look up
        
        Keyword Arguments:
            top {int} -- number of the best elements to get the one from tournament selection (default: {5})
        
        Returns:
            Company -- found the nearest company
        """
        
        nearest = []
        vertex_index = self.get_vertex_index(vertex)

        for index, value in enumerate(remain_vertices):
            company_index = self.companies.index(value)

            nearest.append((self.companies[company_index], self.distances[vertex_index][len(self.depots) + company_index]))
        nearest.sort(key=lambda x: x[1])
        random_index = random.randint(0, top if len(nearest) - 1 >= top else len(nearest) - 1)
        return nearest[random_index]

    def add_hotel_to_route(self, subroute: SubRoute, day: int) -> SubRoute:
        """
        Adds hotel on the first and/or the last element of subroute depends on current day.

        Arguments:
            subroute {SubRoute} -- subroute to modify
            day {int} -- current processing day
        
        Raises:
            WrongSubRoute: Lenght of subroute has to be greater or equal than 3
        
        Returns:
            SubRoute -- modified subroute
        """
        if len(subroute.route) < 2:
            raise WrongSubRoute()

        index_of_first = 1
        index_of_last = -2

        if len(subroute.route) < 3:
            index_of_first = 0
            index_of_last = 0

        if day == 0:
            subroute.route[-1] = self.get_nearest_hotel_for_vertex(subroute.route[index_of_last])
        if day == self.days - 1:
            subroute.route[0] = self.get_nearest_hotel_for_vertex(subroute.route[index_of_first])
        if day > 0 and day < self.days - 1:
            subroute.route[0] = self.get_nearest_hotel_for_vertex(subroute.route[index_of_first])
            subroute.route[-1] = self.get_nearest_hotel_for_vertex(subroute.route[index_of_last])

        return subroute

    def add_new_random_company_to_subroute(self, subroute: SubRoute, possible_companies: List[Company], next_company, day: int) -> SubRoute:
        """
        Adds new random company to subroute and makes sure new subroute 
        does not exceed given distance constraint
        
        Arguments:
            subroute {SubRoute} -- subroute to modify
            possible_companies {List[Company]} -- List of companies available to add (the route does not contain them)
            next_company {Callable[Vertex, List[Company]]} -- method returning a company
            day {int} -- current processing day
        
        Returns:
            SubRoute -- modified subroute
        """
        while subroute.distance <= self.tmax and possible_companies:

            random_insert_index = random.randint(1, len(subroute.route) - 1)

            vertex_before = next_company(
                subroute.route[random_insert_index - 1], possible_companies)
            vertex_after = next_company(
                subroute.route[random_insert_index], possible_companies)

            if vertex_after[1] > vertex_before[1]:
                vertex = vertex_after[0]
            else:
                vertex = vertex_before[0]

            subroute.add_stop(random_insert_index, vertex)
            possible_companies.remove(vertex)

            # if does not exceed constraint then repeat previous step
            if subroute.distance > self.tmax:
                subroute.remove_stop(vertex)
                possible_companies.append(vertex)
                break
        return subroute

    def __remove_the_worst_neighbour(self, subroute: SubRoute) -> SubRoute:
        """
        Removes the worst neighbour, which has the worst profit/distance ration in current route
        
        Arguments:
            subroute {SubRoute} -- given route to remove the worst neighbour
        
        Returns:
            SubRoute -- modified subroute
        """
        the_worst_neighbour = [None, 100000]
        
        for index, r in enumerate(subroute.route[1:-1]):
            previous_vertex_index = self.get_vertex_index(subroute.route[index - 1])
            current_vertex_index = self.get_vertex_index(r)
            profit_by_distance = self.profits_by_distances[previous_vertex_index][current_vertex_index]

            if profit_by_distance < the_worst_neighbour[1]:
                the_worst_neighbour = [r, profit_by_distance]

        if the_worst_neighbour[0] and len(subroute.route) > 3:
            subroute.remove_stop(the_worst_neighbour[0])

        return subroute


    def generate_random_routes(self, n: int) -> None:
        """
        Generates n random routes and put it to the first population. Method is called once the Route optimizer instance has created.

        Work of generating new routes splits to steps:
        1. Route is generated containing depot -> depot.
        2. Adding a hotel for subroute if number is greater than 1.
        3. Try on adding the best profit/distance companies to route (do it until distance constraint is exceeded or lack of companies remains)
        4. Try on adding the nearest companies to route (do it until distance constraint is exceeded or lack of companies remains)
        5. Remove the worst neighbour (the worst profit/distance) to make some room for potential better routes

        
        Arguments:
            n {int} -- number of random routes to be generated
        """
        self.population.append([])

        for _ in range(n):
            routes = []
            for i in range(self.days):
                route = SubRoute([self.depots[0], self.depots[0]], self.max_profit)
                routes.append(route)

            route = Route(routes, self.max_profit)
            tmp_vertices = self.companies.copy()

            for day in range(self.days):
                subroute = route.routes[day]
                # import pdb;pdb.set_trace()
                subroute = self.add_new_random_company_to_subroute(subroute, tmp_vertices, self.get_random_profitable_next_company_for_vertex, day)

                if self.days > 1:
                    try:
                        subroute = self.add_hotel_to_route(subroute, day)
                    except WrongSubRoute as e:
                        pass
                
                subroute = self.add_new_random_company_to_subroute(subroute, tmp_vertices, self.get_random_nearest_next_company_for_vertex, day)
                subroute = self.__remove_the_worst_neighbour(subroute)

                # TODO: Check if below is necessarry
                route.routes[day] = subroute
                self.observer.increment()
            route.recount_route()
            self.population[0].append(route)
        self.population[0].sort(key=lambda x: x.profit, reverse=True)


    def tournament_choose(self, population: List[Route], t_size: int) -> Route:
        """
        Help method to get the best element of random t_size elements
        
        Arguments:
            population {List[Route]} -- List of routes (population)
            t_size {int} -- number of random elements to get to look up the best
        
        Returns:
            Route -- chosen route
        """
        random_indexes = random.sample(range(0, len(population)), t_size)
        routes = [population[index] for index in random_indexes]
        routes.sort(key=lambda x: x.profit, reverse=True)

        return routes[0]

    def __do_elitism_operation(self, population: List[Route], t_size: int = 5) -> None:
        """Moving the best routes from previous route to the new one
        
        Arguments:
            population {List[Route]} -- List of routes from previous population
        
        Keyword Arguments:
            t_size {int} -- number of random elements to get to look up the best (default: {5})
        """
        next_population = []
        for j in range(100):
            route = self.tournament_choose(population, t_size)
            next_population.append(route)
            self.observer.increment()

        self.population.append(next_population)

    def run(self, iterations: int) -> None:
        """
        Main part of algorithm.
        Runs number of iterations times and process these steps:
        1. Build a new population using tournament selection to variety (Elitism)
        2. Do crossover operation on each pair of routes
        3. Do mutation operation on each route
        
        Arguments:
            iterations {int} -- number of iteration
        """
        for i in range(1, iterations + 1):
            self.__do_elitism_operation(self.population[i - 1])

            b = Breeding(self.companies,
                         self.population[i], self.tmax, self.max_profit, self.days, self.observer)
            b.breed()
            self.population[i].sort(key=lambda x: x.profit, reverse=True)
            
            if self.population[i][0].profit == self.max_profit:
                break

class Breeding:
    def __init__(self, vertices: List[Company], population: List[Route], tmax: int, max_profit: int, days: int, observer: RouteObserver):
        """
        Arguments:
            vertices {List[Company]} -- list of companies available to add to route
            population {List[Route]} -- list of routes (population)
            tmax {int} -- distance constraint
            max_profit {int} -- max profit which could be reached if all companies were in route
            days {int} -- number of days of business trip
            observer {RouteObserver} -- observer using to communication with websockets
        """
        self.population = population
        self.tmax = tmax
        self.max_profit = max_profit
        self.vertices = vertices
        self.days = days
        self.observer = observer

    def __couple_routes(self) -> List[List[Route]]:
        """
        Help method which divides routes of current population in pairs used in crossover operation
        
        Returns:
            List[List[Route]] -- list of pairs to be processed
        """
        # contains a list of routes in current population
        tmp_routes = self.population.copy()

        # tupple of coupled routes to crossover
        parents = []

        # for each route couple them into tupple and add to parents variable
        for i in range(0, len(tmp_routes), 2):
            random_indexes = random.sample(range(0, len(tmp_routes)), 2)

            parents.append([tmp_routes[random_indexes[0]],
                            tmp_routes[random_indexes[1]]])

            random_indexes[1] = random_indexes[1] - \
                1 if random_indexes[1] > random_indexes[0] else random_indexes[1]
            tmp_routes.remove(tmp_routes[random_indexes[0]])
            tmp_routes.remove(tmp_routes[random_indexes[1]])
        return parents

    def __get_crossovered_children(self, day: int, parents: List[Route], children: List[SubRoute]) -> List[SubRoute]:
        """
        Help method to get routes after crossover operation
        It depends on conditions like below:
        - If both of children does not exceed distance constraint then both replace parents in the population
        - If one of children exceed distance contraint then worse parent (less profitable or greater distance if the same profit) is replaced by the child
        - If both of children exceed distance contraint then parents return to the population
        
        Arguments:
            day {int} -- current day being processed
            parents {List[Route]} -- couple of parents to be replaced
            children {List[SubRoute]} -- couple of children made by crossover operation
        
        Returns:
            List[SubRoute] -- couple of modified subroutes to the population
        """
        crossovered_children = []
        if children[0].distance <= self.tmax:
            crossovered_children.append(children[0])

        if children[1].distance <= self.tmax:
            crossovered_children.append(children[1])

        if children[0].distance > self.tmax and children[1].distance > self.tmax:
            return [parents[0].routes[day], parents[1].routes[day]]

        if children[0].distance > self.tmax:
            if parents[0].routes[day].profit == parents[1].routes[day].profit:
                crossovered_children.append(parents[0].routes[day] if parents[0].routes[day].distance < parents[1].routes[day].distance else parents[1].routes[day])
            else:
                crossovered_children.append(parents[0].routes[day] if parents[0].routes[day].profit > parents[1].routes[day].profit else parents[1].routes[day])

        if children[1].distance > self.tmax:
            if parents[0].routes[day].profit == parents[1].routes[day].profit:
                crossovered_children.append(parents[0].routes[day] if parents[0].routes[day].distance < parents[1].routes[day].distance else parents[1].routes[day])
            else:
                crossovered_children.append(parents[0].routes[day] if parents[0].routes[day].profit > parents[1].routes[day].profit else parents[1].routes[day])
        return crossovered_children

    def __delete_random_company_from_route(self, subroute: SubRoute) -> None:
        """
        Help method removes random company to make some variety and potential space for better route
        
        Arguments:
            subroute {SubRoute} -- current subroute to remove a company from
        """
        if len(subroute.route) > 2:
            random_company_index = random.randint(1, len(subroute.route) - 2)
            del(subroute.route[random_company_index])
    
    def __remove_duplicates(self, origin: Route) -> List[Route]:
        """
        Help method remove duplicates in whole route.
        
        Arguments:
            origin {List[Route]} -- original route to be improved
        
        Returns:
            List[Route] -- route without duplicates
        """
        # TODO: Route should be unique, not the only subroute
        vertice_appearances = {v.name: [] for v in self.vertices}
        result = []
        # print(vertice_appearances)
        for route_index, subroute in enumerate(origin.routes):
            if len(subroute.route) < 3:
                continue

            for subroute_index, vertex in enumerate(subroute.route[1:-1]):
                vertex_before_coords = subroute.route[subroute_index - 1].get_coords()
                vertex_current_coords = vertex.get_coords()
                vertex_after_coords = subroute.route[subroute_index + 1].get_coords()

                distance_before = mpu.haversine_distance(vertex_before_coords, vertex_current_coords)
                distance_after = mpu.haversine_distance(vertex_current_coords, vertex_after_coords)
                try:
                    vertice_appearances[vertex.name].append((max(distance_before, distance_after), route_index, subroute_index + 1))
                except:
                    pass
                    # print(self.vertices, vertice_appearances, vertex.name)

        to_be_removed = []

        for vertex in vertice_appearances.values():
            if len(vertex) > 1:
                vertex.sort(key=lambda x: x[0])
                for appear in vertex[1:]:
                    to_be_removed.append((appear[1], appear[2]))

        for route_index, subroute in enumerate(origin.routes):
            result = []

            for subroute_index, vertex in enumerate(subroute.route):
                if (route_index, subroute_index) in to_be_removed:
                    continue
                result.append(vertex)
            subroute.route = result

        origin.recount_route()
        return origin

    def crossover(self):
        parents = self.__couple_routes()
        # for each route couple try to do crossover operation
        for i, parent in enumerate(parents):
            for day in range(self.days):
            # for subroute in parent.routes:
                parent_a_subroute = parent[0].routes[day]
                parent_b_subroute = parent[1].routes[day]
                children = []
                common_genes = list(set(parent_a_subroute.route[1:-1]).intersection(parent_b_subroute.route[1:-1]))
                if len(common_genes) > 0:
                    rand_gene = random.randint(0, len(common_genes) - 1)
                    cross_indexes = [p.routes[day].route.index(common_genes[rand_gene]) for p in parent]

                    child_a = SubRoute(parent[0].routes[day].route[:cross_indexes[0]] + parent[1].routes[day].route[cross_indexes[1]:], self.max_profit)
                    child_b = SubRoute(parent[1].routes[day].route[:cross_indexes[1]] + parent[0].routes[day].route[cross_indexes[0]:], self.max_profit)

                    children = self.__get_crossovered_children(day, parent, (child_a, child_b))
                    parent[0].routes[day] = children[0]
                    parent[1].routes[day] = children[1]
                self.observer.increment()
            parent[0].recount_route()
            parent[1].recount_route()
        return parents

    def __get_the_best_hotel_for_subroutes(self, child: Route) -> Route:
        #TODO: Depot if the same city as depot
        for index, subroute in enumerate(child.routes[:-1]):
            distance = {
                'first_subroute': {}, 
                'second_subroute': {}
            }


            if len(subroute.route) < 3 or len(child.routes[index + 1].route) < 3:
                # import pdb;pdb.set_trace()
                subroute.route[-1] = child.routes[index + 1].route[0]
                return child

            distance['first_subroute']['company_to_first_subroute_hotel'] = subroute.count_distance(subroute.route[-2], subroute.route[-1])
            distance['first_subroute']['company_to_second_subroute_hotel'] = subroute.count_distance(subroute.route[-2], child.routes[index + 1].route[0])
            distance['second_subroute']['company_to_second_subroute_hotel'] = subroute.count_distance(child.routes[index + 1].route[1], child.routes[index + 1].route[0])
            distance['second_subroute']['company_to_first_subroute_hotel'] = subroute.count_distance(child.routes[index + 1].route[1], subroute.route[-1])

            distance_when_first_hotel = distance['first_subroute']['company_to_first_subroute_hotel'] + distance['second_subroute']['company_to_first_subroute_hotel']
            distance_when_second_hotel = distance['first_subroute']['company_to_second_subroute_hotel'] + distance['second_subroute']['company_to_second_subroute_hotel']

            if distance_when_first_hotel < distance_when_second_hotel:
                child.routes[index + 1].route[0] = subroute.route[-1]
            else:
                subroute.route[-1] = child.routes[index + 1].route[0]
        return child

    def mutate(self, parents):
        for i, parent_couple in enumerate(parents):
            for j, parent in enumerate(parent_couple):
                child = parent
                vertices_to_select = [v for v in self.vertices if v.name not in child.get_route_vertex_names()]

                if self.vertices:
                    child = self.__remove_duplicates(child)

                for route in child.routes:
                    # DELETE second phase - remove random city
                    if vertices_to_select:
                        self.__delete_random_company_from_route(route)
                    route.recount_route()
                    self.observer.increment()
                        
                #TODO: Check if deleted company is returned to available companies
                vertices_to_select = [v for v in self.vertices if v.name not in child.get_route_vertex_names()]
                
                for route in child.routes:
                    '''
                    ADD phase - add random cities
                    '''
                    
                    while route.distance < self.tmax and vertices_to_select:
                        if len(route.route) == 2:
                            random_insert_index = 1
                        else:
                            random_insert_index = random.randint(1, len(route.route) - 1)
                        
                        random_vertex = vertices_to_select[random.randint(0, len(vertices_to_select) - 1)]

                        route.add_stop(random_insert_index, random_vertex)
                        vertices_to_select.remove(random_vertex)

                        if route.distance > self.tmax:
                            route.remove_stop(random_vertex)
                            vertices_to_select.append(random_vertex)
                            break
                    self.observer.increment() #100* days + iterations(100 + 100*days + 100*days + 100*days)
                    
                child = self.__get_the_best_hotel_for_subroutes(child)
                parents[i][j] = child
        population = []
        for parent in parents:
            population.append(parent[0])
            population.append(parent[1])
            self.observer.increment()
        return population

    def breed(self):
        crossed = self.crossover()
        self.population = self.mutate(crossed)

        self.population.sort(key=lambda x: x.profit, reverse=True)
        self.population = self.population[:100]
