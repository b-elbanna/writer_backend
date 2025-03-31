from rest_framework import serializers
from .models import Resource


class ExtractPdfDataSerializer(serializers.ModelSerializer):
    file = serializers.FileField(allow_empty_file=False, required=True)

    def validate_file(self, value):
        if value.size > 1024 * 1024 * 5:  # 5MB
            raise serializers.ValidationError("File size exceeds 5MB")
        if value.content_type != "application/pdf":
            raise serializers.ValidationError("Only pdf files are allowed")
        return value

    class Meta:
        model = Resource
        fields = ["file", "created_at"]


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
            "chucks_number",
            "embeddings_number",
            "user",
            # "qaBoxes",
        ]

    # validation of the qabox id is exists

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
