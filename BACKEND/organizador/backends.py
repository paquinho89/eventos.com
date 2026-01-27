# organizador/backends.py
from django.contrib.auth.backends import ModelBackend
from .models import Organizador

class EmailBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        email = username or kwargs.get('email')
        try:
            user = Organizador.objects.get(email=email)
        except Organizador.DoesNotExist:
            return None
        if user.check_password(password) and self.user_can_authenticate(user):
            return user
        return None
