import json

from rest_framework import status, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView

from django.contrib.auth.models import User
from genetic import utils as genetic
from genetic.serializers import RouteSerializer

from .models import BusinessTrip, Company, Hotel, Requistion
from .serializers import (BusinessTripSerializer, CompanySerializer,
                          HotelSerializer, RequistionSerializer,
                          TokenSerializer, UserSerializer)


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

        depot_company = Company.objects.get(pk=4380)
        depots = [genetic.Depot(str(depot_company.pk), dict(
            lat=depot_company.latitude, lng=depot_company.longitude))]

        # hotels = Hotel.objects.all()

        companies = []
        for requstion in requistions:
            company = genetic.Company(str(requstion.company.pk), dict(
                lat=requstion.company.latitude, lng=requstion.company.longitude), requstion.estimated_profit)
            companies.append(company)

        hotels = []
        for hotel in Hotel.objects.all():
            hotels.append(genetic.Hotel(str(hotel.pk), dict(
                lat=hotel.latitude, lng=hotel.longitude)))

        ro = genetic.RouteOptimizer(depots, companies, hotels, 50, 2)
        ro.run(100)
        route_serializer = RouteSerializer(ro.population[-1][0])
        return Response(route_serializer.data)


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


class HotelViewSet(viewsets.ModelViewSet):
    queryset = Hotel.objects.all()
    serializer_class = HotelSerializer
    pagination_class = StandardResultsSetPagination
