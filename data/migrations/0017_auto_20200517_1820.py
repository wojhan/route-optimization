# Generated by Django 2.2.6 on 2020-05-17 16:20

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('data', '0016_department'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='department',
            name='name_short',
        ),
        migrations.AlterField(
            model_name='department',
            name='nip',
            field=models.CharField(max_length=11, verbose_name='nip'),
        ),
    ]
