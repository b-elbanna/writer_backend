import json
from rest_framework.generics import (
    GenericAPIView,
    CreateAPIView,
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
)
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from openai.types import Completion
from ai_utils import (
    text_completion,
    text_improvement,
    create_outline,
    suggest_descriptions,
)
from ai_utils.embedding import sort_by_relatedness, EmbeddingText
from QA_box.models import QABox, Resource
from search_utils import wiki
from ai_chat.models import ChatBox
from .pricing import calc_credits
from .models import (
    Project,
    TextCompletion,
    TextImprovement,
)
from .serializers import (
    TextImprovementSerializer,
    TextCompletionSerializer,
    ProjectListCreateSerializer,
    ProjectRetrieveUpdateDestroySerializer,
    ArticleOutlineSerializer,
    GetArticleDescriptionSerializer,
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


class GetArticleDescriptionView(GenericAPIView):
    serializer_class = GetArticleDescriptionSerializer

    def get_queryset(self):
        return None

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated_data: dict = serializer.validated_data
        title = validated_data.get("title")
        description = (
            suggest_descriptions(article_title=title).choices[0].message.content
        )
        description = json.loads(description)
        # description = description["descriptions"]
        return Response(
            description,
            status=status.HTTP_200_OK,
        )


class ArticleOutlineView(GenericAPIView):
    serializer_class = ArticleOutlineSerializer

    def get_queryset(self):
        return None

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated_data: dict = serializer.validated_data
        title = validated_data.get("title")
        description = validated_data.get("description")
        outline = (
            create_outline(article_title=title, descriptions=description)
            .choices[0]
            .message.content
        )
        outline = json.loads(outline)
        # outline.get("outline")
        return Response(
            outline,
            status=status.HTTP_200_OK,
        )


class TextCompletionView(CreateAPIView):
    serializer_class = TextCompletionSerializer

    def get_queryset(self):
        return TextCompletion.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data
        user_project: Project = validated_data.get("project")

        res: Completion = text_completion(
            max_tokens=10,
            title=user_project and user_project.title,
            description=user_project and user_project.description,
            lang=user_project and user_project.lang,
            text=validated_data["original_text"],
        )
        completion_text = res.choices[0].message.content
        n_gen_tokens = res.usage.completion_tokens
        n_prompt_tokens = res.usage.prompt_tokens
        # claculate credits usage
        used_credits = calc_credits("completion", res.usage.total_tokens)
        self.request.user.user_credits -= used_credits
        self.request.user.save()
        if user_project:
            user_project.used_credits += used_credits
            user_project.save()
        serializer.save(
            user=self.request.user,
            completion_text=completion_text,
            used_credits=used_credits,
            n_gen_tokens=n_gen_tokens,
            n_prompt_tokens=n_prompt_tokens,
            project=user_project,
        )
        headers = self.get_success_headers(serializer.data)
        return Response(
            {"completion_text": completion_text, "used_credits": used_credits},
            status=status.HTTP_201_CREATED,
            headers=headers,
        )


class TextImprovementView(CreateAPIView):
    """
    return text after improving it
    """

    serializer_class = TextImprovementSerializer

    def get_queryset(self):
        return TextImprovement.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data
        user_project = None
        try:
            user_project = Project.objects.get(
                user=self.request.user, id=validated_data["project"].id
            )
        except Project.DoesNotExist:
            return Response(
                {"detail": "Project not found."}, status=status.HTTP_404_NOT_FOUND
            )
        res: Completion = text_improvement(
            text=validated_data["original_text"],
        )
        improved_text = res.choices[0].message.content
        n_tokens = res.usage.total_tokens
        used_credits = calc_credits("improvement", n_tokens)
        headers = self.get_success_headers(validated_data)

        serializer.save(
            user=self.request.user,
            improved_text=improved_text,
            used_credits=used_credits,
            n_tokens=n_tokens,
            project=user_project,
        )
        return Response(
            {"improved_text": improved_text, "used_credits": used_credits},
            status=status.HTTP_201_CREATED,
            headers=headers,
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

        article_temp: list = [
            {
                "id": "1",
                "type": "h1",
                "children": [{"text": serializer.validated_data["title"]}],
            },
            {"id": "2", "type": "p", "children": [{"text": ""}]},
        ]
        for heading in outline:
            article_temp.append(
                {"id": heading[-4:], "type": "h2", "children": [{"text": heading}]}
            )
            article_temp.append(
                {"id": heading[-3:], "type": "p", "children": [{"text": "..."}]}
            )

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
        # if QABox.objects.filter(user=self.request.user, name=name).exists():
        #     return Response(
        #         {"detail": "QABox with the same name already exists."},
        #         status=status.HTTP_400_BAD_REQUEST,
        #     )
        # # Create ChatBox for the project
        # qabox = QABox.objects.create(
        #     user=self.request.user,
        #     name=name,
        # )
        # serializer.save(
        #     user=self.request.user,
        #     chatbox=chatbox,
        #     article=article_temp,
        # ).qaBox = qabox
        ########################################

        print("saved")

        serializer.save(
            user=self.request.user,
            chatbox=chatbox,
            article=article_temp,
        )

        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )
