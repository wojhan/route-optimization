from data import models


def generate_data_for_route(business_trip, data, crossover_probability=0.7, mutation_probability=0.4, elitism_rate=0.1,
                            population_size=40, iterations=1000):

    requisitions = [models.Requistion.objects.get(
        id=requistion_data['id']) for requistion_data in data['requistions']]

    depot_company = models.Company.objects.get(pk=4380)

    depots = dict(name=str(depot_company.pk), coords=(
        depot_company.latitude, depot_company.longitude))

    companies = []

    for requisition in requisitions:
        company = dict(name=str(requisition.company.pk),
                       coords=(requisition.company.latitude,
                               requisition.company.longitude),
                       profit=requisition.estimated_profit)
        companies.append(company)

    hotels = [dict(name=str(hotel.pk), coords=(hotel.latitude, hotel.longitude))
              for hotel in models.Hotel.objects.all()]

    return dict(business_trip_id=business_trip.id, depots=depots,
                companies=companies, hotels=hotels, tmax=business_trip.distance_constraint, days=business_trip.duration,
                crossover_probability=crossover_probability, mutation_probability=mutation_probability,
                elitism_rate=elitism_rate, population_size=population_size, iterations=iterations)
