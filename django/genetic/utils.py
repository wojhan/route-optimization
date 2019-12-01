import random
import copy
import math
import json
import pdb
import mpu


class RouteOptimizer:
    def __init__(self, depots, companies, hotels, tmax, days):
        self.depots = depots
        self.companies = companies
        self.hotels = hotels
        self.tmax = tmax
        self.population = []
        self.days = days
        self.max_profit = self.count_max_profit(companies)

        self.count_distances()
        self.generate_random_routes(20)

    def count_max_profit(self, companies):
        max_profit = 0
        for company in companies:
            max_profit = max(max_profit, company.profit)
        return max_profit

    def count_distances(self):
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
                profit_by_distance = another_vertex.profit / distance
                vertex_distances.append(distance)
                vertex_profits_by_distances.append(profit_by_distance)
            self.distances.append(vertex_distances)
            self.profits_by_distances.append(vertex_profits_by_distances)

    def get_vertex_index(self, vertex):
        if isinstance(vertex, Company):
            vertex_index = self.companies.index(vertex) + len(self.depots)
        elif isinstance(vertex, Hotel):
            vertex_index = self.hotels.index(
                vertex) + len(self.depots) + len(self.companies)
        else:
            vertex_index = self.depots.index(vertex)
        return vertex_index

    def get_random_profitable_next_company_for_vertex(self, vertex, remain_vertex, top=5, most=True):
        most_profitable = []
        vertex_index = self.get_vertex_index(vertex)

        for index, value in enumerate(remain_vertex):
            company_index = self.companies.index(value)

            most_profitable.append(
                (self.companies[company_index], self.profits_by_distances[vertex_index][len(self.depots) + company_index]))

        most_profitable.sort(key=lambda x: x[1], reverse=most)
        random_index = random.randint(0, top if len(
            most_profitable) - 1 >= top else len(most_profitable) - 1)
        return most_profitable[random_index]

    def get_random_nearest_next_company_for_vertex(self, vertex, remain_vertex, top=5):
        nearest = []
        vertex_index = self.get_vertex_index(vertex)

        for index, value in enumerate(remain_vertex):
            company_index = self.companies.index(value)

            nearest.append((self.companies[company_index], self.distances[vertex_index][len(self.depots) + company_index]))
        nearest.sort(key=lambda x: x[1])
        random_index = random.randint(0, top if len(nearest) - 1 >= top else len(nearest) - 1)
        return nearest[random_index]

    def generate_random_routes(self, n):
        self.population.append([])

        for _ in range(n):
            random_hotels = [self.hotels[hotel_index] for hotel_index in random.sample(
                range(0, self.days), self.days - 1)]
            routes = []
            # TODO: Add condition for one day trips without hotels
            for i, hotel in enumerate(random_hotels):
                # start from depot
                if i == 0:
                    route = SubRoute([self.depots[0], hotel], self.max_profit)
                    routes.append(route)

                if len(random_hotels) > 1:
                    route = SubRoute([hotel, random_hotels[i+1]], self.max_profit)
                    routes.append(route)

                if i == len(random_hotels) - 1:
                    route = SubRoute([hotel, self.depots[0]], self.max_profit)
                    routes.append(route)

            route = Route(routes, self.max_profit)
            tmp_vertices = self.companies.copy()

            '''
            For every subtour generate random tours
            Each tour cannot be greater than tmax
            '''
            for day in range(self.days):
                subroute = route.routes[day]
                while subroute.distance <= self.tmax and tmp_vertices:
                    '''
                    First phase
                    Get random the best profit/distance vertices, try to add them to route. Repeat until there are vertices remains
                    '''
                    random_insert_index = random.randint(1, len(subroute.route) - 1)

                    vertex_before=self.get_random_profitable_next_company_for_vertex(
                        subroute.route[random_insert_index - 1], tmp_vertices)
                    vertex_after=self.get_random_profitable_next_company_for_vertex(
                        subroute.route[random_insert_index], tmp_vertices)

                    if vertex_after[1] > vertex_before[1]:
                        vertex=vertex_after[0]
                    else:
                        vertex=vertex_before[0]

                    subroute.add_stop(random_insert_index, vertex)
                    tmp_vertices.remove(vertex)

                    # if does not exceed constraint then repeat previous step
                    if subroute.distance > self.tmax:
                        subroute.remove_stop(vertex)
                        tmp_vertices.append(vertex)
                        break
                while subroute.distance <= self.tmax and tmp_vertices:
                    '''
                    Second phase
                    Get random near vertices, try to add them to route. Repeat until there are vertices remains
                    '''
                    random_insert_index = random.randint(1, len(subroute.route) - 1)

                    vertex_before = self.get_random_nearest_next_company_for_vertex(subroute.route[random_insert_index - 1], tmp_vertices)
                    vertex_after = self.get_random_nearest_next_company_for_vertex(subroute.route[random_insert_index], tmp_vertices)

                    if vertex_after[1] > vertex_before[1]:
                        vertex=vertex_after[0]
                    else:
                        vertex=vertex_before[0]

                    subroute.add_stop(random_insert_index, vertex)
        #             sub_tour_vertices_tried[sub_tour_index].append(vertex)
                    tmp_vertices.remove(vertex)

                    # if does not exceed constraint then repeat previous step
                    if subroute.distance > self.tmax:
                        subroute.remove_stop(vertex)
                        tmp_vertices.append(vertex)
                        break

                '''
                TODO:Consider using that
                Try remove some of vertices with the lowest ratio to get some savings
                '''
                # the_worst_neighbour = [None, 100000]
                # for index, r in enumerate(subtour.ro):
                #     previous_vertex_index = self.get_vertex_index(sub_route[index - 1])
                #     current_vertex_index = self.get_vertex_index(r)
                #     profit_by_distance = self.profits_by_distances[previous_vertex_index][current_vertex_index]

                #     if profit_by_distance < the_worst_neighbour[1]:
                #         the_worst_neighbour = [r, profit_by_distance]
                
                '''
                Third phase
                Get 2-opt operations
                '''
                best_route = subroute
                if len(subroute.route) > 3:
                    opt_range = min(len(subroute.route), 20)
                    proceeding_route = copy.deepcopy(subroute)
                    for i in range(opt_range):
                        for j in range(1, len(subroute.route) - 1):
                            for k in range(i + 1, len(subroute.route) - 1):
                                current_route = copy.deepcopy(proceeding_route)
                                to_reverse = current_route.route[j:k]
                                to_reverse.reverse()
                                new_route = SubRoute(current_route.route[:j] + to_reverse + current_route.route[k:], self.max_profit)
                                if new_route.distance < proceeding_route.distance:
                                    proceeding_route = new_route
                                    best_route = new_route

                    routes[day] = best_route
            route.recount_route()
            self.population[0].append(route)
        self.population[0].sort(key = lambda x: x.profit, reverse=True)

    def tournament_choose(self, population, t_size):
        random_indexes= random.sample(range(0, len(population)), t_size)
        routes= []
        for index in random_indexes:
            routes.append(population[index])
        routes.sort(key=lambda x: x.profit, reverse=True)

        return routes[0]

    def run(self, iterations):
        for i in range(1, iterations):
            population=[]
            for j in range(200):
                population.append(self.tournament_choose(
                    self.population[i-1], 5))
            # population = self.population[i-1].copy()
            self.population.append(population)
            b=Breeding(self.companies,
                         self.population[i], self.tmax, self.max_profit)
            b.breed()
            self.population[i]=sorted(
                self.population[i], key=lambda x: x.profit, reverse=True)


