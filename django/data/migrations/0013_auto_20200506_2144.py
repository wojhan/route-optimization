# Generated by Django 2.2.6 on 2020-05-06 19:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('data', '0012_businesstrip_task_id'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='businesstrip',
            name='is_processed',
        ),
        migrations.AddField(
            model_name='businesstrip',
            name='task_created',
            field=models.DateTimeField(blank=True, null=True, verbose_name='data stworzenia zadania'),
        ),
        migrations.AddField(
            model_name='businesstrip',
            name='task_finished',
            field=models.DateTimeField(blank=True, null=True, verbose_name='data zakończenia zadania'),
        ),
        migrations.AddField(
            model_name='businesstrip',
            name='vertices_number',
            field=models.IntegerField(default=0, verbose_name='Liczba firm oraz hoteli'),
            preserve_default=False,
        ),
    ]