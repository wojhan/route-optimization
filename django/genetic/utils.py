import random
import copy
import math
import json
import ipdb


class RouteOptimizer:
    def __init__(self, depots, companies, hotels, tmax):
        self.depots = depots
        self.companies = companies
        self.hotels = hotels
        self.tmax = tmax
        self.population = []
        self.max_profit = self.count_max_profit(companies)

        self.generate_random_routes(200)

    def count_max_profit(self, companies):
        max_profit = 0
        for company in companies:
            max_profit = max(max_profit, company.profit)
        return max_profit

    def generate_random_routes(self, n):
        self.population.append([])
        for _ in range(n):
            route = Route([self.depots[0], self.hotels[0]], self.max_profit)
            tmp_vertices = self.companies.copy()

            while route.distance <= self.tmax and tmp_vertices:
                random_insert_index = random.randint(
                    1, len(route.route) - 2) if len(route.route) > 2 else 1
                random_vertex_index = random.randint(0, len(tmp_vertices) - 1)

                vertex = tmp_vertices[random_vertex_index]

                route.add_stop(random_insert_index, vertex)

                if route.distance > self.tmax:
                    route.remove_stop(vertex)
                    break
                else:
                    tmp_vertices.remove(vertex)
            self.population[0].append(route)
        self.population[0] = sorted(
            self.population[0], key=lambda x: (x.profit, -x.distance), reverse=True)

    def tournament_choose(self, population, t_size):
        random_indexes = random.sample(range(0, len(population)), 3)
        routes = []
        for index in random_indexes:
            routes.append(population[index])
        routes.sort(key=lambda x: x.fitness, reverse=True)

        return routes[0]

    def run(self, iterations):
        for i in range(1, iterations):
            population = []
            for j in range(200):
                population.append(self.tournament_choose(
                    self.population[i-1], 3))
            # population = self.population[i-1].copy()
            self.population.append(population)
            b = Breeding(self.companies,
                         self.population[i], self.tmax, self.max_profit)
            b.breed()
            self.population[i] = sorted(
                self.population[i], key=lambda x: (x.profit, -x.distance), reverse=True)
        # import pdb;pdb.set_trace()
            # print(self.population[i])
            # print(Population.population[i])

        # print(Population.population[-1][0].profit,
        #     Population.population[-1][0].distance)


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


class Route:
    def __init__(self, route, max_profit):
        self.route = route
        self.max_profit = max_profit
        self.distance = 0
        self.profit = 0
        self.fitness = 0

        for index, v in enumerate(list(set(route))):
            self.profit += v.profit
            if index == 0:
                continue
            self.distance += self.count_distance(route[index - 1], v)

    def count_distance(self, company_from: Vertex, company_to: Vertex) -> float:
        return math.sqrt(((company_to.lat - company_from.lat)**2) + ((math.cos((company_from.lat * math.pi)/180) * (company_to.lng - company_from.lng))**2)) * (40075.704 / 360)

    def recount_route(self):
        self.distance = 0
        self.profit = 0

        for index, v in enumerate(list(set(self.route))):
            self.profit += v.profit

        self.fitness = (self.profit / self.max_profit) * 0.5

        for index, v in enumerate(self.route):
            if index == 0:
                continue
            distance = self.count_distance(self.route[index - 1], v)
            # distance_fitness = (1 - (distance / self.distance)) * 0.5
            self.distance += distance
            # self.fitness += distance_fitness

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


