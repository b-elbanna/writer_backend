from rest_framework.generics import (
    GenericAPIView,
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
)
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status

from ai_utils.embedding import sort_by_relatedness
from QA_box.models import QABox
from search_utils import wiki
from ai_chat.models import ChatBox
from .pricing import calc_credits
from .models import (
    Project,
)
from .serializers import (
    ProjectListCreateSerializer,
    ProjectRetrieveUpdateDestroySerializer,
    SortByRelatednessSerializer,
)


class SortByRelatednessView(GenericAPIView):
    serializer_class = SortByRelatednessSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return None

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated_data: dict = serializer.validated_data
        query = validated_data.get("query")
        data_array = validated_data.get("data_array")
        strings_and_relatednesses = sort_by_relatedness(query=query, array=data_array)
        return Response(
            strings_and_relatednesses,
            status=status.HTTP_200_OK,
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
        serializer.is_valid(raise_exception=True)

        title = serializer.validated_data["title"]
        name = serializer.validated_data["name"]
        lang = serializer.validated_data["lang"]
        outline: list[str] = serializer.validated_data["outline"]
        description: list[str] = serializer.validated_data["description"]
        print(title, name, outline, description)

        if Project.objects.filter(user=self.request.user, name=name).exists():
            return Response(
                {"detail": "Project with the same name already exists."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # check if there is an chatbox with the same name
        if ChatBox.objects.filter(user=self.request.user, name=name).exists():
            return Response(
                {"detail": "Chatbox with the same name already exists."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        # Create ChatBox for the project
        chatbox = ChatBox.objects.create(
            user=self.request.user,
            name=name,
            sys_message=f"you are researcher assistant and the research topic is {title}.",
        )
        ################creating qabox################
        if QABox.objects.filter(user=self.request.user, name=name).exists():
            return Response(
                {"detail": "QABox with the same name already exists."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        # Create ChatBox for the project
        project = serializer.save(
            user=self.request.user,
            chatbox=chatbox,
            article=outline,
        )
        QABox.objects.create(
            user=self.request.user,
            name=name,
            project=project,
        )

        ########################################

        print("saved")

        serializer.save()

        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )
