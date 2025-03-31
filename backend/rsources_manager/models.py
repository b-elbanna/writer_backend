from django.db import models
from django.contrib.auth import get_user_model
from ai_writing_tools.models import Project
import uuid


# Create your models here.
class Resource(models.Model):
    id = models.UUIDField(
        default=uuid.uuid4, unique=True, primary_key=True, editable=False
    )
    user = models.ForeignKey(
        get_user_model(),
        related_name="resources",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    size = models.IntegerField(null=True)
    projects = models.ManyToManyField(Project, related_name="resources")
    file = models.FileField(upload_to="resources/")
    name = models.CharField(max_length=255)
    url = models.URLField(null=True, blank=True)
    # json formated text
    embeddings = models.JSONField()
    # json formated text
    paragraphs = models.JSONField()
    text_source = models.TextField(
        db_index=True, max_length=255, unique=True, blank=True
    )
    type = models.CharField(
        max_length=10,
        default="text",
        choices=[
            ("text", "text"),
            ("wiki", "wiki"),
            ("pdf", "pdf"),
            ("youtube", "youtube"),
            ("audio", "audio"),
            ("video", "video"),
        ],
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
