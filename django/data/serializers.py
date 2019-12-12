from django.core.exceptions import FieldError
from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.authtoken.models import Token

from data.models import (BusinessTrip, Company, Hotel, Profile, Requistion,
                         Route)


class BasicUserSerializer(serializers.ModelSerializer):

    def validate(self, data):
        return super().validate(data)

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']
        extra_kwargs = {
            'username': {
                'validators': []
            }
        }


class UserSerializer(serializers.HyperlinkedModelSerializer):
    url = serializers.HyperlinkedIdentityField(
        view_name='user-detail',
    )

    class Meta:
        model = User
        fields = ['url', 'id', 'username', 'first_name',
                  'last_name', 'email', 'is_staff']


class ProfileSerializer(serializers.ModelSerializer):
    user = BasicUserSerializer()

    class Meta:
        model = Profile
        fields = ['user']


class CompanySerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Company
        fields = ['id', 'name', 'name_short', 'nip', 'street',
                  'house_no', 'postcode', 'city', 'latitude', 'longitude']
        extra_kwargs = {
            'nip': {
                'validators': []
            }
        }


class HotelSerializer(serializers.HyperlinkedModelSerializer):

    class Meta(CompanySerializer):
        model = Hotel
        fields = ['id', 'name', 'name_short', 'nip', 'street',
                  'house_no', 'postcode', 'city', 'latitude', 'longitude']


class TokenSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Token
        fields = ['key', 'user']


class RequistionSerializer(serializers.HyperlinkedModelSerializer):
    company = CompanySerializer()

    class Meta:
        model = Requistion
        fields = ['id', 'estimated_profit', 'company',
                  'assignment_date']


class RouteSerializer(serializers.HyperlinkedModelSerializer):
    # days = serializers.IntegerField(source=)
    start_point = CompanySerializer()
    end_point = CompanySerializer()

    class Meta:
        model = Route
        fields = ['start_point', 'end_point',
                  'segment_order', 'day', 'distance']


class BusinessTripSerializer(serializers.HyperlinkedModelSerializer):
    assignee = ProfileSerializer(partial=True, required=False)
    requistions = RequistionSerializer(many=True, partial=True, required=False)
    estimated_profit = serializers.ReadOnlyField()
    duration = serializers.ReadOnlyField()
    routes = RouteSerializer(many=True, partial=True,
                             required=False, source='get_routes_for_version')
    max_distance = serializers.IntegerField(source='distance_constraint')

    # def validate(self, data):
    #     print(data)
    #     data = super().validate(data)
    #     return data

    def _validate_company(self, value):
        company = {}

        for key, v in value.items():
            company[key] = v

        try:
            company_obj = Company.objects.get_or_create(**company)
        except FieldError:
            raise serializers.ValidationError(
                'Przypisana firma nie jest instancją firmy.')

        return company_obj[0]

    def validate_requistions(self, value):
        requistions = []

        for single_requistion in value:
            requistion = {}
            for key, v in single_requistion.items():
                requistion[key] = v

            requistion['company'] = self._validate_company(
                requistion['company'])

            try:
                requistion_obj = Requistion.objects.get_or_create(**requistion)
            except FieldError:
                raise serializers.ValidationError(
                    'Oferta nie jest instancją oferty.')
            requistions.append(requistion_obj[0])

        return requistions

    def validate_assignee(self, value):
        assignee = {}

        for key, v in value['user'].items():
            assignee[key] = v
        try:
            user = User.objects.get_or_create(**assignee)
        except FieldError:
            raise serializers.ValidationError(
                "Przypisany nie jest instancją użytkownika")

        return user[0].profile

    def update(self, instance, validated_data):
        modify_version = False

        if 'assignee' in validated_data:
            assignee_data = validated_data.pop('assignee')
            instance.assignee = assignee_data

        if 'requistions' in validated_data:
            requistions_data = validated_data.pop('requistions')

            modify_version = True

            for requistion in instance.requistions.all():
                instance.requistions.remove(requistion)

            for requistion in requistions_data:
                instance.requistions.add(requistion)

        if modify_version:
            instance.route_version += 1

        instance.save()
        return super().update(instance, validated_data)

    class Meta:
        model = BusinessTrip
        fields = ['id', 'start_date', 'finish_date', 'duration', 'distance',
                  'assignee', 'requistions', 'routes', 'estimated_profit', 'max_distance']
