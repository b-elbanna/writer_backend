from rest_framework.generics import (
    GenericAPIView,
    CreateAPIView,
)
from rest_framework.response import Response

from .pricing import calc_credits
from .models import (
    Project,
    TextCompletion,
    TextImprovement,
)
from .serializers import (
    TextImprovementSerializer,
    TextCompletionSerializer,
    ArticleOutlineSerializer,
    GetArticleDescriptionSerializer,
)
from ai_utils.generation_model import GenerationModel


class GetArticleDescriptionView(GenericAPIView):
    serializer_class = GetArticleDescriptionSerializer

    def get_queryset(self):
        return None

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated_data: dict = serializer.validated_data
        title = validated_data.get("title")

        descriptions = GenerationModel().suggest_descriptions(article_title=title)
        # description = description["descriptions"]
        return Response(
            descriptions["descriptions"],
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
        # res = create_outline(article_title=title, descriptions=description)
        outline_res = GenerationModel().genereate_article_outline(
            article_title=title, description=description
        )
        # outline = json.loads(outline)

        # print token numers

        return Response(
            outline_res["text"],
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

        res = GenerationModel().text_completion(
            # max_tokens=10,
            article_title=user_project and user_project.title,
            text=validated_data["original_text"],
        )
        completion_text = res["text"]
        n_gen_tokens = res["completion_tokens"]
        n_prompt_tokens = res["prompt_tokens"]
        # claculate credits usage
        used_credits = calc_credits("completion", res["total_tokens"])
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
        res = GenerationModel().text_improvement(
            text=validated_data["original_text"],
        )
        improved_text = res["text"]
        n_tokens = res["total_tokens"]
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
