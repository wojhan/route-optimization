from rest_framework import serializers


class VertexSerializer(serializers.Serializer):
    stop_type = serializers.CharField()
    name = serializers.CharField()
    lat = serializers.FloatField()
    lng = serializers.FloatField()
    profit = serializers.FloatField()


class SubRouteSerializer(serializers.Serializer):
    route = VertexSerializer(many=True)
    distance = serializers.FloatField()
    profit = serializers.FloatField()


class RouteSerializer(serializers.Serializer):
    routes = SubRouteSerializer(many=True)
    max_profit = serializers.FloatField()
    distance = serializers.FloatField()
    profit = serializers.FloatField()
