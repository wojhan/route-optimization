import random
from typing import List, Tuple
from .routes import Route, RoutePart
from .vertices import Company


def crossover(options):
    parents: List[Route] = options[0]
    crossover_probability: float = options[1]
    mutation_probability: float = options[2]

    days: int = parents[0].days

    if random.random() <= crossover_probability:
        for day in range(days):
            parent_a_route_part: RoutePart = parents[0].get_route_part(day)
            parent_b_route_part: RoutePart = parents[1].get_route_part(day)

            if parent_a_route_part.length == 2 or parent_b_route_part.length == 2:
                continue

            if parent_a_route_part.length + parent_b_route_part.length < 7:
                continue

            max_cross_index = min(parent_a_route_part.length - 2, parent_b_route_part.length - 2)
            # random_cross_index = random.randint(1, max_cross_index)
            random_cross_index = int(1 + (random.random() * (max_cross_index - 1)))

            new_first_route, new_first_distance = parents[0].crossover(parent_a_route_part, parent_b_route_part, random_cross_index)
            new_second_route, new_second_distance = parents[1].crossover(parent_b_route_part, parent_a_route_part, random_cross_index)

            if new_first_route:
                parent_a_route_part.route = new_first_route
                distance_diff = new_first_distance - parent_a_route_part.distance
                parent_a_route_part.distance += distance_diff
                parents[0].distance += distance_diff

            if new_second_route:
                parent_b_route_part.route = new_second_route
                distance_diff = new_second_distance - parent_b_route_part.distance
                parent_b_route_part.distance += distance_diff
                parents[1].distance += distance_diff

    return [mutate([parents[0], mutation_probability]), mutate([parents[1], mutation_probability])]


def get_indexes_all_companies_in_route(route: Route, total_companies: int) -> List[Tuple[int, int]]:
    company_indexes = set()
    company_indexes_list = list()

    route_part_offset = 0
    current_route_part_index = 0
    for index in range(total_companies):
        if index + 1 - route_part_offset > route.get_route_part(current_route_part_index).length - 2:
            route_part_offset = index
            current_route_part_index += 1

        index_in_route_part = index + 1 - route_part_offset
        company_indexes.add((current_route_part_index, index_in_route_part))
        company_indexes_list.append((current_route_part_index, index_in_route_part))

    return company_indexes, company_indexes_list


def mutate_by_swap_within_the_same_route_part(route: Route, route_part: RoutePart, first_index: int, second_index: int):
    if first_index > second_index:
        tmp = first_index
        first_index = second_index
        second_index = tmp

    neighbour = False

    if second_index == first_index + 1 or second_index == first_index - 1:
        neighbour = True

    count = route.count_distance
    existing_distance_to_first = count(route_part.route[first_index - 1], route_part.route[first_index])
    existing_distance_from_second = count(route_part.route[second_index], route_part.route[second_index + 1])
    existing_distance_to_second = 0
    existing_distance_from_first = 0
    if not neighbour:
        existing_distance_from_first = count(route_part.route[first_index], route_part.route[first_index + 1])
        existing_distance_to_second = count(route_part.route[second_index - 1], route_part.route[second_index])

    existing_distance = existing_distance_from_first + existing_distance_to_first + existing_distance_from_second + existing_distance_to_second

    new_distance_to_second = count(route_part.route[first_index - 1], route_part.route[second_index])
    new_distance_from_first = count(route_part.route[first_index], route_part.route[second_index + 1])
    new_distance_to_first = 0
    new_distance_from_second = 0
    if not neighbour:
        new_distance_to_first = count(route_part.route[second_index - 1], route_part.route[first_index])
        new_distance_from_second = count(route_part.route[second_index], route_part.route[first_index + 1])

    new_distance = new_distance_from_first + new_distance_to_first + new_distance_from_second + new_distance_to_second

    distance = new_distance - existing_distance

    if route_part.distance + distance <= route.max_distance:
        tmp = route_part.route[first_index]
        route_part.route[first_index] = route_part.route[second_index]
        route_part.route[second_index] = tmp
        route.distance += distance
        route_part.distance += distance


