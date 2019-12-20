from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/business_trip/(?P<business_trip_id>\w+)/$',
            consumers.RouteConsumer),
]
