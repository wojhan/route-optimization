from django.contrib import auth
from django.db.models.signals import post_save
from django.dispatch import receiver

from data import models


@receiver(post_save, sender=auth.get_user_model())
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        models.Profile.objects.create(user=instance)
    instance.profile.save()
