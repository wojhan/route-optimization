import random
import copy
import json
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

    def add_new_random_company_to_route(self, route, possible_companies, next_company):
        while route.distance <= self.tmax and possible_companies:

            random_insert_index = random.randint(1, len(route.route) - 1)

            vertex_before = next_company(
                route.route[random_insert_index - 1], possible_companies)
            vertex_after = next_company(
                route.route[random_insert_index], possible_companies)

            if vertex_after[1] > vertex_before[1]:
                vertex = vertex_after[0]
            else:
                vertex = vertex_before[0]

            route.add_stop(random_insert_index, vertex)
            possible_companies.remove(vertex)

            # if does not exceed constraint then repeat previous step
            if route.distance > self.tmax:
                route.remove_stop(vertex)
                possible_companies.append(vertex)
                break
        return route

    def two_opt(self, route):
        best_route = route
        if len(route.route) > 3:
            opt_range = min(len(route.route), 20)
            proceeding_route = copy.deepcopy(route)
            for i in range(opt_range):
                for j in range(1, len(route.route) - 1):
                    for k in range(i + 1, len(route.route) - 1):
                        current_route = copy.deepcopy(proceeding_route)
                        to_reverse = current_route.route[j:k]
                        to_reverse.reverse()
                        new_route = SubRoute(current_route.route[:j] + to_reverse + current_route.route[k:], self.max_profit)
                        if new_route.distance < proceeding_route.distance:
                            proceeding_route = new_route
                            best_route = new_route
        best_route.recount_route()
        return best_route


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
                
                '''
                First phase
                Get random the best profit/distance vertices, try to add them to route. Repeat until there are vertices remains
                '''
                subroute = self.add_new_random_company_to_route(subroute, tmp_vertices, self.get_random_profitable_next_company_for_vertex)

                '''
                Second phase
                Get random near vertices, try to add them to route. Repeat until there are vertices remains
                '''
                subroute = self.add_new_random_company_to_route(subroute, tmp_vertices, self.get_random_nearest_next_company_for_vertex)

                '''
                TODO:Consider using that
                Try remove some of vertices with the lowest ratio to get some savings
                '''
                the_worst_neighbour = [None, 100000]
                for index, r in enumerate(subroute.route[1:-1]):
                    previous_vertex_index = self.get_vertex_index(subroute.route[index - 1])
                    current_vertex_index = self.get_vertex_index(r)
                    profit_by_distance = self.profits_by_distances[previous_vertex_index][current_vertex_index]

                    if profit_by_distance < the_worst_neighbour[1]:
                        the_worst_neighbour = [r, profit_by_distance]

                if the_worst_neighbour[0] and len(subroute.route) > 3:
                    subroute.remove_stop(the_worst_neighbour[0])
                
                '''
                Third phase
                Get 2-opt operations
                '''
                subroute = self.two_opt(subroute)
                route.routes[day] = subroute
            route.recount_route()
            self.population[0].append(route)
        self.population[0].sort(key=lambda x: x.profit, reverse=True)

    def tournament_choose(self, population, t_size):
        random_indexes = random.sample(range(0, len(population)), t_size)
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
                         self.population[i], self.tmax, self.max_profit, self.days)
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

    def __repr__(self):
        string = ''
        for r in self.routes:
            string += r.__repr__()

        return string