def mutate_by_swap_within_different_route_parts(route: Route, first_route_part: RoutePart, second_route_part: RoutePart, first_index: int, second_index: int):
    count = route.count_distance
    existing_distance_to_first = count(first_route_part.route[first_index - 1], first_route_part.route[first_index])
    existing_distance_from_first = count(first_route_part.route[first_index], first_route_part.route[first_index + 1])
    existing_distance_to_second = count(second_route_part.route[second_index - 1], second_route_part.route[second_index])
    existing_distance_from_second = count(second_route_part.route[second_index], second_route_part.route[second_index + 1])

    existing_distance_for_first = existing_distance_to_first + existing_distance_from_first
    existing_distance_for_second = existing_distance_to_second + existing_distance_from_second

    new_distance_to_first = count(first_route_part.route[first_index - 1], second_route_part.route[second_index])
    new_distance_from_first = count(second_route_part.route[second_index], first_route_part.route[first_index + 1])
    new_distance_to_second = count(second_route_part.route[second_index - 1], first_route_part.route[first_index])
    new_distance_from_second = count(first_route_part.route[first_index], second_route_part.route[second_index + 1])

    new_distance_for_first = new_distance_to_first + new_distance_from_first
    new_distance_for_second = new_distance_to_second + new_distance_from_second

    distance_for_first = new_distance_for_first - existing_distance_for_first
    distance_for_second = new_distance_for_second - existing_distance_for_second

    if first_route_part.distance + distance_for_first <= route.max_distance and second_route_part.distance + distance_for_second <= route.max_distance:
        tmp = first_route_part.route[first_index]
        first_route_part.route[first_index] = second_route_part.route[second_index]
        second_route_part.route[second_index] = tmp
        route.distance += (distance_for_first + distance_for_second)
        first_route_part.distance += distance_for_first
        second_route_part.distance += distance_for_second


def mutate_by_swap(route: Route, first_route_part_index: int,  first_vertex_index: int, second_route_part_index: int, second_vertex_index: int):
    if first_route_part_index == second_route_part_index:
        route_part = route.get_route_part(first_route_part_index)
        mutate_by_swap_within_the_same_route_part(route, route_part, first_vertex_index, second_vertex_index)
    else:
        first_route_part = route.get_route_part(first_route_part_index)
        second_route_part = route.get_route_part(second_route_part_index)
        mutate_by_swap_within_different_route_parts(route, first_route_part, second_route_part, first_vertex_index, second_vertex_index)


def mutate_by_insert_company(route: Route, route_part: RoutePart, insert_index: int):
    if route.available_vertices:
        random_index = int(random.random() * (len(route.available_vertices) - 1))
        random_company_index = list(route.available_vertices)[random_index]

        random_company = route.vertices_ids[random_company_index]

        route.add_stop(route_part, insert_index, random_company)

def remove_duplicates(route: Route):
    added = list()

    for route_part in route.routes:
        new_route_part = list()
        new_route_part.append(route_part.route[0])
        for vertex in route_part.route[1:-1]:
            if vertex not in added:
                new_route_part.append(vertex)
                added.append(vertex)

        new_route_part.append(route_part.route[-1])
        route.recount_route_part(route_part)


def mutate(options):
    route: Route = options[0]
    mutation_rate = options[1]

    total_companies = 0
    for route_part in route.routes:
        total_companies += route_part.length - 2

    if int(round(mutation_rate * total_companies)) == 0:
        return route

    mutation_method_random = random.random()
    swap_method = False
    insert_method = False

    # if random.random() <= 0.4:
        # remove_duplicates(route)

    if mutation_method_random <= 0.6:
        swap_method = True

    if mutation_method_random >= 0.4:
        insert_method = True

    random_indexes = random.sample(range(total_companies), int(round(mutation_rate * total_companies)))
    company_indexes, company_indexes_list = get_indexes_all_companies_in_route(route, total_companies)
    swap_indexes = company_indexes.copy()

    for random_index in random_indexes:
        route_part_index = company_indexes_list[random_index][0]
        vertex_index = company_indexes_list[random_index][1]

        swap_indexes.discard(company_indexes_list[random_index])

        if swap_indexes and swap_method:
            random_index_to_swap = int(random.random() * (len(swap_indexes) - 1))
            random_vertex_indexes = list(swap_indexes)[random_index_to_swap]
            mutate_by_swap(route, route_part_index, vertex_index, random_vertex_indexes[0], random_vertex_indexes[1])

        if insert_method:
            mutate_by_insert_company(route, route.get_route_part(route_part_index), vertex_index)

    return route