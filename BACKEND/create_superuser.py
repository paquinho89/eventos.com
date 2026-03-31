import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'BACKEND.settings')
django.setup()

from organizador.models import Organizador

email = os.getenv('DJANGO_SUPERUSER_EMAIL', '')
password = os.getenv('DJANGO_SUPERUSER_PASSWORD', '')

if email and password:
    if not Organizador.objects.filter(email=email).exists():
        Organizador.objects.create_superuser(
            email=email,
            username=email.split('@')[0],
            nome_organizador='Admin',
            password=password,
            telefono='+000000000',
        )
        print(f'Superuser {email} created.')
    else:
        print(f'Superuser {email} already exists.')
else:
    print('DJANGO_SUPERUSER_EMAIL or DJANGO_SUPERUSER_PASSWORD not set, skipping.')
