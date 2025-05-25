from rest_framework import serializers
from .models import CustomUser
from dj_rest_auth.registration.serializers import RegisterSerializer
from django.contrib.auth import get_user_model
from dj_rest_auth.serializers import UserDetailsSerializer

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

    def get_cleaned_data(self):
        data = super().get_cleaned_data()
        data["first_name"] = self.validated_data.get("first_name", "")
        data["last_name"] = self.validated_data.get("last_name", "")
        return data
        # make email unique and required

    def validate_email(self, value):
        if get_user_model().objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists.")
        return value

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
        extra_fields.append("is_staff")
        fields = ("pk", *extra_fields)
        read_only_fields = ("email", "is_staff", "user_credits")
