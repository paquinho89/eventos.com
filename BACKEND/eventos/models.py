from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()
# Create your models here.
class Evento(models.Model):
    organizador = models.ForeignKey(User, on_delete=models.CASCADE)
    tipo_evento = models.CharField(max_length=100)
    nome_evento = models.CharField(max_length=200)
    descripcion_evento = models.TextField()
    imaxe_evento = models.ImageField(upload_to='eventos/', blank=True, null=True)
    data_evento = models.DateTimeField()
    localizacion = models.CharField(max_length=200, blank=True, null=True)
    tipo_localizacion = models.CharField(max_length=200, blank=True, null=True)
    entradas_venta = models.PositiveIntegerField(default=0)
    entradas_reservadas= models.PositiveIntegerField(default=0)
    entradas_vendidas= models.PositiveIntegerField(default=0)
    prezo_evento = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    numero_iban = models.CharField(max_length=34, null=True, blank=True)
    condiciones_confirmacion = models.BooleanField(default=False)
    evento_cancelado = models.BooleanField(default=False)
    xustificacion_cancelacion = models.TextField(blank=True, null=True)
    data_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nome_evento


class ReservaButaca(models.Model):
    evento = models.ForeignKey(Evento, on_delete=models.CASCADE, related_name="reservas_butacas")
    organizador = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reservas_butacas")
    zona = models.CharField(max_length=20)
    fila = models.PositiveIntegerField()
    butaca = models.PositiveIntegerField()
    data_creacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["evento", "zona", "fila", "butaca"], name="unique_reserva_butaca")
        ]

    def __str__(self):
        return f"{self.evento_id} {self.zona} fila {self.fila} butaca {self.butaca}"
    

