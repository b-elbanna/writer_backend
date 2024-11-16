from .models import Resource, QAMessage, QABox
from rest_framework import serializers


class FilePdfSerializer(serializers.Serializer):
    file = serializers.FileField(allow_empty_file=False, required=True)

    def validate_file(self, value):
        if value.size > 1024 * 1024 * 5:  # 5MB
            raise serializers.ValidationError("File size exceeds 5MB")
        if value.content_type != "application/pdf":
            raise serializers.ValidationError("Only pdf files are allowed")
        return value


class QASearchSerializer(serializers.Serializer):
    q = serializers.CharField(max_length=80, trim_whitespace=True)


class ResourceSerializer(serializers.ModelSerializer):
    name = serializers.CharField(max_length=50, required=True, trim_whitespace=True)
    username = serializers.CharField(source="user.username", read_only=True)
    chucks_number = serializers.SerializerMethodField()
    embeddings_number = serializers.SerializerMethodField()
    text_source = serializers.CharField(
        min_length=3,
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
            "name",
            "type",
            "created_at",
        ]
        # fields = "__all__"
        read_only_fields = [
            "user",
            # "qaBoxes",
        ]

    # validation of the qabox id is exists
    def validate_qa_box_id(self, value):
        request = self.context["request"]
        try:
            QABox.objects.get(id=value, user=request.user)
        except:
            raise serializers.ValidationError(
                f'Invalid pk "{value}" - QABox does not exist.'
            )
        return value

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
