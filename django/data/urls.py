from rest_framework import routers

from data.viewsets import (BusinessTripViewSet, CompanyViewSet,
                           CurrentUserView, ObtainUserFromTokenView,
                           RequistionViewSet, UserViewSet)
from django.conf.urls import url, include
# Routers provide an easy way of automatically determining the URL conf.
router = routers.SimpleRouter()
router.register(r'api/users', UserViewSet)
router.register(r'api/companies', CompanyViewSet)
router.register(r'api/business-trips', BusinessTripViewSet)
router.register(r'api/requistions', RequistionViewSet)

urlpatterns = router.urls

urlpatterns += [
    url(r'^api/token$', ObtainUserFromTokenView.as_view()),
    url(r'^api/users/current$', CurrentUserView.as_view()),
]
