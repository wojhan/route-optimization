import django_filters

from data import models


class EmployeeBusinessTripsFilterSet(django_filters.FilterSet):
    class Meta:
        model = models.BusinessTrip
        fields = {
            "start_date": ["gt", "lt"],
            "finish_date": ["gt", "lt"]
        }
