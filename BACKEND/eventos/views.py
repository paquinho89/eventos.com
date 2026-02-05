# eventos/views.py
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from .models import Evento
from .serializers import EventoSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated])  # só usuarios logueados
def crear_evento_view(request):
    serializer = EventoSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(organizador=request.user)  # asigna automaticamente o usuario
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)
