# Generated by Django 2.2.6 on 2020-01-21 09:40

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('data', '0006_businesstrip_distance_constraint'),
    ]

    operations = [
        migrations.AddField(
            model_name='company',
            name='added_by',
            field=models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='added_companies', to='data.Profile', verbose_name='dodany przez'),
        ),
        migrations.AddField(
            model_name='requistion',
            name='created_by',
            field=models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='created_requistions', to='data.Profile', verbose_name='stworzony przez'),
        ),
    ]