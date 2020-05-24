import json

from django.contrib.auth.models import User
from django.db.models import Q
from rest_framework import filters, mixins, status, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.generics import UpdateAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from data import filters as data_filters
from data import models, permissions, serializers


class StandardResultsSetPagination(PageNumberPagination):
    page_query_param = 'page'
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class ReadOnlySerializerMixin(viewsets.ModelViewSet):
    """
    Mixin using for nested serializers.
    It has to be set read_only_serializer_class field.

    @return serializer for GET and read only serializer for POST AND PUT
    """
    read_only_serializer_class = None

    def get_serializer_class(self):
        if self.action in ('retrieve', 'list'):
            return self.read_only_serializer_class

        return self.serializer_class


class CurrentUserView(APIView):
    def get(self, request):
        serializer = serializers.UserSerializer(
            request.user, context={'request': request})
        return Response(serializer.data)


class ChangePasswordViewSet(UpdateAPIView):
    serializer_class = serializers.ChangePasswordSerializer

    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        if hasattr(user, 'auth_token'):
            user.auth_token.delete()

        token, created = Token.objects.get_or_create(user=user)

        return Response({'token': token.key}, status=status.HTTP_200_OK)


class ObtainUserFromTokenView(APIView):
    def post(self, request):
        token = request.data['token']
        if token:
            try:
                token_obj = Token.objects.get(key=token)
            except Token.DoesNotExist:
                return Response(json.dumps({'message': 'User with given token does not exist'}), status=status.HTTP_400_BAD_REQUEST)
            else:
                serializer = serializers.TokenSerializer(
                    token_obj, context={'request': request})
                return Response(serializer.data)
        return Response(json.dumps({'message': 'Token was not provided'}), status=status.HTTP_400_BAD_REQUEST)


class ProfileStatsViewSet(APIView):
    def get(self, request):
        profile = models.Profile.objects.get(pk=request.user.pk)

        serializer = serializers.ProfileBusinessTripStatsSerializer(
            profile, context={'request': request})
        return Response(serializer.data)


class CompanyEmployeeHistoryViewSet(APIView):
    def get(self, request, *args, **kwargs):
        user_pk = self.kwargs.get('employee_pk')
        company_pk = self.kwargs.get('company_pk')
        user = User.objects.get(pk=user_pk)

        requisitions = models.Requisition.objects.filter(
            company_id=company_pk, business_trip__assignee=user.profile)

        result = models.Route.objects.none()
        for requisition in requisitions:
            business_trip = requisition.business_trip
            result |= models.Route.objects.filter(
                end_point_id=company_pk, business_trip=business_trip, route_version=business_trip.route_version)

        serializer = serializers.RouteSerializerWithDetails(
            result, context={'request': request}, many=True)

        return Response(serializer.data)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = serializers.UserSerializer
    permission_classes = [permissions.IsCreationOrAuthenticated]


class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = User.objects.filter(is_staff=False)
    serializer_class = serializers.BasicUserSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter, ]
    search_fields = ['username', 'first_name', 'last_name']
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        active_param = self.request.query_params.get('is_active')
        queryset = self.queryset
        if active_param:
            queryset = queryset.filter(is_active=True if active_param in (
                'true', 'True', 1, True) else False)
        else:
            queryset = queryset.filter(is_active=True)

        return queryset


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = models.Profile.objects.all()
    serializer_class = serializers.ProfileSerializer


class EmployeeBusinessTrips(mixins.ListModelMixin, viewsets.GenericViewSet):
    serializer_class = serializers.BusinessTripSerializer
    filterset_class = data_filters.EmployeeBusinessTripsFilterSet
    pagination_class = StandardResultsSetPagination
    http_method_names = ['get', 'options']

    def get_queryset(self):
        return models.BusinessTrip.objects.filter(assignee_id=self.kwargs.get('pk'))


class EmployeeRequisitionsViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    serializer_class = serializers.RequisitionSerializer
    pagination_class = StandardResultsSetPagination
    http_method_names = ['get', 'options']

    def get_queryset(self):
        user_pk = self.kwargs.get('pk')
        user = User.objects.get(pk=user_pk)

        objects = models.Requisition.objects.filter(business_trip=None)

        if user.is_staff:
            return objects.filter(created_by=None)
        else:
            return objects.filter(Q(created_by=None) | Q(created_by=user))


class EmployeeCompanyHistoryViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    lookup_field = 'end_point_id'
    lookup_url_kwarg = 'company_pk'
    serializer_class = serializers.RouteSerializer
    http_method_names = ['get', 'options']

    def get_queryset(self):
        user_pk = self.kwargs.get('employee_pk')
        company_pk = self.kwargs.get('company_pk')
        user = User.objects.get(pk=user_pk)

        requisitions = models.Requisition.objects.filter(
            company_id=company_pk, business_trip__assignee=user.profile)

        result = models.Route.objects.none()
        for requisition in requisitions:
            business_trip = requisition.business_trip
            result |= models.Route.objects.filter(
                end_point_id=company_pk, business_trip=business_trip, route_version=business_trip.route_version)

        return result


class BusinessTripViewSet(ReadOnlySerializerMixin, viewsets.ModelViewSet):
    queryset = models.BusinessTrip.objects.all()
    serializer_class = serializers.BusinessTripSerializer
    read_only_serializer_class = serializers.BusinessTripReadOnlySerializer
    permission_classes = [IsAdminUser]

    def get_permissions(self):
        if self.action == 'retrieve':
            permission_classes = [permissions.IsOwner]
        else:
            permission_classes = self.permission_classes

        return [permission() for permission in permission_classes]


class RequisitionViewSet(ReadOnlySerializerMixin, viewsets.ModelViewSet):
    queryset = models.Requisition.objects.filter(business_trip=None)
    serializer_class = serializers.RequisitionSerializer
    read_only_serializer_class = serializers.RequisitionReadOnlySerializer
    pagination_class = StandardResultsSetPagination
    permission_classes = [permissions.IsOwnerOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['company__name_short', 'company__nip']

    def get_queryset(self):
        queryset = super().get_queryset()

        queryset.filter(Q(created_by=self.request.user)
                        | Q(created_by=None))

        return queryset


class CompanyViewSet(viewsets.ModelViewSet):
    queryset = models.Company.objects.all()
    serializer_class = serializers.CompanySerializer
    pagination_class = StandardResultsSetPagination
    permission_classes = [permissions.IsOwnerOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name_short', 'nip']


class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = models.Department.objects.all()
    serializer_class = serializers.DepartmentSerializer
    pagination_class = StandardResultsSetPagination
    permission_classes = [IsAdminUser]
    filter_backends = [filters.SearchFilter]
    search_fields = ["name", "nip"]


class HotelViewSet(viewsets.ModelViewSet):
    queryset = models.Hotel.objects.all()
    serializer_class = serializers.HotelSerializer
    pagination_class = StandardResultsSetPagination
    permission_classes = [IsAdminUser]
