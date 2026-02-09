# eventos/urls.py
from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import crear_evento_view, evento_detail_view, eventos_list_public

urlpatterns = [
    path('', crear_evento_view, name="crear_evento"),
    path('publicos/', eventos_list_public, name='eventos_list_public'),
    path('<int:pk>/', evento_detail_view, name='evento_detail'),
]
