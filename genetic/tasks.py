import datetime

from celery import task

from data import models
from genetic import route_optimizer, vertices


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
    finally:
        business_trip.task_finished = datetime.datetime.now()
        business_trip.save()

    # TODO: Generate route with correct route segment types

    return business_trip_id
