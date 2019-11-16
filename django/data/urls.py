from django.conf.urls import url
from rest_framework import routers
from data.viewsets import UserViewSet, CompanyViewSet, CurrentUserView

# Routers provide an easy way of automatically determining the URL conf.
router = routers.SimpleRouter()
router.register(r'api/users', UserViewSet)
router.register(r'api/companies', CompanyViewSet)

urlpatterns = router.urls

urlpatterns += [
    url(r'^api/users/current$', CurrentUserView.as_view()),
]
