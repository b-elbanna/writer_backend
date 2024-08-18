import json
from rest_framework.generics import (
    GenericAPIView,
    CreateAPIView,
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
)
from rest_framework.response import Response
from rest_framework import status
from openai.types import Completion
from ai_utils import (
    text_completion,
    text_improvement,
    create_outline,
    suggest_descriptions,
)
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
        user_project = None
        try:
            user_project = Project.objects.get(
                user=self.request.user, id=validated_data["project"]
            )
        except Project.DoesNotExist:
            return Response(
                {"detail": "Project not found."}, status=status.HTTP_404_NOT_FOUND
            )
        res: Completion = text_completion(
            title=user_project.title,
            description=user_project.description,
            sentence=validated_data["is_sentence"],
            lang=validated_data["lang"],
            text=validated_data["original_text"],
        )

        completion_text = res.choices[0].text
        n_tokens = res.usage.total_tokens
        used_credits = calc_credits("completion", n_tokens)
        headers = self.get_success_headers(serializer.data)

        serializer.save(
            user=self.request.user,
            completion_text=completion_text,
            used_credits=used_credits,
            n_tokens=n_tokens,
            project=user_project,
            is_sentence=validated_data["is_sentence"],
        )
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

    def perform_create(self, serializer):
        #      "lang",
        #     "title",
        #     "name",
        #     "chatbox",
        #     "description",
        #     "outline",
        title = self.request.data["title"]
        name = self.request.data["name"]
        outline: list[str] = self.request.data["outline"]
        article_temp: list = [
            {
                "type": "heading-one",
                "children": [{"text": serializer.validated_data["title"]}],
            },
            {"type": "paragraph", "children": [{"text": ""}]},
        ]
        for heading in outline:
            article_temp.append(
                {"type": "heading-two", "children": [{"text": heading}]}
            )
            article_temp.append({"type": "paragraph", "children": [{"text": "..."}]})
            article_temp.append({"type": "paragraph", "children": [{"text": ""}]})
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
        serializer.save(
            user=self.request.user, chatbox=chatbox, article=json.dumps(article_temp)
        )
        return Response(serializer.data, status=status.HTTP_201_CREATED)
