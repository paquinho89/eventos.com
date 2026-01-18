from django.http import JsonResponse
import json
from .models import Organizador

def crear_organizador (request):
    if request.method == "POST":
        data = json.loads(request.body)
        nombre_organizador = data.get("nombre_organizador")

        Organizador.objects.create(nombre_organizador=nombre_organizador)

        return JsonResponse({"mensaje": "Organizador creada"})



