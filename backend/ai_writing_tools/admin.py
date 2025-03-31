from django.contrib import admin
from . import models

# Register your models here.

admin.site.register(models.Project)
admin.site.register(models.TextCompletion)
admin.site.register(models.TextImprovement)
admin.site.register(models.Excalidraw)
