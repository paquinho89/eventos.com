from rest_framework import serializers
from .models import Organizador

class OrganizadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organizador
        fields = ['id', 'email', 'password', 'username', 'nome_organizador', 'fecha_creacion', 'foto_organizador', 'telefono', 'mayor_edad']
        

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = Organizador(**validated_data)
        user.set_password(password)  # encripta a contraseña
        user.save()
        return user