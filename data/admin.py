from django.contrib import admin

from data import models


class CompanyAdmin(admin.ModelAdmin):
    search_fields = ('name', 'city')


class RequistionAdmin(admin.ModelAdmin):
    raw_id_fields = ('company',)
    autocomplete_lookup_fields = {
        'fk': ['company'],
    }


admin.site.register(models.BusinessTrip)
admin.site.register(models.Company, CompanyAdmin)
admin.site.register(models.Profile)
admin.site.register(models.Requistion, RequistionAdmin)
admin.site.register(models.Route)
admin.site.register(models.Department)