class Vertex:
    def __init__(self, name, coords):
        self.name = name
        self.lat = coords['lat']
        self.lng = coords['lng']
        self.profit = 0

    def __repr__(self):
        return self.name

    def __str__(self):
        return self.name


class Depot(Vertex):
    pass


class Company(Vertex):
    def __init__(self, name, coords, profit):
        super().__init__(name, coords)
        self.profit = profit

    def __repr__(self):
        return self.name + ' profit - ' + str(self.profit)


class Hotel(Vertex):
    pass

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

    # def get_hotels_indexes(self):
    #     return [index for index, v in enumerate(self.route) if isinstance(v, Hotel)]

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
        self.route.insert(index, company)
        self.recount_route()

    def remove_stop(self, company):
        self.route.remove(company)
        self.recount_route()

    def swap_stops(self, a, b):
        tmp = copy.copy(self.route[a])
        self.route[a] = self.route[b]
        self.route[b] = tmp
        self.recount_route()

    def get_route(self):
        return json.dumps(self.route)

    def __repr__(self):
        string = ''
        for r in self.route:
            string += r.name + '->'

        return string

class Route:
    def __init__(self, routes, max_profit):
        self.routes = routes
        self.max_profit = max_profit
        self.distance = 0
        self.sub_distance = []
        self.profit = 0
        self.fitness = 0

        self.recount_route()

    # def get_hotels_indexes(self):
    #     return [index for index, v in enumerate(self.route) if isinstance(v, Hotel)]

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

    # def add_stop(self, index, company):
    #     self.route.insert(index, company)
    #     self.recount_route()
    #     # pdb.set_trace()
    #     # self.distance += (distance_from_stop + distance_to_stop)
    #     # self.distance -= (distance_to_index + distance_from_index)

    # def remove_stop(self, company):
    #     self.route.remove(company)
    #     self.recount_route()

    # def swap_stops(self, a, b):
    #     tmp = copy.copy(self.route[a])
    #     self.route[a] = self.route[b]
    #     self.route[b] = tmp
    #     self.recount_route()

    # def get_route(self):
    #     return json.dumps(self.route)

    def __repr__(self):
        string = ''
        for r in self.routes:
            string += r.__repr__()
            # string += r.name + '->'

        return string


