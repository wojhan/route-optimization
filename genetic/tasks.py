import datetime

from celery import task

from data import models
from genetic import route_optimizer, vertices, routes


class RouteOptimizerException(Exception):
    pass


@task(reject_on_worker_lost=True)
def do_generate_route(data):
    business_trip_id = data['business_trip_id']
    tmax = data['tmax']
    days = data['days']
    crossover_probability = data['crossover_probability']
    mutation_probability = data['mutation_probability']
    elitism_rate = data['elitism_rate']
    population_size = data['population_size']
    iterations = data['iterations']

    depot = vertices.Depot(data['depots']['name'], data['depots']['coords'])
    companies = [vertices.Company(company['name'], company['coords'], company['profit'])
                 for company in data['companies']]
    hotels = [vertices.Hotel(hotel['name'], hotel['coords'])
              for hotel in data['hotels']]

    data = dict(depot=depot, companies=companies, hotels=hotels)

    ro = route_optimizer.RouteOptimizer(business_trip_id, data, tmax, days, crossover_probability=crossover_probability,
                                        mutation_probability=mutation_probability, elitsm_rate=elitism_rate,
                                        population_size=population_size, iterations=iterations)
    # TODO: Validate random routes, if there is a error, then return information back to response
    business_trip = models.BusinessTrip.objects.get(pk=business_trip_id)
    try:
        ro.generate_random_routes()
        ro.run()
    except:
        raise RouteOptimizerException()
    else:
        route = ro.population[-1][0]
        route_part: routes.RoutePart
        for day, route_part in enumerate(route.routes):
            point: vertices.Vertex
            for index, point in enumerate(route_part.route):
                if index == 0:
                    continue

                start_point_vertex = route_part.route[index - 1]
                start_point = start_point_vertex.model.objects.get(pk=int(start_point_vertex.name))
                end_point_vertex = point
                end_point = end_point_vertex.model.objects.get(pk=int(end_point_vertex.name))

                distance = route.distances[end_point_vertex.id, start_point_vertex.id][1]

                route_type = models.Route.VISIT
                if start_point_vertex.stop_type == 'depot' and end_point_vertex.stop_type == 'company':
                    route_type = models.Route.START if day == 0 else models.Route.START_FROM_DEPOT
                if start_point_vertex.stop_type == 'hotel' and end_point_vertex.stop_type == 'company':
                    route_type = models.Route.START_FROM_HOTEL
                if start_point_vertex.stop_type == 'company' and end_point_vertex.stop_type == 'hotel':
                    route_type = models.Route.FINISH_AT_HOTEL
                if start_point_vertex.stop_type == 'company' and end_point_vertex.stop_type == 'depot':
                    route_type = models.Route.FINISH if day == ro.population[-1][
                        0].days - 1 else models.Route.FINISH_AT_DEPOT

                models.Route.objects.create(start_point=start_point,
                                            end_point=end_point,
                                            distance=distance,
                                            day=day,
                                            segment_order=index - 1,
                                            route_version=business_trip.route_version,
                                            business_trip=business_trip,
                                            route_type=route_type)
    finally:
        business_trip.task_finished = datetime.datetime.now()
        business_trip.save()

    return business_trip_id
