from .models import Resource, QAMessage, QABox
from rest_framework import serializers


class QASearchSerializer(serializers.Serializer):
    q = serializers.CharField(max_length=80, trim_whitespace=True)


class ResourceSerializer(serializers.ModelSerializer):
    name = serializers.CharField(max_length=50, required=True, trim_whitespace=True)
    username = serializers.CharField(source="user.username", read_only=True)
    chucks_number = serializers.SerializerMethodField()
    embeddings_number = serializers.SerializerMethodField()
    text_source = serializers.CharField(
        min_length=3,
        max_length=10000,
        required=True,
        write_only=True,
        trim_whitespace=True,
    )

    class Meta:
        model = Resource
        fields = [
            "chucks_number",
            "embeddings_number",
            "id",
            "text_source",
            "url",
            "username",
            # "qaBoxes",
            "name",
            "type",
            "created_at",
        ]
        # fields = "__all__"
        read_only_fields = [
            "user",
            # "qaBoxes",
        ]

    def get_chucks_number(self, obj):
        try:
            return len(obj.get("paragraphs"))
        except:
            return len(obj.paragraphs)

    def get_embeddings_number(self, obj):
        try:
            return len(obj.get("embeddings"))
        except:
            return len(obj.embeddings)


class QAMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = QAMessage
        fields = "__all__"
        read_only_fields = ["user", "qaBox", "answer"]


class QABoxSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.username", read_only=True)
    project_name = serializers.CharField(source="project.name", read_only=True)
    resources = ResourceSerializer(many=True, read_only=True)

    def validate_project(self, value):
        request = self.context["request"]
        if value and (value.user != request.user):
            raise serializers.ValidationError(
                f'Invalid pk "{value.id}" - object does not exist.'
            )
        return value

    class Meta:
        model = QABox
        fields = [
            "id",
            "name",
            "resources",
            "user_name",
            "project_name",
            "project",
            "created_at",
        ]
        read_only_fields = ["user"]
