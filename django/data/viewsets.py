from django.contrib.auth.models import User
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import status
from .models import Company
from .serializers import UserSerializer, CompanySerializer, TokenSerializer
import json


class StandardResultsSetPagination(PageNumberPagination):
    page_query_param = 'page'
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class CurrentUserView(APIView):
    def get(self, request):
        print(request.user)
        serializer = UserSerializer(request.user, context={'request': request})
        return Response(serializer.data)


class ObtainUserFromTokenView(APIView):
    def post(self, request):
        token = request.data['token']
        if token:
            try:
                token_obj = Token.objects.get(key=token)
            except Token.DoesNotExist:
                return Response(json.dumps({'message': 'User with given token does not exist'}), status=status.HTTP_400_BAD_REQUEST)
            else:
                serializer = TokenSerializer(
                    token_obj, context={'request': request})
                return Response(serializer.data)
        return Response(json.dumps({'message': 'Token was not provided'}), status=status.HTTP_400_BAD_REQUEST)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    pagination_class = StandardResultsSetPagination
