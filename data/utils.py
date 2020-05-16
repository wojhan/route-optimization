import channels.layers
from asgiref.sync import async_to_sync

from data import renderers

def check_business_trip_status(business_trip):
    error = business_trip.has_error()

    if error == 1:
        return "FAILED", "Algorithm's error occurred"

    if error == 2:
        return "FAILED", "No possible route found for parameters"

    if not business_trip.is_processed:
        return "PROCESSING", "Route is being processed"

    return "SUCCEEDED", business_trip.pk

def update_business_trip_by_ws(business_trip_id, message_type, message):
    channel_layer = channels.layers.get_channel_layer()
    group_name = 'business_trip_%s' % business_trip_id

    async_to_sync(channel_layer.group_send)(
        group_name,
        {
            "type": "update_business_trip_message",
            "messageType": message_type,
            "message": message
        }
    )

# def generate_data_for_route(business_trip, data, crossover_probability=0.7, mutation_probability=0.4, elitism_rate=0.1,
#                             population_size=40, iterations=1000):
#
#     requisitions = [models.Requistion.objects.get(
#         id=requistion_data['id']) for requistion_data in data['requistions']]
#
#     depot_company = models.Company.objects.get(pk=4380)
#
#     depots = dict(name=str(depot_company.pk), coords=(
#         depot_company.latitude, depot_company.longitude))
#
#     companies = []
#
#     for requisition in requisitions:
#         company = dict(name=str(requisition.company.pk),
#                        coords=(requisition.company.latitude,
#                                requisition.company.longitude),
#                        profit=requisition.estimated_profit)
#         companies.append(company)
#
#     hotels = [dict(name=str(hotel.pk), coords=(hotel.latitude, hotel.longitude))
#               for hotel in models.Hotel.objects.all()]
#
#     return dict(business_trip_id=business_trip.id, depots=depots,
#                 companies=companies, hotels=hotels, tmax=business_trip.distance_constraint, days=business_trip.duration,
#                 crossover_probability=crossover_probability, mutation_probability=mutation_probability,
#                 elitism_rate=elitism_rate, population_size=population_size, iterations=iterations)
