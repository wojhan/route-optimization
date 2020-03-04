from django.apps import AppConfig


class DataConfig(AppConfig):
    from data import signals
    name = 'data'
