import datetime
import random
from unittest import mock

import pytest

from data import models
from data.tests import factories


@pytest.mark.django_db
class TestModels:
    def __prepare_user_profile(self):
        user = factories.EmployeeFactory()
        return user.profile

    def __prepare_business_trip(self, start_date, finish_date):
        business_trip = factories.BusinessTripFactory()
        business_trip.start_date = start_date
        business_trip.finish_date = finish_date
        business_trip.save()

        return business_trip

    def __prepare_business_trip_with_requisitions(self, number_of_requisitions):
        business_trip = factories.BusinessTripFactory()
        for _ in range(number_of_requisitions):
            requisition = factories.RequisitionFactory()
            requisition.business_trip = business_trip
            requisition.estimated_profit = 10
            requisition.save()
        return business_trip

    def prepare_business_trip_with_route(self, route_version=1):
        route = factories.RouteFactory()
        if route_version != 1:
            route.route_version = route_version
            route.save()

        return route.business_trip

    def __prepare_business_trips_for_user(self, number_of_business_trips, profile):
        for _ in range(number_of_business_trips):
            business_trip = factories.BusinessTripFactory()
            business_trip.assignee = profile
            business_trip.save()

    def __prepare_finished_business_trips_for_user(self, number_of_business_trips, profile):
        for _ in range(number_of_business_trips):
            business_trip = factories.BusinessTripFactory()
            business_trip.assignee = profile
            business_trip.start_date = datetime.datetime.now() - datetime.timedelta(days=2)
            business_trip.finish_date = datetime.datetime.now() - datetime.timedelta(days=1)
            business_trip.save()

    def __prepare_finished_business_trips_with_requisitions_for_user(self, number_of_business_trips,
                                                                     number_of_requisitions, profile):
        self.__prepare_finished_business_trips_for_user(
            number_of_business_trips, profile)

        business_trips = models.BusinessTrip.objects.all()
        for business_trip in business_trips:
            for _ in range(number_of_requisitions):
                requisition = factories.RequisitionFactory()
                requisition.business_trip = business_trip
                requisition.estimated_profit = 10
                requisition.save()

    def test_profile_total_business_trips_returns_zero_if_no_business_trips(self):
        profile = self.__prepare_user_profile()

        expected_business_trip_count = 0
        assert profile.total_business_trips == expected_business_trip_count

    def test_profile_total_business_trips_returns_n_business_trips_if_business_trips_are_assigned(self):
        random_n = random.randint(1, 10)
        profile = self.__prepare_user_profile()
        self.__prepare_business_trips_for_user(random_n, profile)

        expected_business_trip_count = random_n
        assert profile.total_business_trips == expected_business_trip_count

    def test_profile_visited_companies_returns_zero_if_no_business_trips(self):
        profile = self.__prepare_user_profile()

        expected_visited_companies_count = 0
        assert profile.total_business_trips == expected_visited_companies_count

    def test_profile_visited_companies_returns_zero_if_no_finished_business_trips(self):
        profile = self.__prepare_user_profile()
        self.__prepare_business_trips_for_user(1, profile)

        expected_visited_companies_count = 0
        assert profile.visited_companies == expected_visited_companies_count

    def test_profile_visited_companies_returns_number_if_finished_business_trips_are_assigned(self):
        random_n_business_trips = random.randint(1, 10)
        random_n_requisitions = random.randint(1, 5)
        profile = self.__prepare_user_profile()
        self.__prepare_finished_business_trips_with_requisitions_for_user(random_n_business_trips,
                                                                          random_n_requisitions, profile)

        expected_visited_companies_count = random_n_business_trips * random_n_requisitions
        assert profile.visited_companies == expected_visited_companies_count

    def test_profile_total_distance_returns_zero_if_no_business_trips(self):
        profile = self.__prepare_user_profile()

        expected_total_distance = 0
        assert profile.total_distance == expected_total_distance

    def test_profile_total_distance_returns_zero_if_no_finished_business_trips(self):
        profile = self.__prepare_user_profile()
        self.__prepare_business_trips_for_user(1, profile)

        expected_total_distance = 0
        assert profile.total_distance == expected_total_distance

    def test_profile_total_distance_returns_total_distance_if_finished_business_trips_are_assigned(self):
        profile = self.__prepare_user_profile()
        business_trip = self.prepare_business_trip_with_route()
        business_trip.assignee = profile
        business_trip.finish_date = datetime.datetime.now() - datetime.timedelta(days=1)
        business_trip.save()

        expected_total_distance = 20
        assert profile.total_distance == expected_total_distance

    def test_business_trip_duration_returns_one_day_if_start_and_finish_dates_are_the_same_day(self):
        business_trip = self.__prepare_business_trip(
            datetime.datetime.now(), datetime.datetime.now())

        expected_duration = 1
        assert business_trip.duration == expected_duration

    def test_business_trip_duration_returns_number_plus_one_days(self):
        random_days_number = random.randint(1, 5)
        business_trip = self.__prepare_business_trip(
            datetime.datetime.now() - datetime.timedelta(days=random_days_number), datetime.datetime.now())

        expected_duration = random_days_number + 1
        assert business_trip.duration == expected_duration

    def test_business_trip_estimated_profit_returns_zero_if_no_requisitions(self):
        business_trip = self.__prepare_business_trip(
            datetime.datetime.now(), datetime.datetime.now())

        expected_estimated_profit = 0
        assert business_trip.estimated_profit == expected_estimated_profit

    def test_business_trip_estimated_profit_returns_number_if_requisitions_are_assigned(self):
        random_number_of_requisitions = random.randint(1, 10)
        business_trip = self.__prepare_business_trip_with_requisitions(
            random_number_of_requisitions)

        expected_estimated_profit = random_number_of_requisitions * 10
        assert business_trip.estimated_profit == expected_estimated_profit

    def test_business_trip_get_routes_for_version_returns_empty_if_no_routes(self):
        business_trip = self.__prepare_business_trip(
            datetime.datetime.now(), datetime.datetime.now())

        expected_route_queryset_len = 0
        assert len(business_trip.get_routes_for_version()
                   ) == expected_route_queryset_len

    def test_business_trip_get_routes_for_version_returns_route_queryset_if_routes_are_added(self):
        business_trip = self.prepare_business_trip_with_route()

        expected_route_queryset_len = 1
        assert len(business_trip.get_routes_for_version()
                   ) == expected_route_queryset_len

    def test_business_trip_distance_returns_zero_if_no_routes(self):
        business_trip = self.__prepare_business_trip(
            datetime.datetime.now(), datetime.datetime.now())

        expected_distance = 0
        assert business_trip.distance == expected_distance

    def test_business_trip_distance_returns_zero_if_no_routes_for_given_version_for_route(self):
        business_trip = self.prepare_business_trip_with_route(2)

        expected_distance = 0
        assert business_trip.distance == expected_distance

    def test_business_trip_distance_returns_only_distance_of_given_version_route(self):
        business_trip = self.prepare_business_trip_with_route()
        route = factories.RouteFactory()
        route.business_trip = business_trip
        route.route_version = 2
        route.save()

        expected_distance = 20
        assert business_trip.distance == expected_distance

    @pytest.mark.parametrize("model_properties, async_properties, expected", [
        ((('task_id', None),), None, False),
        ((('task_created', None),), None, False),
        ((('task_id', 'whatever'), ('task_created', datetime.datetime.now())), (('status', 'PENDING'), ('ready', lambda: False)), False),
        ((('task_id', 'whatever'), ('task_created', datetime.datetime.now())), (('status', 'PENDING'), ('ready', lambda: True)), True),
        ((('task_id', 'whatever'), ('task_created', datetime.datetime.now() - datetime.timedelta(minutes=2))), (('status', 'PENDING'),), True),
    ])
    @mock.patch('data.models.AsyncResult')
    def test_business_trip_is_processed_returns_correct_value(self, async_result, model_properties, async_properties, expected):
        business_trip = factories.BusinessTripFactory()
        for model_property in model_properties:
            setattr(business_trip, model_property[0], model_property[1])
        business_trip.save()
        mocked = mock.MagicMock()
        async_result.return_value = mocked
        if async_properties:
            for async_property in async_properties:
                setattr(mocked, async_property[0], async_property[1])

        expected_is_processed_value = expected
        assert business_trip.is_processed == expected_is_processed_value

    @pytest.mark.parametrize("model_properties, is_processed, has_routes, expected", [
        ((('task_id', None),), True, True, 1),
        ((('task_id', None),), False, True, None),
        ((('task_id', 'whatever'), ('task_created', datetime.datetime.now()), ('task_finished', datetime.datetime.now())), True, True, None),
        ((('task_id', 'whatever'), ('task_created', datetime.datetime.now()), ('task_finished', datetime.datetime.now())), True, False, 2),
        ((('task_id', 'whatever'), ('task_created', datetime.datetime.now()), ('task_finished', datetime.datetime.now())), False, True, None)
    ])
    @mock.patch('data.models.BusinessTrip.get_routes_for_version')
    @mock.patch('data.models.BusinessTrip.is_processed', new_callable=mock.PropertyMock)
    def test_business_trip_has_error_returns_correct_value(self, mocked_is_processed, mocked_get_routes_for_version, model_properties, is_processed, has_routes, expected):
        '''
        if is_processed is True:
            if task_id or task_created or task_finished is null then algorithm didn't finish his work Return error 1
            else if get_routes_for_version is null then the given route couldn't have be found Return error 2
            else return None
        else:
            return None
        '''
        mocked_is_processed.return_value = is_processed
        mocked_get_routes_for_version.return_value = [mock.Mock()] if has_routes else []
        business_trip = factories.BusinessTripFactory()
        for model_property in model_properties:
            setattr(business_trip, model_property[0], model_property[1])
        business_trip.save()

        assert business_trip.has_error() == expected
