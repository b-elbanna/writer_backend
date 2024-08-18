from .views import (
    ChatBoxListCreateView,
    ChatBoxRetrieveDestroyView,
    ChatMessageListCreateView,
    FileUploadView,
)



from django.urls import path, include
urlpatterns = [
    # path("", ChatView.as_view()),
    path("messages/<chatbox_id>", ChatMessageListCreateView.as_view()),
    path("chatbox/<pk>", ChatBoxRetrieveDestroyView.as_view()),
    path("chatboxes", ChatBoxListCreateView.as_view()),
    path("voice", FileUploadView.as_view()),

]
