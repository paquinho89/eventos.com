from django.db import models

# Create your models here.
class Organizador(models.Model):
    nombre_organizador = models.CharField(max_length=200)
    # imaxe_organizador = models.ImageField(upload_to='organizadores/')
    # data_creacion = models.DateTimeField(auto_now_add=True)
    # email_organizador = models.EmailField(unique=True)
    # telefono_bizum_whatsapp = models.CharField(max_length=15)
    # contraseña_organizador = models.CharField(max_length=128)
    # numero_conta = models.CharField(max_length=20)

    def __str__(self):
        return self.nombre_organizador