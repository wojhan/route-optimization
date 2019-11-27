import random
import copy
import math
import json


class RouteOptimizer:
    def __init__(self, depots, companies, hotels, tmax):
        self.depots = depots
        self.companies = companies
        self.hotels = hotels
        self.tmax = tmax
        self.population = []

        self.generate_random_routes(100)

    def generate_random_routes(self, n):
        self.population.append([])
        for i in range(200):
            route = Route([self.depots[0], self.hotels[0]])
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
            self.population[0], key=lambda x: x.profit, reverse=True)

    def run(self, iterations):
        for i in range(1, iterations):
            population = self.population[i-1].copy()
            self.population.append(population)
            b = Breeding(self.companies, self.population[i], self.tmax)
            b.breed()
            self.population[i] = sorted(
                self.population[i], key=lambda x: x.profit, reverse=True)
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
    def __init__(self, route):
        self.route = route
        self.distance = 0
        self.profit = 0

        for index, v in enumerate(route):
            self.profit += v.profit
            if index == 0:
                continue
            self.distance += self.count_distance(route[index - 1], v)

    def count_distance(self, company_from, company_to):
        return math.sqrt(((company_to.lat - company_from.lat)**2) + ((math.cos((company_from.lat * math.pi)/180) * (company_to.lng - company_from.lng))**2)) * (40075.704 / 360)
        # return abs(company_to.x - company_from.x)

    def recount_route(self):
        self.distance = 0
        self.profit = 0
        # for index, v in enumerate(list(set(self.route))):
        #     self.profit += v.profit
        profited = []
        for index, v in enumerate(self.route):
            if v not in profited:
                profited.append(v)
                self.profit += v.profit
            else:
                print("jeb")
                self.profit -= v.profit
        # print(profited)
        for index, v in enumerate(self.route):
            if index == 0:
                continue
            self.distance += self.count_distance(self.route[index - 1], v)

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
    def __init__(self, vertices, population, tmax, mutation_rate=0.1, crossover_rate=1, elitism=0.01):
        self.population = population
        self.mutation_rate = mutation_rate
        self.crossover_rate = crossover_rate
        self.elitism = elitism
        self.tmax = tmax
        self.vertices = vertices

    def tournament_choose(self, k):
        tmp_pop = self.population.copy()
        parents = []
        for i in range(2):
            rand_indexes = random.sample(range(0, len(tmp_pop)), k)
            chosen = []
            for j in range(1, k):
                chosen.append(self.population[rand_indexes[j]])
            chosen = sorted(chosen, key=lambda x: x.profit, reverse=True)
            # tmp_pop.remove(chosen[0])
            parents.append(chosen[0])
        return parents

    def crossover(self):
        # parents = (self.population[0],
        #            self.population[1])  # Route objects
        parents = self.tournament_choose(10)
        children = []
        common_genes = list(
            set(parents[0].route[1:-1]).intersection(parents[1].route[1:-1]))

        if len(common_genes) > 1:
            rand_gene = random.randint(0, len(common_genes) - 1)
            cross_indexes = [parent.route.index(
                common_genes[rand_gene]) for parent in parents]

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
                parents[0].route[:cross_indexes[0]] + parents[1].route[cross_indexes[1]:])
            child_b = Route(
                parents[1].route[:cross_indexes[1]] + parents[0].route[cross_indexes[0]:])

            if child_a.distance <= self.tmax:
                children.append(child_a)

            if child_b.distance <= self.tmax:
                children.append(child_b)

        return children

    def mutate(self, crossovered_children):
        # print(crossovered_children)
        if crossovered_children:
            random_children_index = random.randint(
                0, len(crossovered_children) - 1)
            random_mutate_method = random.randint(0, 0)

            chosen_child = crossovered_children.copy()[random_children_index]
            # insert a new company
            if random_mutate_method == 0 and len(chosen_child.route) > 2:
                vertices_to_select = [
                    v for v in self.vertices if v not in chosen_child.route]
                random_insert_index = random.randint(
                    1, len(chosen_child.route) - 2)
                # TODO validate if vertices exist
                random_vertex = vertices_to_select[random.randint(
                    0, len(vertices_to_select) - 1)]
                chosen_child.add_stop(random_insert_index, random_vertex)

                if chosen_child.distance <= self.tmax:
                    crossovered_children[random_children_index] = chosen_child
            elif random_mutate_method == 1 and len(chosen_child.route) > 3:
                swap_indexes = random.sample(
                    range(1, len(chosen_child.route) - 2), 2)
                chosen_child.swap_stops(swap_indexes[0], swap_indexes[1])

                if chosen_child.distance <= self.tmax:
                    crossovered_children[random_children_index] = chosen_child
        return crossovered_children

    def breed(self):
        children = self.crossover()

        if random.random() < self.mutation_rate and children:
            children = self.mutate(children)

        self.population += children
        self.population = sorted(
            self.population, key=lambda x: x.profit, reverse=True)
        self.population = self.population[:100]


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
