from django.contrib import admin
from django import forms

from .models import BusinessTrip, Company, Profile, Requistion, Route


class CompanyAdmin(admin.ModelAdmin):
    search_fields = ('name', 'city')


class RequistionAdmin(admin.ModelAdmin):
    # define the raw_id_fields
    raw_id_fields = ('company',)
    # define the autocomplete_lookup_fields
    autocomplete_lookup_fields = {
        'fk': ['company'],
    }


admin.site.register(Company, CompanyAdmin)
admin.site.register(BusinessTrip)
admin.site.register(Profile)
admin.site.register(Requistion, RequistionAdmin)
admin.site.register(Route)
