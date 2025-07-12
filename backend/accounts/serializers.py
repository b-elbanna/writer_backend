from rest_framework import serializers
from .models import CustomUser
from dj_rest_auth.registration.serializers import RegisterSerializer
from django.contrib.auth import get_user_model
from dj_rest_auth.serializers import UserDetailsSerializer
from ai_utils.gemini_model import GeminiModel

# from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


# class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
#     def validate(self, attrs):
#         data = super().validate(attrs)

#         # refresh = self.get_token(self.user)

#         data["is_staff"] = str(self.user.is_staff)
#         # data["access"] = str(refresh.access_token)

#         return data


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = "__all__"


class MyRegisterSerializer(RegisterSerializer):
    password2 = None
    password = serializers.CharField(write_only=True)
    password1 = password
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    email = serializers.EmailField(required=True, allow_blank=False)
    google_api_key = serializers.CharField(required=True, allow_blank=False)

    def validate_google_api_key(self, google_api_key):

        if not google_api_key:
            raise serializers.ValidationError("Google API key is required.")
        try:
            GeminiModel(api_key=google_api_key).text_embedding("test")
        except Exception as e:
            raise serializers.ValidationError(f"Invalid Google API key: {e}")
        return google_api_key

    def get_cleaned_data(self):
        data = super().get_cleaned_data()
        data["first_name"] = self.validated_data.get("first_name", "")
        data["last_name"] = self.validated_data.get("last_name", "")
        return data
        # make email unique and required

    def save(self, request):
        user = super().save(request)
        user.google_api_key = self.validated_data.get("google_api_key", "")
        user.save()
        return user

    def validate_email(self, email):
        if get_user_model().objects.filter(email=email).exists():
            raise serializers.ValidationError("Email already exists.")
        return email

    def validate(self, data):
        return data


class MyUserDetailsSerializer(UserDetailsSerializer):
    """
    User model w/o password
    """

    class Meta:
        model = get_user_model()
        extra_fields = []

        extra_fields.append(model.USERNAME_FIELD)
        extra_fields.append(model.EMAIL_FIELD)
        extra_fields.append("first_name")
        extra_fields.append("last_name")
        extra_fields.append("user_credits")
        extra_fields.append("google_api_key")
        extra_fields.append("is_staff")
        fields = ("pk", *extra_fields)
        read_only_fields = ("email", "is_staff", "user_credits", "google_api_key")
