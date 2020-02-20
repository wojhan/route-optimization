import json

from rest_framework import filters, mixins, status, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from django.contrib.auth.models import User
from genetic import utils as genetic
from genetic.serializers import RouteSerializer
from genetic.tasks import do_generate_route

from .models import BusinessTrip, Company, Hotel, Profile, Requistion
from .permissions import IsAdminOrReadOnly, IsOwner, IsOwnerOrReadOnly, IsCreationOrAuthenticated
from .serializers import (BasicUserSerializer, BusinessTripSerializer,
                          CompanySerializer, HotelSerializer,
                          ProfileSerializer, RequistionSerializer,
                          TokenSerializer, UserSerializer)
from .utils import generate_data_for_route


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
    permission_classes = [IsCreationOrAuthenticated]


class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = User.objects.filter(is_staff=False)
    serializer_class = BasicUserSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ['username', 'first_name', 'last_name']
    permission_classes = [IsAdminUser]


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer


class EmployeeBusinessTrips(mixins.ListModelMixin, viewsets.GenericViewSet):
    lookup_field = 'pk'
    lookup_url_kwarg = 'business_trip_pk'
    serializer_class = BusinessTripSerializer
    pagination_class = StandardResultsSetPagination
    http_method_names = ['get', 'options']

    def get_queryset(self):
        return BusinessTrip.objects.filter(assignee_id=self.kwargs.get('pk'))


class BusinessTripViewSet(viewsets.ModelViewSet):
    queryset = BusinessTrip.objects.all()
    serializer_class = BusinessTripSerializer
    permission_classes = [IsAdminUser]

    def partial_update(self, request, pk=None):
        business_trip = BusinessTrip.objects.get(pk=pk)

        data = generate_data_for_route(business_trip, request.data)
        do_generate_route.delay(data)

        return super().partial_update(request, pk=pk)

    def get_permissions(self):
        if self.action == 'retrieve':
            permission_classes = [IsOwner]
        else:
            permission_classes = self.permission_classes

        return [permission() for permission in permission_classes]


class RequistionViewSet(viewsets.ModelViewSet):
    queryset = Requistion.objects.filter(business_trip=None)
    serializer_class = RequistionSerializer
    pagination_class = StandardResultsSetPagination
    permission_classes = [IsOwnerOrReadOnly]


class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    pagination_class = StandardResultsSetPagination
    permission_classes = [IsOwnerOrReadOnly]


class HotelViewSet(viewsets.ModelViewSet):
    queryset = Hotel.objects.all()
    serializer_class = HotelSerializer
    pagination_class = StandardResultsSetPagination
    permission_classes = [IsAdminUser]
