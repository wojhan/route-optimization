import mpu
import random

from genetic import utils


def create_vertices(vertex_class, number):
    vertices = []
    for i in range(1, number + 1):
        coords = dict(lat=random.uniform(52.1647, 54.2437),
                      lng=random.uniform(21.3534, 24.0803))
        if vertex_class == utils.Company:
            profit = random.randint(10, 200)
            vertex = vertex_class('c' + str(i), coords, profit)
        elif vertex_class == utils.Depot:
            vertex = vertex_class('d' + str(i), coords)
        else:
            vertex = vertex_class('h' + str(i), coords)
        vertices.append(vertex)
    return vertices


def count_distance(coords_a: tuple, coords_b: tuple) -> float:
    return mpu.haversine_distance(coords_a, coords_b)