class Breeding:
    def __init__(self, vertices, population, tmax, max_profit, days):
        self.population = population
        self.tmax = tmax
        self.max_profit = max_profit
        self.vertices = vertices
        self.days = days

    def tournament_choose(self, k):
        tmp_pop = self.population.copy()
        parents = []
        for i in range(2):
            rand_indexes = random.sample(range(0, len(tmp_pop)), k)
            chosen = []
            for j in range(1, k):
                chosen.append(self.population[rand_indexes[j]])
            chosen = sorted(chosen, key=lambda x: x.profit, reverse=True)
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
            routes_for_parent = [parent[0].routes, parent[1].routes]
            for day in range(self.days):
            # for subroute in parent.routes:
                parent_a_subroute = parent[0].routes[day]
                parent_b_subroute = parent[1].routes[day]
                children = []
                common_genes = list(set(parent_a_subroute.route[1:-1]).intersection(parent_b_subroute.route[1:-1]))

                if len(common_genes) > 1:
                    rand_gene = random.randint(0, len(common_genes) - 1)
                    cross_indexes = [p.routes[day].route.index(common_genes[rand_gene]) for p in parent]

                    child_a = SubRoute(parent[0].routes[day].route[:cross_indexes[0]] + parent[1].routes[day].route[cross_indexes[1]:], self.max_profit)
                    child_b = SubRoute(parent[1].routes[day].route[:cross_indexes[1]] + parent[0].routes[day].route[cross_indexes[0]:], self.max_profit)

                    child_a.recount_route()
                    child_b.recount_route()

                    if child_a.distance <= self.tmax:
                        children.append(child_a)

                    if child_b.distance <= self.tmax:
                        children.append(child_b)

                    if child_a.distance > self.tmax and child_b.distance > self.tmax:
                        continue

                    if child_a.distance > self.tmax:
                        if parent[0].routes[day].profit == parent[1].routes[day].profit:
                            child_a = SubRoute(parent[0].routes[day], self.tmax) if parent[0].routes[day].distance < parent[1].routes[day].distance else SubRoute(parent[1].routes[day], self.tmax)
                        else:
                            child_a = SubRoute(parent[0].routes[day], self.tmax) if parent[0].routes[day].profit > parent[1].routes[day].profit else SubRoute(parent[1].routes[day], self.tmax)

                    if child_b.distance > self.tmax:
                        if parent[0].routes[day].profit == parent[1].routes[day].profit:
                            child_b = SubRoute(parent[0].routes[day], self.tmax) if parent[0].routes[day].distance < parent[1].routes[day].distance else SubRoute(parent[1].routes[day], self.tmax)
                        else:
                            child_b = SubRoute(parent[0].routes[day], self.tmax) if parent[0].routes[day].profit > parent[1].routes[day].profit else SubRoute(parent[1].routes[day], self.tmax)

                    parent[0].routes[day] = child_a
                    parent[1].routes[day] = child_b
            parent[0].recount_route()
            parent[1].recount_route()
        return parents

    def mutate(self, parents):
        for parent_couple in parents:
            for parent in parent_couple:
                child = copy.deepcopy(parent)

                '''
                DELETE first phase - remove duplicates
                '''
                appearence_vertices = {}
                for i, current_route in enumerate(child.routes):
                    for j, current_vertex in enumerate(current_route.route[1:-1]):
                        if current_vertex not in appearence_vertices:
                            appearence_vertices[current_vertex] = []
                        pre_distance = child.routes[i].count_distance(child.routes[i].route[j-1], current_vertex)
                        post_distance = child.routes[i].count_distance(current_vertex, child.routes[i].route[j+1])
                        distance =  pre_distance + post_distance
                        appearence_vertices[current_vertex].append((distance, i, j))
                
                for vertex in appearence_vertices:
                    appearence_vertices[vertex].sort(key=lambda x: x[0])

                new_route = Route([], self.max_profit)
                for i, current_route in enumerate(child.routes):
                    new_subroute = SubRoute([], self.max_profit)
                    for j, current_vertex in enumerate(current_route.route):
                        if current_vertex not in appearence_vertices:
                            new_subroute.route.append(current_vertex)
                            continue
                        vertices_to_exclude = appearence_vertices[current_vertex][1:]
                        if (current_vertex, i, j) in vertices_to_exclude:
                            continue
                        new_subroute.route.append(current_vertex)
                    new_subroute.recount_route()
                    new_route.routes.append(new_subroute)
                new_route.recount_route()
                child = new_route
                
                for route in child.routes:
                    '''
                    DELETE second phase - remove random city
                    '''
                    if len(route.route) > 2:
                        random_company_index = random.randint(1, len(route.route) - 1)
                        del(route.route[random_company_index])

                vertices_to_select = [v for v in self.vertices if v not in child.get_route()]
                
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
                parent = child
        
        population = []
        for parent in parents:
            population.append(parent[0])
            population.append(parent[1])
        return population

    def breed(self):
        crossed = self.crossover()
        self.population = self.mutate(crossed)

        self.population = sorted(
            self.population, key=lambda x: x.profit, reverse=True)
        self.population = self.population[:100]
