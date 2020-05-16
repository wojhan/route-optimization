from datetime import datetime, timedelta

import pytest
from django.urls import reverse

from data.tests import factories


@pytest.mark.django_db
class TestViewSets:
    def __prepare_business_trip_without_assignment(self):
        return factories.BusinessTripFactory()

    def __prepare_business_trip_with_assignment(self, user, start_date=None, finish_date=None):
        business_trip = self.__prepare_business_trip_without_assignment()
        business_trip.assignee = user.profile
        if start_date:
            business_trip.start_date = start_date
        if finish_date:
            business_trip.finish_date = finish_date
        business_trip.save()

        return business_trip

    def __prepare_past_business_trip_with_assigment(self, user):
        return self.__prepare_business_trip_with_assignment(
            user,
            datetime.now() - timedelta(days=2),
            datetime.now() - timedelta(days=1)
        )

    def __prepare_future_business_trip_with_assignment(self, user):
        return self.__prepare_business_trip_with_assignment(
            user,
            datetime.now() + timedelta(days=1),
            datetime.now() + timedelta(days=2)
        )

    def __reverse_employees_url(self):
        return reverse("employee-list") + "?format=json"

    def __reverse_inactive_employees_url(self):
        return self.__reverse_employees_url() + '&is_active=False'

    def __reverse_employee_business_trips_url(self, user_id):
        return reverse('employee_business_trips-list', args=[user_id]) + '?format=json'

    def __reverse_past_employee_business_trips_url(self, user_id):
        now = datetime.now()
        date = f"{datetime.date(now)}+{datetime.time(now)}"
        return self.__reverse_employee_business_trips_url(user_id) + f"&finish_date__lt={date}"

    def __reverse_current_employee_business_trips_url(self, user_id):
        now = datetime.now()
        date = f"{datetime.date(now)}+{datetime.time(now)}"
        return self.__reverse_employee_business_trips_url(user_id) + f"&start_date__lt={date}&finish_date__gt={date}"

    def __reverse_future_employee_business_trips_url(self, user_id):
        now = datetime.now()
        date = f"{datetime.date(now)}+{datetime.time(now)}"
        return self.__reverse_employee_business_trips_url(user_id) + f"&start_date__gt={date}"

    def __get_response(self, client, token, url, method, body=None):
        if hasattr(client, method):
            response = getattr(client, method)(url, HTTP_AUTHORIZATION=f'Token {token}',
                                               HTTP_CONTENT_TYPE="application/json")
            return response, response.json()

    '''
    Tests related to employee business trips view sets /api/employees/<employee_pk>/business-trips/
    
    Given user should see only business trips which are assigned to him. Also it may be filtered for specific cases:
    1. past business trips - business trip's finish date is less than current date
    2. current business trips - business trip's start date is less than current date and its finish date is greater than current day
    3. future business trips - business trips's start date is greater than current date
    '''

    def test_employee_business_trips_viewset_gives_empty_results_if_business_trip_is_not_assigned_to_user(self, client):
        user, token = factories.get_user_with_token()
        business_trip = self.__prepare_business_trip_without_assignment()

        response, response_json = self.__get_response(client, token,
                                                      self.__reverse_employee_business_trips_url(user.id), 'get')

        expected_business_trip_count = 0
        assert response_json['count'] == expected_business_trip_count

    def test_employee_business_trips_viewset_gives_one_result_if_one_business_trip_is_assigned_to_user(self, client):
        user, token = factories.get_user_with_token()
        business_trip = self.__prepare_business_trip_with_assignment(user)

        response, response_json = self.__get_response(
            client, token, self.__reverse_employee_business_trips_url(user.id), 'get')

        expected_business_trip_count = 1
        assert response_json['count'] == expected_business_trip_count

    def test_employee_business_trips_viewset_with_past_finish_date_gives_empty_results_if_none_business_trips_meet_criteria(self, client):
        user, token = factories.get_user_with_token()
        business_trip = self.__prepare_business_trip_with_assignment(user)

        response, response_json = self.__get_response(
            client, token, self.__reverse_past_employee_business_trips_url(user.id), 'get')

        expected_business_trip_count = 0
        assert response_json['count'] == expected_business_trip_count

    def test_employee_business_trips_viewset_with_past_finish_date_gives_one_result_if_one_business_trip_meets_criteria(self, client):
        user, token = factories.get_user_with_token()
        business_trip = self.__prepare_past_business_trip_with_assigment(user)

        url = self.__reverse_past_employee_business_trips_url(user.id)
        response, response_json = self.__get_response(
            client, token, url, 'get')

        expected_business_trip_count = 1
        assert response_json['count'] == expected_business_trip_count

    def test_employee_business_trips_viewset_with_current_dates_gives_empty_result_if_none_business_trips_meet_criteria(self, client):
        user, token = factories.get_user_with_token()
        business_trip = self.__prepare_past_business_trip_with_assigment(user)

        url = self.__reverse_current_employee_business_trips_url(user.id)
        response, response_json = self.__get_response(
            client, token, url, 'get')

        expected_business_trip_count = 0
        assert response_json['count'] == expected_business_trip_count

    def test_employee_business_trips_viewset_with_current_dates_gives_one_result_if_one_business_trip_meets_criteria(self, client):
        user, token = factories.get_user_with_token()
        business_trip = self.__prepare_business_trip_with_assignment(user)

        url = self.__reverse_current_employee_business_trips_url(user.id)
        response, response_json = self.__get_response(
            client, token, url, 'get')

        expected_business_trip_count = 1
        assert response_json['count'] == expected_business_trip_count

    def test_employee_business_trips_viewset_with_future_start_date_gives_empty_result_if_none_business_trips_meet_criteria(self, client):
        user, token = factories.get_user_with_token()
        business_trip = self.__prepare_business_trip_with_assignment(user)

        url = self.__reverse_future_employee_business_trips_url(user.id)
        response, response_json = self.__get_response(
            client, token, url, 'get')

        expected_business_trip_count = 0
        assert response_json['count'] == expected_business_trip_count

    def test_employee_business_trips_viewset_with_future_start_date_gives_one_result_if_one_business_trip_meets_criteria(
            self, client):
        user, token = factories.get_user_with_token()
        business_trip = self.__prepare_future_business_trip_with_assignment(
            user)

        url = self.__reverse_future_employee_business_trips_url(user.id)
        response, response_json = self.__get_response(
            client, token, url, 'get')

        expected_business_trip_count = 1
        assert response_json['count'] == expected_business_trip_count

    '''
    Test related to employee view set /api/employees/ - without query params returns active standard users
    
    Given view set can be accessed only by admins. Employee is a user who is is_staff and/or is_superuser property turned off.
    They may be also filtering using is_active query param in specific cases:
    1. is_active is set to True, than is default behaviour of that view set
    2. is_active is set to False, than only inactive employees are returned.
    
    '''

    def test_employee_viewset_gives_forbidden_status_when_user_is_not_admin(self, client):
        user, token = factories.get_user_with_token()

        url = self.__reverse_employees_url()
        response, response_json = self.__get_response(
            client, token, url, 'get')

        expected_status_code = 403

        assert response.status_code == expected_status_code

    def test_employee_viewset_gives_ok_status_when_user_is_admin(self, client):
        user, token = factories.get_admin_user_with_token()

        url = self.__reverse_employees_url()
        response, response_json = self.__get_response(
            client, token, url, 'get')

        expected_status_code = 200

        assert response.status_code == expected_status_code

    def test_employee_viewset_with_inactive_filter_gives_ok_status(self, client):
        user, token = factories.get_admin_user_with_token()

        url = self.__reverse_inactive_employees_url()
        response, response_json = self.__get_response(
            client, token, url, 'get')

        expected_status_code = 200

        assert response.status_code == expected_status_code

    def test_employee_viewset_gives_empty_result_if_none_users_with_is_staff_turned_off(self, client):
        user, token = factories.get_admin_user_with_token()

        url = self.__reverse_employees_url()
        response, response_json = self.__get_response(
            client, token, url, 'get')

        expected_employee_count = 0
        assert response_json['count'] == expected_employee_count

    def test_employee_viewset_gives_one_result_if_one_user_with_is_staff_turned_off(self, client):
        user, token = factories.get_admin_user_with_token()
        factories.get_user_with_token()

        url = self.__reverse_employees_url()
        response, response_json = self.__get_response(
            client, token, url, 'get')

        expected_employee_count = 1
        assert response_json['count'] == expected_employee_count

    def test_employee_viewset_gives_empty_result_if_none_users_are_active(self, client):
        user, token = factories.get_admin_user_with_token()
        factories.get_inactive_user_with_token()

        url = self.__reverse_employees_url()
        response, response_json = self.__get_response(
            client, token, url, 'get')

        expected_employee_count = 0
        assert response_json['count'] == expected_employee_count

    def test_employee_viewset_gives_one_result_if_one_user_is_active(self, client):
        user, token = factories.get_admin_user_with_token()
        factories.get_user_with_token()

        url = self.__reverse_employees_url()
        response, response_json = self.__get_response(
            client, token, url, 'get')

        expected_employee_count = 1
        assert response_json['count'] == expected_employee_count

    def test_employee_viewset_with_inactive_filter_gives_empty_result_if_none_users_are_inactive(self, client):
        user, token = factories.get_admin_user_with_token()
        factories.get_user_with_token()

        url = self.__reverse_inactive_employees_url()
        response, response_json = self.__get_response(
            client, token, url, 'get')

        expected_employee_count = 0
        assert response_json['count'] == expected_employee_count

    def test_employee_viewset_with_inactive_filter_gives_one_result_if_one_user_is_inactive(self, client):
        user, token = factories.get_admin_user_with_token()
        factories.get_inactive_user_with_token()

        url = self.__reverse_inactive_employees_url()
        response, response_json = self.__get_response(
            client, token, url, 'get')

        expected_employee_count = 1
        assert response_json['count'] == expected_employee_count
