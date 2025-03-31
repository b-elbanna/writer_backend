"""
NOT COMPLETED YET
"""

from ai_writing_tools.models import Project

# Create your views here.
import PyPDF2

import re
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from rest_framework.validators import ValidationError
from rest_framework.generics import GenericAPIView, ListCreateAPIView, RetrieveAPIView
from .serializers import ResourceSerializer, ExtractPdfDataSerializer
from .models import Resource
from ai_utils import embedding
from search_utils import wiki

# from .qa_utils import most_related_paragraphs
from django.core.files.uploadedfile import InMemoryUploadedFile


class ExtractPdfDataView(ListCreateAPIView):
    """
    NOT COMPLETED YET
    """

    serializer_class = ExtractPdfDataSerializer

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):

        # Do something with the text field here
        serializer.save(
            user=self.request.user,
        )

    def post(self, request, format=None):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        file: InMemoryUploadedFile = serializer.validated_data["file"]

        try:
            extracted_data = self.extract_pdf_data(file)
            Resource().text_source
            Resource().type
            # self.perform_create(serializer)
            serializer.save(
                user=self.request.user,
                name=extracted_data["file_name"],
                size=extracted_data["file_size"],
                text_source=extracted_data["text"],
                type=extracted_data["file_type"],
            )

            return Response(extracted_data, status=status.HTTP_201_CREATED)
        except PyPDF2.errors.PdfReadError as e:
            raise ValidationError({"file": f"Invalid PDF file: {e}"})
        except Exception as e:
            raise ValidationError({"file": f"Error processing PDF: {e}"})

    def extract_pdf_data(self, file: InMemoryUploadedFile) -> dict:
        file_name = file.name
        file_size = file.size
        file_type = file.content_type

        try:
            pdf_reader = PyPDF2.PdfReader(file)
        except PyPDF2.errors.PdfReadError as e:
            raise e
        except Exception as e:
            raise e

        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()

        paragraphs = self.split_text_into_paragraphs(text)

        return {
            "file_name": file_name,
            "file_size": file_size,
            "file_type": file_type,
            "text": paragraphs,
        }

    def split_text_into_paragraphs(self, text: str):
        # Split by two or more newlines or a single newline
        paragraphs = re.split(r"\n{2,}|\n", text)
        # Remove empty strings and leading/trailing whitespace
        paragraphs = [p.strip() for p in paragraphs if p.strip()]
        return paragraphs


class ProjectResourcesListCreateView(ListCreateAPIView):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer

    def get_queryset(self):
        project_id = self.kwargs["pk"]
        project = get_object_or_404(Project, id=project_id, user=self.request.user)
        return project.resources.all()

    def perform_create(self, serializer):
        project_id = self.kwargs["pk"]
        project = get_object_or_404(Project, id=project_id, user=self.request.user)
        try:
            resource = get_object_or_404(
                Resource,
                text_source=serializer.validated_data["text_source"],
            )

            serializer.validated_data["embeddings"] = resource.embeddings
            serializer.validated_data["paragraphs"] = resource.paragraphs
            resource.projects.add(project)
        except:
            # except Resource.DoesNotExist:
            text = serializer.validated_data["text_source"]
            embedded_text = embedding.EmbeddingText(text)
            resource = serializer.save(
                user=self.request.user,
                embeddings=embedded_text.embeddings,
                paragraphs=embedded_text.paragraphs,
            )
            resource.projects.add(project)


class ResourceListCreateView(ListCreateAPIView):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):

        text = serializer.validated_data.pop("text_source")
        embedded_text = embedding.EmbeddingText(text)
        # Do something with the text field here
        serializer.save(
            user=self.request.user,
            text_source=text,
            embeddings=embedded_text.embeddings,
            paragraphs=embedded_text.paragraphs,
        )
