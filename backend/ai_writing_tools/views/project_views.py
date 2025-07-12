from rest_framework.generics import (
    GenericAPIView,
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
)
from django.db import IntegrityError
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status

from ai_utils.embedding import sort_by_relatedness
from QA_box.models import QABox
from search_utils import wiki
from ai_chat.models import ChatBox
from ..models import Project, Excalidraw
from ..serializers import (
    Project,
    ProjectListCreateSerializer,
    ProjectRetrieveUpdateDestroySerializer,
)


class ProjectRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    serializer_class = ProjectRetrieveUpdateDestroySerializer

    def get_queryset(self):
        return self.request.user.projects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ProjectListCreateView(ListCreateAPIView):
    serializer_class = ProjectListCreateSerializer

    def get_queryset(self):
        return self.request.user.projects.all()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            title = serializer.validated_data["title"]
            name = serializer.validated_data["name"]
            outline: list[str] = serializer.validated_data.get("outline") or [
                {
                    "children": [{"text": title}],
                    "type": "h1",
                    "id": "v6ZaUELli_",
                }
            ]
            article_text = serializer.validated_data.get("article_text") or title
            # Create ChatBox for the project
            chatbox = ChatBox.objects.create(
                user=self.request.user,
                name=name,
                sys_message=f"you are researcher assistant and the research topic is {title}.",
            )
            project = serializer.save(
                user=self.request.user,
                chatbox=chatbox,
                article=outline,
                article_text=article_text,
            )
            Excalidraw.objects.create(
                user=self.request.user,
                name=name,
                project=project,
            )
            QABox.objects.create(
                user=self.request.user,
                name=name,
                project=project,
            )
            headers = self.get_success_headers(serializer.data)
            return Response(
                serializer.data, status=status.HTTP_201_CREATED, headers=headers
            )
        except IntegrityError:
            return Response(
                {"detail": "A project with this name already exists."},
                status=status.HTTP_400_BAD_REQUEST,
            )
