import uuid
from typing import Tuple

class Vertex:
    def __init__(self, name, coords):
        self.id = None
        self.uuid = str(uuid.uuid1())
        self.name = name
        self.lat = coords[0]
        self.lng = coords[1]
        self.profit = 0
        self.d_index = None

    def get_coords(self) -> Tuple[float]:
        return (self.lat, self.lng)

    def __str__(self):
        return self.name


class Depot(Vertex):
    def __init__(self, name, coords):
        super().__init__(name, coords)
        self.stop_type = 'depot'

    def __str__(self):
        return self.name


class Company(Vertex):
    def __init__(self, name, coords, profit):
        super().__init__(name, coords)
        self.stop_type = 'company'
        self.profit = profit

    def __str__(self):
        return self.name + ' profit - ' + str(self.profit)


class Hotel(Vertex):
    def __init__(self, name, coords):
        super().__init__(name, coords)
        self.stop_type = 'hotel'

    def __str__(self):
        return self.name