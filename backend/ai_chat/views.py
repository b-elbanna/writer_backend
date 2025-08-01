from django.views.generic import TemplateView
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.shortcuts import get_object_or_404

from .serializers import ChatBoxSerializer, ChatMessageSerializer
from .models import ChatBox
from .Paginations import CustomPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveDestroyAPIView,
)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ai_chat.utils import prepare_chatbox_messages
from ai_utils.generation_model import GenerationModel

from django.core.files.uploadedfile import InMemoryUploadedFile


@method_decorator(csrf_exempt, name="dispatch")
class FileUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        file: InMemoryUploadedFile = request.FILES.get("file", None)
        print(file)
        if file:
            try:
                file.name = file.name + ".webm"
                res = GenerationModel().audio_transcription(file)

            except Exception as e:
                return Response(
                    {"error": str(e)},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

            return Response(
                {
                    "content": res["text"],
                    "size": file.size,
                },
                status=status.HTTP_202_ACCEPTED,
            )

        else:
            return Response(
                {"error": "something wrong"},
                status=status.HTTP_400_BAD_REQUEST,
            )


# Create your views here.
class ChatView(TemplateView):
    template_name = "chatv1/indexws.html"


class ChatBoxListCreateView(ListCreateAPIView):
    serializer_class = ChatBoxSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        queryset = ChatBox.objects.filter(user=self.request.user)
        return queryset


class ChatBoxRetrieveDestroyView(RetrieveDestroyAPIView):
    serializer_class = ChatBoxSerializer

    def get_queryset(self):
        queryset = ChatBox.objects.filter(user=self.request.user)
        return queryset


class ChatMessageListCreateView(ListCreateAPIView):
    serializer_class = ChatMessageSerializer
    pagination_class = CustomPagination

    def perform_create(self, serializer):
        chatbox_id = self.kwargs["chatbox_id"]
        user_msg = serializer.validated_data["user_msg"]
        messages = prepare_chatbox_messages(chatbox_id, user_msg)
        res = GenerationModel().chat_completion(messages=messages)
        assistant_msg = res["text"]

        serializer.save(
            user=self.request.user, chatbox_id=chatbox_id, assistant_msg=assistant_msg
        )

    def get_queryset(self):
        user = self.request.user
        chatbox_id = self.kwargs["chatbox_id"]

        queryset = get_object_or_404(ChatBox, id=chatbox_id, user=user).messages.all()

        return queryset


# all messages view
