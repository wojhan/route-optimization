import genetic
from celery import task
from data import models
from genetic import route_optimizer, vertices
# from genetic.route_optimizer import NotEnoughCompaniesException

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
    #TODO: Validate random routes, if there is a error, then return information back to response
    business_trip = models.BusinessTrip.objects.get(pk=business_trip_id)
    try:
        ro.generate_random_routes()
    except genetic.route_optimizer.NotEnoughCompaniesException:
        raise RouteOptimizerException("Not enough companies to generate a route for given number of days")
    else:
        ro.run()
        for day, route_part in enumerate(ro.population[-1][0].routes):
            for index, point in enumerate(route_part.route):
                if index == 0:
                    continue
                start_point = models.Company.objects.get(pk=int(route_part.route[index - 1].name))
                end_point = models.Company.objects.get(pk=int(point.name))
                distance = ro.population[-1][0].distances[route_part.route[index - 1].id, point.id][1]
                models.Route.objects.create(start_point=start_point, end_point=end_point, distance=distance, segment_order=index, day=day, business_trip=business_trip, route_version=business_trip.route_version)
        ro.observer.set_progress(ro.observer.total, ro.observer.total)
    finally:
        business_trip.is_processed = True
        business_trip.save()
        return 'done'