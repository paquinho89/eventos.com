from rest_framework import serializers
from .models import Organizador

class OrganizadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organizador
        fields = ['id', 'email', 'password', 'username', 'nome_organizador', 'fecha_creacion', 'foto_organizador', 'telefono', 'mayor_edad']
        

    def create(self, validated_data):
        password = validated_data.pop('password')
        email = validated_data.pop('email').lower()
        username = validated_data.pop('username', email.split("@")[0])

        organizador = Organizador(email=email, username=username, **validated_data)
        organizador.set_password(password)  # encripta a contraseña
        organizador.save()
        return organizador
    