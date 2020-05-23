import datetime

from django.contrib import auth
from django.core.exceptions import FieldError
from rest_framework import serializers
from rest_framework.authtoken.models import Token
from rest_framework.reverse import reverse

from data import models, utils
from genetic import tasks


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

    def validate(self, attrs):
        return attrs

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


class BusinessTripSerializerMixin(serializers.ModelSerializer):
    requistions = RequistionSerializer(many=True, required=False, read_only=True)
    estimated_profit = serializers.ReadOnlyField()
    duration = serializers.ReadOnlyField()

    routes = RouteSerializer(many=True, partial=True,
                             required=False, source='get_routes_for_version')
    max_distance = serializers.IntegerField(source='distance_constraint')

    class Meta:
        abstract = True


class BusinessTripReadOnlySerializer(BusinessTripSerializerMixin):
    assignee = BasicUserSerializer(read_only=True)
    department = DepartmentSerializer(read_only=True)

    class Meta:
        model = models.BusinessTrip
        fields = ['id', 'start_date', 'finish_date', 'duration', 'distance', 'assignee', 'requistions', 'routes',
                  'estimated_profit', 'max_distance', 'is_processed', 'department']


class BusinessTripSerializer(BusinessTripSerializerMixin):

    def validate(self, attrs):
        if "start_date" in attrs and "finish_date" in attrs:
            if attrs['start_date'] > attrs['finish_date']:
                raise serializers.ValidationError({"finish_date": "Data zakończenia nie może być wcześniej niż startu"})

        return attrs

    def __update_requisitions(self, instance: 'models.BusinessTrip', update: bool = False) -> None:
        """
        Updates requisitions retrieved from POST, PUT or PATCH method, cleans up the existing business trip relation with requisitions
        and then assign them to business trip once again.

        Raises ValidationError when no requisitions passed during POST method.
        Raises DoesNotExist when no record match in database for any of passed requisitions.

        @param instance: instance of created business trip model
        @param update: for POST method is false, otherwise is true
        """
        request = self.context['request']

        if not "requisitions" in request.data:
            if not update:
                raise serializers.ValidationError({"requistions": "Nie wybrano żadnej oferty"})
            return

        requisitions = self.context['request'].data['requisitions']
        requisition_ids = [requisition['id'] for requisition in requisitions]

        instance.requistions.clear()

        for index, requisition_id in enumerate(requisition_ids):
            try:
                requisition = models.Requistion.objects.get(pk=requisition_id, business_trip=None)
            except models.Requistion.DoesNotExist as e:
                raise serializers.ValidationError(
                    {"requisitions": f"{requisitions[index]['company']['name_short']} nie jest prawidłową ofertą"})
            else:
                if requisition.business_trip:
                    raise serializers.ValidationError(
                        {"requisitions": f"{requisition} jest przypisany już do innej delegacji"})
                requisition.business_trip = instance
                requisition.save()

    def __process_route(self, instance: 'models.BusinessTrip') -> None:
        """
        Generate data for route and then starts a task responsible for processing route. Updates instance of business trip
        with task related data to keep track on progress.

        @param instance: instance of business trip
        """
        requisitions = instance.requistions.all()
        hotels = models.Hotel.objects.all()
        department = instance.department

        data = utils.generate_data_for_route(instance, requisitions, department, hotels, iterations=1000)
        task = tasks.do_generate_route.delay(data)

        instance.task_id = task.task_id
        instance.task_created = datetime.datetime.now(tz=instance.start_date.tzinfo)
        instance.task_finished = None

    def create(self, validated_data: dict) -> 'models.BusinessTrip':
        """
        Overridden method of create, custom validation and creation of requisitions and assignee. Also it starts a processing routes
        for newly created business trip.

        @param validated_data: dictionary storing information from body of POST method
        @return: instance of newly created business trip model
        """
        instance = super().create(validated_data)
        self.__update_requisitions(instance)
        instance.save()
        self.__process_route(instance)

        return instance

    def update(self, instance: 'models.BusinessTrip', validated_data: dict) -> 'models.BusinessTrip':
        """
        Overridden update method. Updates fields of business trip model.
        Checks if changed values of existing business trip are valid and given business trip requires
        change of generated routes. If it does, then starts a new generating task and updating the instance

        @param instance: instance of business trip to be updated
        @param validated_data: dict containing new field values during PUT or PATCH method
        @return: instance of updated business trip model
        """

        if not instance.is_processed:
            raise serializers.ValidationError({"non_field_errors": ["Route is being processing"]})

        self.__update_requisitions(instance, True)
        start_date = validated_data["start_date"] if "start_date" in validated_data else instance.start_date
        finish_date = validated_data["finish_date"] if "finish_date" in validated_data else instance.finish_date

        instance.start_date = start_date
        instance.finish_date = finish_date
        process_route = False

        # Process route if duration has changed
        if (finish_date - start_date).days != instance.duration - 1:
            process_route = True

        # Process route if distance constraint has changed
        if "distance_constraint" in validated_data and validated_data[
            "distance_constraint"] != instance.distance_constraint:
            instance.distance_constraint = validated_data["distance_constraint"]
            process_route = True

        # Process route if requisitions has changed
        if "requisitions" in self.context['request'].data:
            process_route = True

        # Process route if department has changed
        if "department" in validated_data:
            process_route = True
            instance.department = validated_data["department"]

        # Increment route version if new route will be generated
        if process_route:
            instance.route_version += 1
            self.__process_route(instance)

        instance.save()
        return instance

    class Meta:
        model = models.BusinessTrip
        fields = ['id', 'start_date', 'finish_date', 'duration', 'distance',
                  'assignee', 'requistions', 'routes', 'estimated_profit', 'max_distance', 'is_processed', 'department']


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
