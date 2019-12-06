from rest_framework import serializers
from rest_framework.authtoken.models import Token

from data.models import BusinessTrip, Company, Hotel, Profile, Requistion
from django.contrib.auth.models import User


class BasicUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email']


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'first_name',
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
        fields = ['estimated_profit', 'company',
                  'assignment_date']


class BusinessTripSerializer(serializers.HyperlinkedModelSerializer):
    assignee = ProfileSerializer()
    requistions = RequistionSerializer(many=True)
    estimated_profit = serializers.ReadOnlyField()
    duration = serializers.ReadOnlyField()

    class Meta:
        model = BusinessTrip
        fields = ['start_date', 'finish_date', 'duration',
                  'assignee', 'requistions', 'estimated_profit']
