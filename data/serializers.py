from django.contrib import auth
from django.core.exceptions import FieldError
from rest_framework import serializers
from rest_framework.authtoken.models import Token
from rest_framework.reverse import reverse

from data import models


class BasicUserSerializer(serializers.ModelSerializer):

    def validate(self, data):
        return super().validate(data)

    class Meta:
        model = auth.get_user_model()
        fields = ['id', 'username', 'first_name',
                  'last_name', 'email', 'date_joined', 'is_active']
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
        model = auth.get_user_model()
        fields = ['url', 'id', 'username', 'password', 'first_name',
                  'last_name', 'email', 'is_staff', 'is_active', 'date_joined']

        extra_kwargs = {
            'url': {
                'read_only': True
            },
            'password': {
                'write_only': True
            }
        }

    def create(self, validated_data):
        user = auth.get_user_model()(**validated_data)
        user.set_password(validated_data['password'])
        user.is_active = False
        user.save()
        return user


class ProfileSerializer(serializers.ModelSerializer):
    user = BasicUserSerializer()

    class Meta:
        model = models.Profile
        fields = ['user']


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Company
        fields = ['id', 'name', 'name_short', 'nip', 'street',
                  'house_no', 'postcode', 'city', 'latitude', 'longitude', 'added_by']
        extra_kwargs = {
            'nip': {
                'validators': []
            }
        }


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Department
        fields = ["id", "name", "nip", "street", "house_no", "postcode", "city", "latitude", "longitude"]


class HotelSerializer(serializers.HyperlinkedModelSerializer):
    class Meta(CompanySerializer):
        model = models.Hotel
        fields = ['id', 'name', 'name_short', 'nip', 'street',
                  'house_no', 'postcode', 'city', 'latitude', 'longitude']


class TokenSerializer(serializers.HyperlinkedModelSerializer):
    is_staff = serializers.SerializerMethodField()
    profile = serializers.SerializerMethodField()

    class Meta:
        model = Token
        fields = ['key', 'user', 'profile', 'is_staff']

    def get_is_staff(self, obj):
        return obj.user.is_staff

    def get_profile(self, obj):
        print(self.context['request'])
        return reverse('profile-detail', args=[obj.user.profile.id], request=self.context['request'])


class RequistionSerializer(serializers.ModelSerializer):
    company = CompanySerializer()

    def _validate_company(self, value):
        company = {}

        for key, v in value.items():
            company[key] = v

        try:
            company_obj = models.Company.objects.get_or_create(**company)
        except FieldError:
            raise serializers.ValidationError(
                'Przypisana firma nie jest instancją firmy.')

        return company_obj[0]

    def create(self, validated_data: dict):
        company = validated_data.pop('company')
        company_obj = models.Company.objects.get_or_create(**company)[0]

        validated_data['company'] = company_obj
        return super().create(validated_data)

    def update(self, instance, validated_data):
        company = validated_data.pop('company')
        company_obj = models.Company.objects.get_or_create(**company)[0]
        print(company_obj)

        instance.company = company_obj

        instance.save()

        return super().update(instance, validated_data)

    class Meta:
        model = models.Requistion
        fields = ['id', 'estimated_profit', 'company',
                  'assignment_date', 'created_by']


class RouteSerializer(serializers.ModelSerializer):
    start_point = CompanySerializer()
    end_point = CompanySerializer()

    class Meta:
        model = models.Route
        fields = ['start_point', 'end_point',
                  'segment_order', 'day', 'distance', 'route_type']


class ProfileBusinessTripStatsSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Profile
        fields = ['total_business_trips',
                  'visited_companies', 'total_distance']


class BusinessTripSerializer(serializers.ModelSerializer):
    assignee = BasicUserSerializer(partial=True, required=False)
    requistions = RequistionSerializer(many=True, partial=True, required=False)
    estimated_profit = serializers.ReadOnlyField()
    duration = serializers.ReadOnlyField()

    routes = RouteSerializer(many=True, partial=True,
                             required=False, source='get_routes_for_version')
    max_distance = serializers.IntegerField(source='distance_constraint')

    def _validate_company(self, value):
        company = {}

        for key, v in value.items():
            company[key] = v

        try:
            company_obj = models.Company.objects.get_or_create(**company)
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
                requistion_obj = models.Requistion.objects.get_or_create(
                    **requistion)
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
            user = auth.get_user_model().objects.get_or_create(**assignee)
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
        model = models.BusinessTrip
        fields = ['id', 'start_date', 'finish_date', 'duration', 'distance',
                  'assignee', 'requistions', 'routes', 'estimated_profit', 'max_distance', 'is_processed']


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(
        max_length=128, write_only=True, required=True)
    password = serializers.CharField(
        max_length=128, write_only=True, required=True)
    password2 = serializers.CharField(
        max_length=128, write_only=True, required=True)

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError(
                'Twoje stare hasło jest nieprawidłowe.'
            )
        return value

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError(
                {'password2': "Podane hasła się nie zgadzają."})
        auth.password_validation.validate_password(
            data['password'], self.context['request'].user)
        return data

    def save(self, **kwargs):
        password = self.validated_data['password']
        user = self.context['request'].user
        user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        pass

    def create(self, validated_data):
        pass


class RouteSerializerWithDetails(RouteSerializer):

    business_trip = BusinessTripSerializer()
    requisition = serializers.SerializerMethodField()

    def get_requisition(self, obj):
        return RequistionSerializer(obj.end_point.requistions.filter(business_trip=obj.business_trip).first(), context=self._context).data

    class Meta:
        model = models.Route
        fields = ['start_point', 'end_point', 'segment_order',
                  'day', 'distance', 'business_trip', 'requisition']
