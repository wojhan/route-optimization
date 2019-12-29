from celery import task
from data import models
from .utils import SubRoute, Route, RouteOptimizer, RouteObserver, Depot, Hotel, Company


@task
def do_generate_route(data):
    business_trip_id = data['business_trip_id']
    tmax = data['tmax']
    days = data['days']

    depots = [Depot(depot['name'], depot['coords'])
              for depot in data['depots']]
    companies = [Company(company['name'], company['coords'], company['profit'])
                 for company in data['companies']]
    hotels = [Hotel(hotel['name'], hotel['coords'])
              for hotel in data['hotels']]

    ro = RouteOptimizer(business_trip_id, depots,
                        companies, hotels, tmax, days)
    ro.run(2000)
    for day, subroute in enumerate(ro.population[-1][0].routes):
        for index, point in enumerate(subroute.route):
            if index == 0:
                continue
            start_point = models.Company.objects.get(
                pk=int(subroute.route[index - 1].name))
            end_point = models.Company.objects.get(pk=int(point.name))
            distance = subroute.count_distance(
                subroute.route[index - 1], point)
            business_trip = models.BusinessTrip.objects.get(
                pk=int(business_trip_id))
            models.Route.objects.create(start_point=start_point, end_point=end_point,
                                        distance=distance, segment_order=index, day=day, business_trip=business_trip, route_version=business_trip.route_version)
    ro.observer.set_progress(ro.observer.total, ro.observer.total)

    return 'ro'
