from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import OrganizadorSerializer
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import default_token_generator
from django.conf import settings
from django.core.mail import send_mail
from .models import Organizador
from django.contrib.auth import authenticate

@api_view(['POST'])
def crear_organizador (request):
    serializer = OrganizadorSerializer(data=request.data)
    if serializer.is_valid():
        organizador = serializer.save(is_active = False)
        uid = urlsafe_base64_encode(force_bytes(organizador.pk))
        token = default_token_generator.make_token(organizador)
        verification_link = (f"{settings.FRONTEND_URL}/verificacion/{uid}/{token}")
        send_mail (
            subject = "Eventos.com - Verificación Cuenta",
            message = f"Acceda al siguiente lin para verficar su email \n{verification_link}",
            from_email = settings.DEFAULT_FROM_EMAIL,
            recipient_list = ["paquinho89@hotmail.com"], #[organizador.email],
            fail_silently=False,
        )
        return Response({"message": "Conta creada. Revisa o teu email."}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def verificar_email(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        organizador = Organizador.objects.get(pk=uid)
    except:
        return Response({"error": "Link inválido"}, status=400)

    if default_token_generator.check_token(organizador, token):
        organizador.is_active = True
        organizador.save()
        return Response({"success": "Conta verificada correctamente"})
    
    return Response({"error": "Token inválido ou caducado"}, status=400)

#Entrar na conta do organizador
@api_view(['POST'])
def login_organizador (request):
    email = request.data.get("email")
    password = request.data.get("password")

    if not email or not password:
        return Response(
            {"error": "Email y contraseña obligatorios"},
            status = status.HTTP_400_BAD_REQUEST
        )
    try:
        organizador = Organizador.objects.get(email=email)
    except Organizador.DoesNotExist:
        return Response(
            {"error": "Este email non está rexistrado. Crea unha conta"},
            status=status.HTTP_404_NOT_FOUND
        )
    if not organizador.check_password(password):
        return Response(
            {"error": "A contraseña é incorrecta. Se a esqueciches pódela recuperar"},
            status=status.HTTP_401_UNAUTHORIZED
        )

    if organizador is None:
        return Response(
            {"error": "Credenciales incorrectas"},
            status=status.HTTP_401_UNAUTHORIZED
        )
    if not organizador.is_active:
        return Response(
            {"error": "Debes verficar tu email primero"},
            status=status.HTTP_403_FORBIDDEN
        )
    return Response(
        {"message":"Login correcto",
         "organizador" : {
             "id": organizador.id,
             "email": organizador.email,
             "nome_organizador": organizador.nome_organizador,
         }},
        status=status.HTTP_200_OK
    )



