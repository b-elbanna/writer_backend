from rest_framework import serializers
from .models import (
    Project,
    TextImprovement,
    TextCompletion,
)


class SortByRelatednessSerializer(serializers.Serializer):
    query = serializers.CharField(max_length=255)
    # language = serializers.CharField(max_length=2)
    data_array = serializers.ListField(
        child=serializers.CharField(max_length=255),
        allow_empty=False,
        min_length=2,
        max_length=50,
    )


class GetArticleDescriptionSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=50, trim_whitespace=True, required=True)


class ArticleOutlineSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=50, trim_whitespace=True, required=True)
    description = serializers.CharField(required=False)


class TextCompletionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TextCompletion
        read_only_fields = ("id", "user", "used_credits")
        fields = (
            "original_text",
            "project",
        )


class TextImprovementSerializer(serializers.ModelSerializer):

    class Meta:
        model = TextImprovement
        fields = "__all__"
        read_only_fields = (
            "id",
            "user",
            "chatbox",
            "used_credits",
            "improved_text",
            "n_tokens",
        )


class ProjectListCreateSerializer(serializers.ModelSerializer):
    lang = serializers.ChoiceField(choices=[("en", "English"), ("ar", "Arabic")])
    used_credits = serializers.IntegerField(read_only=True)
    user_name = serializers.CharField(source="user.username", read_only=True)
    outline = serializers.JSONField()

    class Meta:
        model = Project

        read_only_fields = (
            "id",
            "user",
            "article",
            "article_text",
            "chatbox",
            "used_credits",
        )
        fields = (
            "id",
            "lang",
            "title",
            "name",
            "chatbox",
            "description",
            "article",
            "article_text",
            "outline",
            "used_credits",
            "user_name",
            "created_at",
            "modified_at",
        )

    # def validate_name(self, value):
    #     user = self.context["request"].user
    #     print(user)

    #     if Project.objects.filter(user=user, name=value).exists():
    #         raise serializers.ValidationError(
    #             "You already have a project with this name."
    #         )
    #     return value


class ProjectRetrieveUpdateDestroySerializer(serializers.ModelSerializer):
    lang = serializers.CharField(read_only=True)
    title = serializers.CharField(read_only=True)
    name = serializers.CharField(read_only=True)
    user_name = serializers.CharField(source="user.username", read_only=True)
    used_credits = serializers.IntegerField(read_only=True)

    class Meta:
        model = Project
        fields = (
            "id",
            "lang",
            "title",
            "name",
            "chatbox",
            "article_text",
            "article",
            "description",
            "outline",
            "used_credits",
            "user_name",
            "created_at",
            "modified_at",
        )
