from django.db import models
from django.contrib.auth import get_user_model
from ai_writing_tools.models import Project
import uuid


#################################
# Question Answering
#################################


class QABox(models.Model):
    id = models.UUIDField(
        default=uuid.uuid4, unique=True, primary_key=True, editable=False
    )
    user = models.ForeignKey(
        get_user_model(), on_delete=models.CASCADE, related_name="qaBoxes"
    )
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name="qaBoxes", null=True
    )
    name = models.CharField(max_length=255)
    # resources = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("name", "user")
        ordering = ["-created_at"]


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
    projects = models.ManyToManyField(Project, related_name="resources")
    qaBoxes = models.ManyToManyField(QABox, related_name="resources")
    name = models.CharField(max_length=255)
    url = models.URLField(null=True, blank=True)
    # json formated text
    embeddings = models.JSONField(default=list)
    # json formated text
    paragraphs = models.JSONField()
    text_source = models.TextField(max_length=255, blank=True, null=True)
    type = models.CharField(
        max_length=10,
        default="Text",
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

    class Meta:
        ordering = ["-created_at"]


class QAMessage(models.Model):
    id = models.UUIDField(
        default=uuid.uuid4, unique=True, primary_key=True, editable=False
    )
    user = models.ForeignKey(
        get_user_model(),
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="qamessages",
    )
    qaBox = models.ForeignKey(
        QABox,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="qamessages",
    )
    resource = models.ForeignKey(
        Resource, on_delete=models.SET_NULL, null=True, blank=True
    )
    answer = models.TextField()
    question = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
