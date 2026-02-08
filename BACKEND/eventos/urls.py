# eventos/urls.py
from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import crear_evento_view

urlpatterns = [
    path('', crear_evento_view, name="crear_evento"),
]
