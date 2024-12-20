from django.contrib import admin
from . import models

# Register your models here.
admin.site.register(models.ChatBox)
admin.site.register(models.ChatMessage)
