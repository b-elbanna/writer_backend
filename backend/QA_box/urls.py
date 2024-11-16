from django.urls import path

from . import views

urlpatterns = [
    path("pdf-extract-data", views.FileUploadView.as_view(), name="qa_boxes"),
    path("qa-boxes", views.QABoxListCreateView.as_view(), name="qa_boxes"),
    path("qa-box/<pk>", views.QABoxGetAnswerView.as_view(), name="qa_box"),
    path(
        "qa-box/<uuid:pk>/resources",
        views.BoxResourceListCreateView.as_view(),
        name="qa_box_resources",
    ),
    path("resources", views.ResourceListCreateView.as_view(), name="resources"),
]
