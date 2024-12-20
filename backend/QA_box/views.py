import PyPDF2

import re
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import GenericAPIView, ListCreateAPIView, RetrieveAPIView
from .serializers import (
    QABoxSerializer,
    QASearchSerializer,
    ResourceSerializer,
    FilePdfSerializer,
)
from .models import QABox, Resource
from ai_utils import embedding
from search_utils import wiki
from .qa_utils import most_related_paragraphs
from rest_framework.parsers import FileUploadParser

from django.core.files.uploadedfile import InMemoryUploadedFile


class FileUploadView(GenericAPIView):
    # parser_classes = [FileUploadParser]
    serializer_class = FilePdfSerializer

    def post(self, request, format=None):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        file: InMemoryUploadedFile = serializer.validated_data["file"]
        file_name = file.name
        file_size = file.size
        file_type = file.content_type
        pdf_reader = PyPDF2.PdfReader(file)
        print(pdf_reader.metadata)
        print("###################")
        print(pdf_reader.outline)
        print("###################")
        print("###################")
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()

        paragraphs = re.split(r"\n{2,}|\n", text)

        # Remove any empty strings from the list
        paragraphs = list(filter(None, paragraphs))
        return Response(
            {
                "file_name": file_name,
                "file_size": file_size,
                "file_type": file_type,
                "text": paragraphs,
            },
            status=status.HTTP_201_CREATED,
        )


class ExtractPdfDataView(GenericAPIView):
    pass


class BoxResourceListCreateView(ListCreateAPIView):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer

    def get_queryset(self):
        qa_box_id = self.kwargs["pk"]
        qa_box = get_object_or_404(QABox, id=qa_box_id, user=self.request.user)
        return qa_box.resources.all()

    def perform_create(self, serializer):
        qa_box_id = self.kwargs["pk"]
        qa_box = get_object_or_404(QABox, id=qa_box_id, user=self.request.user)
        try:
            resource = Resource.objects.get(
                url=serializer.validated_data["url"],
                type=serializer.validated_data["type"],
            )

            serializer.validated_data["embeddings"] = resource.embeddings
            serializer.validated_data["paragraphs"] = resource.paragraphs
            resource.qaBoxes.add(qa_box)
            resource.projects.add(qa_box.project)
        except:
            # except Resource.DoesNotExist:
            text = serializer.validated_data["text_source"]
            embedded_text = embedding.EmbeddingText(text)
            resource = serializer.save(
                user=self.request.user,
                embeddings=embedded_text.embeddings,
                paragraphs=embedded_text.paragraphs,
            )
            resource.qaBoxes.add(qa_box)
            resource.projects.add(qa_box.project)


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
            embeddings=embedded_text.embeddings,
            paragraphs=embedded_text.paragraphs,
        )


class QABoxGetAnswerView(RetrieveAPIView):
    queryset = QABox.objects.all()

    # serializer_class = QABoxSerializer
    def get_serializer_class(self):

        if self.request.method == "POST":
            return QASearchSerializer
        else:
            return QABoxSerializer

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def post(self, request, *args, **kwargs):
        qa_box_id = self.kwargs["pk"]
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        query = serializer.validated_data["q"]
        qa_box = get_object_or_404(QABox, id=qa_box_id, user=self.request.user)
        resources = qa_box.resources.all()
        resources_embededchunks: list[embedding.EmbeddedChunk] = []
        for resource in resources:
            resources_embededchunks.extend(
                embedding.EmbeddingText(
                    embeddings=resource.embeddings,
                    paragraphs=resource.paragraphs,
                    resource_name=f"{resource.type}|{resource.name}",
                ).chunks
            )
        resualt = most_related_paragraphs(query, resources_embededchunks)
        answers = [
            (
                textRlatedness.paragraph,
                textRlatedness.relatednessScore,
                textRlatedness.resource_name,
            )
            for textRlatedness in resualt
        ]
        return Response(
            answers,
            status=status.HTTP_200_OK,
        )


class QABoxListCreateView(ListCreateAPIView):
    queryset = QABox.objects.all()
    serializer_class = QABoxSerializer

    def get_queryset(self):
        """
        Filter the queryset to QABoxes associated with the current user.
        """
        queryset = QABox.objects.filter(user=self.request.user)
        return queryset

    def perform_create(self, serializer):
        search_title = serializer.validated_data["name"]
        project = serializer.validated_data.get("project")
        page = None
        pageExist = None
        resource = None
        if project:
            search_title = project.title
        pageExist = wiki.search(search_title, "en")
        print("form views", pageExist)
        if pageExist:

            page = pageExist[0]

            resource = Resource.objects.filter(type="wiki", name=page.title).first()
            # create resource
            if not resource:
                embedded_page = embedding.EmbeddingText(" ".join(page.sections))
                resource = Resource.objects.create(
                    name=page.title,
                    embeddings=embedded_page.embeddings,
                    paragraphs=embedded_page.paragraphs,
                    url=page.url,
                    type="wiki",
                    user=self.request.user,
                )

        resource.projects.add(project)
        if resource:
            resource.qaBoxes.add(
                serializer.save(user=self.request.user, project=project)
            )
        else:
            serializer.save(user=self.request.user, project=project)
