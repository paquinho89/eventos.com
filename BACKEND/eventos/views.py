# eventos/views.py
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from .models import Evento
from .serializers import EventoSerializer


@api_view(['GET'])
@permission_classes([AllowAny])
def eventos_list_public(request):
    """
    Lista pública de todos los eventos (sin autenticación requerida).
    Usada para la home page.
    """
    eventos = Evento.objects.all().order_by('-data_creacion')
    serializer = EventoSerializer(eventos, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def crear_evento_view(request):
    """
    GET: lista de eventos do organizador autenticado
    POST: crear un novo evento (asigna `organizador` automaticamente)
    """
    if request.method == 'GET':
        eventos = Evento.objects.filter(organizador=request.user).order_by('-data_creacion')
        serializer = EventoSerializer(eventos, many=True, context={'request': request})
        return Response(serializer.data)

    # POST
    serializer = EventoSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save(organizador=request.user)
        return Response(serializer.data, status=201)

    return Response(serializer.errors, status=400)


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def evento_detail_view(request, pk):
    """Devolve os detalles dun evento se pertence ao organizador.

    Soporta GET, PUT/PATCH (editar) e DELETE.
    """
    try:
        evento = Evento.objects.get(pk=pk, organizador=request.user)
    except Evento.DoesNotExist:
        return Response({'detail': 'Evento non atopado'}, status=404)

    if request.method == 'GET':
        serializer = EventoSerializer(evento, context={'request': request})
        return Response(serializer.data)

    if request.method in ['PUT', 'PATCH']:
        partial = request.method == 'PATCH'
        serializer = EventoSerializer(evento, data=request.data, partial=partial, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    if request.method == 'DELETE':
        evento.delete()
        return Response(status=204)
