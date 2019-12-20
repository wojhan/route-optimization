from .models import Company, Hotel, Requistion


def generate_data_for_route(business_trip_id, data):
    requistions = [Requistion.objects.get(
        id=requistion_data['id']) for requistion_data in data['requistions']]

    depot_company = Company.objects.get(pk=4380)

    depots = [dict(name=str(depot_company.pk), coords=dict(
        lat=depot_company.latitude, lng=depot_company.longitude))]

    companies = []

    for requistion in requistions:
        company = dict(name=str(requistion.company.pk), coords=dict(
            lat=requistion.company.latitude, lng=requistion.company.longitude), profit=requistion.estimated_profit)
        companies.append(company)

    hotels = [dict(name=str(hotel.pk), coords=dict(
        lat=hotel.latitude, lng=hotel.longitude)) for hotel in Hotel.objects.all()]

    return dict(business_trip_id=business_trip_id, depots=depots,
                companies=companies, hotels=hotels, tmax=50, days=2)
