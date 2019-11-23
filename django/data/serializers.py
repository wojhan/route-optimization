from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework import serializers
from data.models import Company


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'is_staff']


class CompanySerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Company
        fields = ['id', 'name', 'name_short', 'nip', 'street',
                  'house_no', 'postcode', 'city', 'latitude', 'longitude']


class TokenSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Token
        fields = ['key', 'user']