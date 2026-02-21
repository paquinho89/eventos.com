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
from django.db.models import Q
from rest_framework_simplejwt.tokens import RefreshToken


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
    
    # Generar tokens JWT
    refresh = RefreshToken.for_user(organizador)

    # URL da foto (ou default)
    if organizador.foto_organizador:
        foto_url = request.build_absolute_uri(organizador.foto_organizador.url)
    else:
        foto_url = None  # ou "/default-avatar.png"
    
    return Response(
        {"message":"Login correcto",
         "access_token": str(refresh.access_token),
         "refresh_token": str(refresh),
         "organizador" : {
             "id": organizador.id,
             "email": organizador.email,
             "nome_organizador": organizador.nome_organizador,
             "foto_url": foto_url
         }},
        status=status.HTTP_200_OK
    )

@api_view(['POST'])
def recuperar_contrasena(request):
    email = request.data.get("email")
    if not email:
        return Response({"error": "Debes introducir un email"}, status=400)
    try:
        organizador = Organizador.objects.get(email=email)
    except Organizador.DoesNotExist:
        return Response({"error": "Email non rexistrado"}, status=404)

    # Xenerar token seguro
    uid = urlsafe_base64_encode(force_bytes(organizador.pk))
    token = default_token_generator.make_token(organizador)
    reset_link = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}"

    # Enviar email
    send_mail(
        subject="Eventos.com - Recuperar Contraseña",
        message=f"Preme neste enlace para cambiar a túa contraseña:\n{reset_link}",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=["paquinho89@hotmail.com"], #[organizador.email],
        fail_silently=False,
    )

    return Response({"message": "Revisa o teu email, enviámosche un link para cambiar a túa contraseña."})


@api_view(['POST'])
def reset_contrasena(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        organizador = Organizador.objects.get(pk=uid)
    except:
        return Response({"error": "Link inválido"}, status=400)

    if not default_token_generator.check_token(organizador, token):
        return Response({"error": "Token inválido ou caducado"}, status=400)

    new_password = request.data.get("password")
    if not new_password:
        return Response({"error": "Introduce unha nova contraseña"}, status=400)

    organizador.set_password(new_password)
    organizador.save()

    return Response({
        "message": "Contrasinal cambiado correctamente",
        "organizador": {
            "id": organizador.id,
            "email": organizador.email,
            "nome_organizador": organizador.nome_organizador,
        }},
        status=200
    )

