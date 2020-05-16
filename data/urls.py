from django.conf.urls import url
from rest_framework import routers

from data import viewsets

# Routers provide an easy way of automatically determining the URL conf.
router = routers.SimpleRouter()
router.register(r'api/users', viewsets.UserViewSet)
router.register(r'api/profiles', viewsets.ProfileViewSet)
router.register(r'api/companies', viewsets.CompanyViewSet)
router.register(r'api/business-trips', viewsets.BusinessTripViewSet)
router.register(r'api/requisitions', viewsets.RequisitionViewSet)
router.register(r'api/hotels', viewsets.HotelViewSet)
router.register(r'api/employees', viewsets.EmployeeViewSet, 'employee')
router.register(r'api/departments', viewsets.DepartmentViewSet)
router.register(
    r'api/employees/(?P<pk>[^/.])/business-trips', viewsets.EmployeeBusinessTrips, 'employee_business_trips')
router.register(
    r'api/employees/(?P<pk>[^/.])/requisitions', viewsets.EmployeeRequisitionsViewSet, 'employee_requisitions'
)
router.register(
    r'api/employees/(?P<employee_pk>[^/.])/company/(?P<company_pk>[^/.])', viewsets.EmployeeCompanyHistoryViewSet, 'employee_company_history'
)

urlpatterns = router.urls

urlpatterns += [
    url(r'^api/token$', viewsets.ObtainUserFromTokenView.as_view()),
    url(r'^api/users/current$', viewsets.CurrentUserView.as_view()),
    url(r'^api/my-profile/stats', viewsets.ProfileStatsViewSet.as_view()),
    url(r'^api/change-password', viewsets.ChangePasswordViewSet.as_view()),
    url(r'^api/companies/(?P<company_pk>[^/.]+)/employee/(?P<employee_pk>[^/.]+)',
        viewsets.CompanyEmployeeHistoryViewSet.as_view())
]
