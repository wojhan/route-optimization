from rest_framework import routers

from data.viewsets import (BusinessTripViewSet, CompanyViewSet,
                           CurrentUserView, EmployeeViewSet, HotelViewSet,
                           ObtainUserFromTokenView, RequistionViewSet,
                           RouteView, UserViewSet)
from django.conf.urls import include, url

# Routers provide an easy way of automatically determining the URL conf.
router = routers.SimpleRouter()
router.register(r'api/users', UserViewSet)
router.register(r'api/companies', CompanyViewSet)
router.register(r'api/business-trips', BusinessTripViewSet)
router.register(r'api/requistions', RequistionViewSet)
router.register(r'api/hotels', HotelViewSet)
router.register(r'api/employees', EmployeeViewSet, 'employee')

urlpatterns = router.urls

urlpatterns += [
    url(r'^api/token$', ObtainUserFromTokenView.as_view()),
    url(r'^api/users/current$', CurrentUserView.as_view()),
    url(r'^api/route$', RouteView.as_view())
]