# class Breeding:
#     def __init__(self, vertices, population, tmax, max_profit):
#         self.population = population
#         self.tmax = tmax
#         self.max_profit = max_profit
#         self.vertices = vertices

#     def tournament_choose(self, k):
#         tmp_pop = self.population.copy()
#         parents = []
#         for i in range(2):
#             rand_indexes = random.sample(range(0, len(tmp_pop)), k)
#             chosen = []
#             for j in range(1, k):
#                 chosen.append(self.population[rand_indexes[j]])
#             chosen = sorted(chosen, key=lambda x: x.profit, reverse=True)
#             # tmp_pop.remove(chosen[0])
#             parents.append(chosen[0])
#         return parents

#     def crossover(self):
#         # contains a list of routes in current population
#         tmp_routes = self.population.copy()

#         # tupple of coupled routes to crossover
#         parents = []

#         # for each route couple them into tupple and add to parents variable
#         for i in range(0, len(tmp_routes), 2):
#             random_indexes = random.sample(range(0, len(tmp_routes)), 2)

#             parents.append([tmp_routes[random_indexes[0]],
#                             tmp_routes[random_indexes[1]]])

#             random_indexes[1] = random_indexes[1] - \
#                 1 if random_indexes[1] > random_indexes[0] else random_indexes[1]
#             tmp_routes.remove(tmp_routes[random_indexes[0]])
#             tmp_routes.remove(tmp_routes[random_indexes[1]])

#         # for each route couple try to do crossover operation
#         for i, parent in enumerate(parents):
#             children = []
#             common_genes = list(
#                 set(parent[0].route[1:-1]).intersection(parent[1].route[1:-1]))

#             if len(common_genes) > 1:
#                 rand_gene = random.randint(0, len(common_genes) - 1)
#                 cross_indexes = [p.route.index(
#                     common_genes[rand_gene]) for p in parent]

#                 # part_route = parents[0].route[:cross_indexes[0]]
#                 # joining_part_route = [
#                 #     v for v in parents[1].route[cross_indexes[1]:-1] if v not in part_route]

#                 # child_a = Route(part_route + joining_part_route +
#                 #                 [parents[1].route[-1]])

#                 # part_route = parents[1].route[:cross_indexes[1]]
#                 # joining_part_route = [
#                 #     v for v in parents[0].route[cross_indexes[0]:-1] if v not in part_route]

#                 # child_b = Route(part_route + joining_part_route +
#                 #                 [parents[0].route[-1]])

#                 child_a = Route(
#                     parent[0].route[:cross_indexes[0]] + parent[1].route[cross_indexes[1]:], self.max_profit)
#                 child_b = Route(
#                     parent[1].route[:cross_indexes[1]] + parent[0].route[cross_indexes[0]:], self.max_profit)

#                 child_a.recount_route()
#                 child_b.recount_route()
#                 if child_a.distance <= self.tmax:
#                     children.append(child_a)

#                 if child_b.distance <= self.tmax:
#                     children.append(child_b)

#                 if child_a.distance > self.tmax and child_b.distance > self.tmax:
#                     tmp_routes.append(parent[0])
#                     tmp_routes.append(parent[1])
#                     continue
#                     # return parent

