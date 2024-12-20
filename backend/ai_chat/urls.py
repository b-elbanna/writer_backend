from .views import (
    ChatBoxListCreateView,
    ChatBoxRetrieveDestroyView,
    ChatMessageListCreateView,
    FileUploadView,
)


from django.urls import path

urlpatterns = [
    # path("", ChatView.as_view()),
    path("messages/<uuid:chatbox_id>", ChatMessageListCreateView.as_view()),
    path("chatbox/<uuid:pk>", ChatBoxRetrieveDestroyView.as_view()),
    path("chatboxes", ChatBoxListCreateView.as_view()),
    path("voice", FileUploadView.as_view()),
]
