from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid


class CustomUser(AbstractUser):
    id = models.UUIDField(
        default=uuid.uuid4, unique=True, primary_key=True, editable=False
    )
    age = models.IntegerField(null=True, blank=None)
    email = models.EmailField(
        "email address",
        unique=True,
    )
    country = models.CharField(max_length=50, null=True, blank=None)
    user_credits = models.IntegerField(default=100000)
    google_api_key = models.CharField(max_length=200, null=True, blank=False)
