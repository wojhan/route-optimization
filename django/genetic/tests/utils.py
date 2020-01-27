import mpu
import random

from genetic import vertices

def initializestatic(cls):
    cls.init_static()
    return cls

@initializestatic
class TestData:
    depots = (
        vertices.Depot('d1', (54.16316153633703, 23.71282342134782)),
    )
    companies = (
        vertices.Company('c1', (54.14012984312138, 21.68101434863681), 10),
        vertices.Company('c2', (53.18713501346265, 21.62101194156029), 10),
        vertices.Company('c3', (54.04382256558855, 23.873847840900154), 10),
        vertices.Company('c4', (52.232435284801504, 23.87625049202829), 10),
        vertices.Company('c5', (53.307132943141504, 23.67470959552454), 10),
        vertices.Company('c6', (52.56800450191488, 23.907350448138747), 10),
        vertices.Company('c7', (52.93180542597885, 23.286584272241427), 10),
        vertices.Company('c8', (52.49374817638531, 23.516983699625428), 10),
        vertices.Company('c9', (52.91379822245375, 22.233813535562525), 10),
    )
    hotels = (
        vertices.Hotel('h1', (53.054343149038715, 24.002008138481038)),
        vertices.Hotel('h2', (53.5732470327552, 23.13010271019389)),
        vertices.Hotel('h3', (53.1069802832682, 23.21070249193389)),
        vertices.Hotel('h4', (53.994016879831634, 21.632113173363283)),
    )

    @classmethod
    def init_static(self):
        distances = dict()
        for i, vertex in enumerate(self.depots + self.companies + self.hotels):
            distances[vertex.uuid] = dict()
            for j, another_vertex in enumerate(self.depots + self.companies + self.hotels):
                distances[vertex.uuid][another_vertex.uuid] = mpu.haversine_distance(vertex.get_coords(),
                                                                                     another_vertex.get_coords())

        self.distances = distances

    @classmethod
    def count_distance(cls, v_from, v_to):
        return cls.distances[v_from.uuid][v_to.uuid]
