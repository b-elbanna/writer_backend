from django.shortcuts import render, get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import ListCreateAPIView, RetrieveAPIView
from .serializers import QABoxSerializer, QASearchSerializer, ResourceSerializer
from .models import QABox, Resource
from ai_utils import wiki, embedding
from .qa_utils import most_related_paragraphs
from rest_framework import exceptions


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
        text = serializer.validated_data["text_source"]
        embedded_text = embedding.EmbeddingText(text)
        # Resource.
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

        text = serializer.validated_data.pop("text")
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
        qa_box = QABox.objects.get(id=qa_box_id)
        resources = qa_box.resources.all()
        resources_embededchunks: list[embedding.EmbeddedChunk] = []
        for resource in resources:
            resources_embededchunks.extend(
                embedding.EmbeddingText(
                    embeddings=resource.embeddings, paragraphs=resource.paragraphs
                ).chunks
            )
        resualt = most_related_paragraphs(query, resources_embededchunks)
        answers = [
            (textRlatedness.paragraph, textRlatedness.relatednessScore)
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
        page = wiki.search(search_title, "en")[0]
        # # get wiki page content
        embedded_page = embedding.EmbeddingText(" ".join(page.sections))
        # sections = page.sections
        project = serializer.validated_data.get("project")
        # create resource
        resource = Resource.objects.create(
            name=page.title,
            embeddings=embedded_page.embeddings,
            paragraphs=embedded_page.paragraphs,
            source=page.url,
            type="wiki",
            user=self.request.user,
        )
        if project:
            print(project)
            resource.projects.add(project)
        serializer.save(user=self.request.user).resources.add(resource)
