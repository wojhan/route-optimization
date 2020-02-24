from rest_framework import routers

from data.viewsets import (BusinessTripViewSet, CompanyViewSet,
                           CurrentUserView, EmployeeBusinessTrips,
                           EmployeeViewSet, HotelViewSet,
                           ObtainUserFromTokenView, ProfileViewSet,
                           RequistionViewSet, UserViewSet, EmployeeRequisitionsViewSet, ChangePasswordViewSet,
                           EmployeePastBusinessTrips, EmployeeCurrentBusinessTrips, ProfileStatsViewSet, EmployeeCompanyHistoryViewSet, CompanyEmployeeHistoryViewSet,
                           InActiveEmployeeViewSet)
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
router.register(r'api/inactive-employees',
                InActiveEmployeeViewSet, 'inactive_employee')
router.register(
    r'api/employees/(?P<pk>[^/.])/business-trips', EmployeeBusinessTrips, 'employee_business_trips')
router.register(
    r'api/employees/(?P<pk>[^/.])/business-trips/past', EmployeePastBusinessTrips, 'employee_past_business_trips'
)
router.register(
    r'api/employees/(?P<pk>[^/.])/business-trips/current', EmployeeCurrentBusinessTrips, 'employee_current_business_trips'
)
router.register(
    r'api/employees/(?P<pk>[^/.])/requisitions', EmployeeRequisitionsViewSet, 'employee_requisitions'
)
router.register(
    r'api/employees/(?P<employee_pk>[^/.])/company/(?P<company_pk>[^/.])', EmployeeCompanyHistoryViewSet, 'employee_company_history'
)

urlpatterns = router.urls

urlpatterns += [
    url(r'^api/token$', ObtainUserFromTokenView.as_view()),
    url(r'^api/users/current$', CurrentUserView.as_view()),
    url(r'^api/my-profile/stats', ProfileStatsViewSet.as_view()),
    url(r'^api/change-password', ChangePasswordViewSet.as_view()),
    url(r'^api/companies/(?P<company_pk>[^/.]+)/employee/(?P<employee_pk>[^/.]+)',
        CompanyEmployeeHistoryViewSet.as_view())
]