#                 if child_a.distance > self.tmax:
#                     if parent[0].profit == parent[1].profit:
#                         child_a = parent[0] if parent[0].distance < parent[1].distance else parent[1]
#                     else:
#                         child_a = parent[0] if parent[0].profit > parent[1].profit else parent[1]

#                 if child_b.distance > self.tmax:
#                     if parent[0].profit == parent[1].profit:
#                         child_b = parent[0] if parent[0].distance < parent[1].distance else parent[1]
#                     else:
#                         child_b = parent[0] if parent[0].profit > parent[1].profit else parent[1]

#                 tmp_routes.append(child_a)
#                 tmp_routes.append(child_b)

#         # return children
#         return tmp_routes

#     def mutate(self, population):
#         # print(crossovered_children)
#         population = population[:100]
#         for i, chosen_child in enumerate(population):
#             child = copy.deepcopy(chosen_child)
#             # import pdb;pdb.set_trace()
#             # random_children_index = random.randint(
#             #     0, len(population) - 1)
#             random_mutate_method = random.randint(0, 1)

#             # chosen_child = crossovered_children.copy()[random_children_index]
#             # insert a new company
#             if random_mutate_method == 0 and len(chosen_child.route) > 2:
#                 vertices_to_select = [
#                     v for v in self.vertices if v not in chosen_child.route]
#                 random_insert_index = random.randint(
#                     1, len(chosen_child.route) - 2)
#                 # TODO validate if vertices exist
#                 if not vertices_to_select:
#                     continue
#                 random_vertex = vertices_to_select[random.randint(
#                     0, len(vertices_to_select) - 1)]
#                 child.add_stop(random_insert_index, random_vertex)

#                 if child.distance <= self.tmax:
#                     # chosen_child = child
#                     # chosen_child.recount_route()
#                     child.recount_route()
#                     population.append(child)
#             elif random_mutate_method == 1 and len(chosen_child.route) > 3:
#                 swap_indexes = random.sample(
#                     range(1, len(chosen_child.route) - 1), 2)
#                 child.swap_stops(swap_indexes[0], swap_indexes[1])

#                 if child.distance <= self.tmax:
#                     # chosen_child = child
#                     child.recount_route()
#                     population.append(child)
#         return population

#     def breed(self):
#         self.population = self.crossover()
#         self.population = self.mutate(self.population)

#         # if random.random() < self.mutation_rate and children:
#         #     children = self.mutate(children)

#         # self.population += children
#         self.population = sorted(
#             self.population, key=lambda x: x.profit, reverse=True)
#         self.population = self.population[:100]
#         # string = [str(p.distance) + ' ' + str(p.profit)
#         #           for p in self.population]
#         # print(string)


# def generate_random_vertices(vertices_no, hotels_no):
#     for j in range(20):
#         random_lat = random.randint(20, 30)
#         random_lng = random.randint(15, 20)
#         random_profit = random.randint(2, 10)
#         coords = dict(lat=random_lat, lng=random_lng)

#         if j == 0:
#             depots.append(Depot(str(j), coords))
#         elif j == 19 or j == 4:
#             hotels.append(Hotel(str(j), coords))
#         else:
#             vertices.append(
#                 Company(str(j), coords, random_profit))


# Population.population.append([])
# depots = []
# vertices = []
# hotels = []


# tmax = 20
# # generate random routes
# for i in range(200):
#     route = Route([depots[0], hotels[0]])
#     tmp_vertices = vertices.copy()

#     while route.distance <= tmax and tmp_vertices:
#         random_insert_index = random.randint(
#             1, len(route.route) - 2) if len(route.route) > 2 else 1
#         random_vertex_index = random.randint(0, len(tmp_vertices) - 1)

#         vertex = tmp_vertices[random_vertex_index]

#         route.add_stop(random_insert_index, vertex)

#         if route.distance > tmax:
#             route.remove_stop(vertex)
#             break
#         else:
#             tmp_vertices.remove(vertex)
#     Population.population[0].append(route)
# Population.population[0] = sorted(
#     Population.population[0], key=lambda x: x.profit, reverse=True)

# # print(Population.population[0])

# for i in range(1, 5000):
#     population = Population.population[i-1].copy()
#     Population.population.append(population)
#     b = Breeding(Population.population[i])
#     b.breed()
#     Population.population[i] = sorted(
#         Population.population[i], key=lambda x: x.profit, reverse=True)
#     # print(Population.population[i])

# print(Population.population[-1][0].profit,
#       Population.population[-1][0].distance)
