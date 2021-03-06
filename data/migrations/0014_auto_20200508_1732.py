# Generated by Django 2.2.6 on 2020-05-08 15:32

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('data', '0013_auto_20200506_2144'),
    ]

    operations = [
        migrations.AlterField(
            model_name='businesstrip',
            name='assignee',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='business_trips', to=settings.AUTH_USER_MODEL, verbose_name='przypisany'),
        ),
        migrations.AlterField(
            model_name='company',
            name='added_by',
            field=models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='added_companies', to=settings.AUTH_USER_MODEL, verbose_name='dodany przez'),
        ),
        migrations.AlterField(
            model_name='requistion',
            name='created_by',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='created_requistions', to=settings.AUTH_USER_MODEL, verbose_name='stworzony przez'),
        ),
    ]
