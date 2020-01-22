from rest_framework import routers

from data.viewsets import (BusinessTripViewSet, CompanyViewSet,
                           CurrentUserView, EmployeeBusinessTrips,
                           EmployeeViewSet, HotelViewSet,
                           ObtainUserFromTokenView, ProfileViewSet,
                           RequistionViewSet, UserViewSet)
from django.conf.urls import url

# Routers provide an easy way of automatically determining the URL conf.
router = routers.SimpleRouter()
router.register(r'api/users', UserViewSet)
router.register(r'api/profiles', ProfileViewSet)
router.register(r'api/companies', CompanyViewSet)
router.register(r'api/business-trips', BusinessTripViewSet)
router.register(r'api/requistions', RequistionViewSet)
router.register(r'api/hotels', HotelViewSet)
router.register(r'api/employees', EmployeeViewSet, 'employee')
router.register(
    r'api/employees/(?P<pk>[^/.])/business-trips', EmployeeBusinessTrips, 'employee_business_trips')

urlpatterns = router.urls

urlpatterns += [
    url(r'^api/token$', ObtainUserFromTokenView.as_view()),
    url(r'^api/users/current$', CurrentUserView.as_view()),
]
