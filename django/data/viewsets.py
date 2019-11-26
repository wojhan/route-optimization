from django.contrib.auth.models import User
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import status
from .models import Company, BusinessTrip, Requistion
from .serializers import UserSerializer, CompanySerializer, TokenSerializer, BusinessTripSerializer, RequistionSerializer
import json
from genetic import utils as genetic


class StandardResultsSetPagination(PageNumberPagination):
    page_query_param = 'page'
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class CurrentUserView(APIView):
    def get(self, request):
        print(request.user)
        serializer = UserSerializer(request.user, context={'request': request})
        return Response(serializer.data)


class RouteView(APIView):
    def get(self, request):
        requistions = Requistion.objects.all()

        depot_company = Company.objects.get(pk=5)
        depots = [genetic.Depot(depot_company.name, dict(
            lat=depot_company.latitude, lng=depot_company.longitude))]

        hotel_companies = (Company.objects.get(pk=2),
                           Company.objects.get(pk=3))
        hotels = [
            genetic.Hotel(hotel_companies[0].name, dict(
                lat=hotel_companies[0].latitude, lng=hotel_companies[0].longitude)),
            genetic.Hotel(hotel_companies[1].name, dict(lat=hotel_companies[1].latitude, lng=hotel_companies[1].longitude))]

        companies = []
        for requstion in requistions:
            company = genetic.Company(requstion.company.name, dict(
                lat=requstion.company.latitude, lng=requstion.company.longitude), requstion.estimated_profit)
            companies.append(company)

        ro = genetic.RouteOptimizer(depots, companies, hotels, 150)
        routes = []
        for r in ro.population[0]:
            # print(route.route)
            route = []
            for stop in r.route:
                route.append(
                    {
                        'name': stop.name,
                        'coords': {
                            'lat': stop.lat,
                            'lng': stop.lng
                        }
                    })
            routes.append(route)
        return Response(json.dumps(routes, ensure_ascii=False))


class ObtainUserFromTokenView(APIView):
    def post(self, request):
        token = request.data['token']
        if token:
            try:
                token_obj = Token.objects.get(key=token)
            except Token.DoesNotExist:
                return Response(json.dumps({'message': 'User with given token does not exist'}), status=status.HTTP_400_BAD_REQUEST)
            else:
                serializer = TokenSerializer(
                    token_obj, context={'request': request})
                return Response(serializer.data)
        return Response(json.dumps({'message': 'Token was not provided'}), status=status.HTTP_400_BAD_REQUEST)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class BusinessTripViewSet(viewsets.ModelViewSet):
    queryset = BusinessTrip.objects.all()
    serializer_class = BusinessTripSerializer


class RequistionViewSet(viewsets.ModelViewSet):
    queryset = Requistion.objects.all()
    serializer_class = RequistionSerializer


class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    pagination_class = StandardResultsSetPagination
