from data import models
from .route_optimizer import RouteOptimizer
from .vertices import Company, Depot, Hotel


# @task
def do_generate_route(data):
    business_trip_id = data['business_trip_id']
    tmax = data['tmax']
    days = data['days']
    crossover_probability = data['crossover_probability']
    mutation_probability = data['mutation_probability']
    elitism_rate = data['elitism_rate']
    population_size = data['population_size']
    iterations = data['iterations']

    depot = Depot(data['depots']['name'], data['depots']['coords'])
    companies = [Company(company['name'], company['coords'], company['profit'])
                 for company in data['companies']]
    hotels = [Hotel(hotel['name'], hotel['coords'])
              for hotel in data['hotels']]

    data = dict(depot=depot, companies=companies, hotels=hotels)

    import cProfile
    p = cProfile.Profile()
    p.enable()
    ro = RouteOptimizer(business_trip_id, data, tmax, days, crossover_probability=crossover_probability,
                        mutation_probability=mutation_probability, elitsm_rate=elitism_rate,
                        population_size=population_size, iterations=iterations)
    ro.generate_random_routes()
    ro.run()
    p.disable()
    p.print_stats()

    for day, subroute in enumerate(ro.population[-1][0].routes):
        for index, point in enumerate(subroute.route):
            if index == 0:
                continue
            start_point = models.Company.objects.get(
                pk=int(subroute.route[index - 1].name))
            end_point = models.Company.objects.get(pk=int(point.name))
            distance = ro.population[-1][0].distances[subroute.route[index - 1].id][point.id][1]
            business_trip = models.BusinessTrip.objects.get(
                pk=int(business_trip_id))
            models.Route.objects.create(start_point=start_point, end_point=end_point,
                                        distance=distance, segment_order=index, day=day, business_trip=business_trip,
                                        route_version=business_trip.route_version)
    ro.observer.set_progress(ro.observer.total, ro.observer.total)

    return 'ro'