class Breeding:
    def __init__(self, vertices, population, tmax, max_profit):
        self.population = population
        self.tmax = tmax
        self.max_profit = max_profit
        self.vertices = vertices

    def tournament_choose(self, k):
        tmp_pop = self.population.copy()
        parents = []
        for i in range(2):
            rand_indexes = random.sample(range(0, len(tmp_pop)), k)
            chosen = []
            for j in range(1, k):
                chosen.append(self.population[rand_indexes[j]])
            chosen = sorted(chosen, key=lambda x: (
                x.profit, -x.distance), reverse=True)
            # tmp_pop.remove(chosen[0])
            parents.append(chosen[0])
        return parents

    def crossover(self):
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

        # for each route couple try to do crossover operation
        for i, parent in enumerate(parents):
            children = []
            common_genes = list(
                set(parent[0].route[1:-1]).intersection(parent[1].route[1:-1]))

            if len(common_genes) > 1:
                rand_gene = random.randint(0, len(common_genes) - 1)
                cross_indexes = [p.route.index(
                    common_genes[rand_gene]) for p in parent]

                # part_route = parents[0].route[:cross_indexes[0]]
                # joining_part_route = [
                #     v for v in parents[1].route[cross_indexes[1]:-1] if v not in part_route]

                # child_a = Route(part_route + joining_part_route +
                #                 [parents[1].route[-1]])

                # part_route = parents[1].route[:cross_indexes[1]]
                # joining_part_route = [
                #     v for v in parents[0].route[cross_indexes[0]:-1] if v not in part_route]

                # child_b = Route(part_route + joining_part_route +
                #                 [parents[0].route[-1]])

                child_a = Route(
                    parent[0].route[:cross_indexes[0]] + parent[1].route[cross_indexes[1]:], self.max_profit)
                child_b = Route(
                    parent[1].route[:cross_indexes[1]] + parent[0].route[cross_indexes[0]:], self.max_profit)

                child_a.recount_route()
                child_b.recount_route()
                if child_a.distance <= self.tmax:
                    children.append(child_a)

                if child_b.distance <= self.tmax:
                    children.append(child_b)

                if child_a.distance > self.tmax and child_b.distance > self.tmax:
                    tmp_routes.append(parent[0])
                    tmp_routes.append(parent[1])
                    continue
                    # return parent

                if child_a.distance > self.tmax:
                    if parent[0].profit == parent[1].profit:
                        child_a = parent[0] if parent[0].distance < parent[1].distance else parent[1]
                    else:
                        child_a = parent[0] if parent[0].profit > parent[1].profit else parent[1]

                if child_b.distance > self.tmax:
                    if parent[0].profit == parent[1].profit:
                        child_b = parent[0] if parent[0].distance < parent[1].distance else parent[1]
                    else:
                        child_b = parent[0] if parent[0].profit > parent[1].profit else parent[1]

                tmp_routes.append(child_a)
                tmp_routes.append(child_b)

        # return children
        return tmp_routes

    def mutate(self, population):
        # print(crossovered_children)
        population = population[:100]
        for i, chosen_child in enumerate(population):
            child = copy.deepcopy(chosen_child)
            # import pdb;pdb.set_trace()
            # random_children_index = random.randint(
            #     0, len(population) - 1)
            random_mutate_method = random.randint(1, 1)

            # chosen_child = crossovered_children.copy()[random_children_index]
            # insert a new company
            if random_mutate_method == 0 and len(chosen_child.route) > 2:
                vertices_to_select = [
                    v for v in self.vertices if v not in chosen_child.route]
                random_insert_index = random.randint(
                    1, len(chosen_child.route) - 2)
                # TODO validate if vertices exist
                if not vertices_to_select:
                    continue
                random_vertex = vertices_to_select[random.randint(
                    0, len(vertices_to_select) - 1)]
                child.add_stop(random_insert_index, random_vertex)

                if child.distance <= self.tmax:
                    chosen_child = child
                    chosen_child.recount_route()
            elif random_mutate_method == 1 and len(chosen_child.route) > 3:
                swap_indexes = random.sample(
                    range(1, len(chosen_child.route) - 1), 2)
                child.swap_stops(swap_indexes[0], swap_indexes[1])

                if child.distance <= self.tmax:
                    chosen_child = child
                    chosen_child.recount_route()
        return population

    def breed(self):
        self.population = self.crossover()
        self.population = self.mutate(self.population)

        # if random.random() < self.mutation_rate and children:
        #     children = self.mutate(children)

        # self.population += children
        self.population = sorted(
            self.population, key=lambda x: (x.profit, -x.distance), reverse=True)
        self.population = self.population[:100]
        # string = [str(p.distance) + ' ' + str(p.profit)
        #           for p in self.population]
        # print(string)


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
