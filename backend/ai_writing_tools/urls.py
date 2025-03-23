from django.urls import path
from .views import (
    ProjectListCreateView,
    ProjectRetrieveUpdateDestroyView,
    SortByRelatednessView,
)
from .draw_views import (
    ExcalidrawRetrieveUpdateDestroyView,
    ExcalidrawListCreateView,
)
from .tools_views import (
    TextImprovementView,
    TextCompletionView,
    ArticleOutlineView,
    GetArticleDescriptionView,
)

urlpatterns = [
    # text improvement services
    path(
        "sort-by-relatedness",
        SortByRelatednessView.as_view(),
        name="sort_by_relatedness",
    ),
    path("tools/article-outline", ArticleOutlineView.as_view(), name="article_outline"),
    path(
        "tools/article-description",
        GetArticleDescriptionView.as_view(),
        name="article_description",
    ),
    path("tools/improvement", TextImprovementView.as_view(), name="improvement"),
    path("tools/completion", TextCompletionView.as_view(), name="completion"),
    # projects or articles
    path("projects", ProjectListCreateView.as_view(), name="projects"),
    path("project/<pk>", ProjectRetrieveUpdateDestroyView.as_view(), name="project"),
    # excalidraws
    path("excalidraws", ExcalidrawListCreateView.as_view(), name="excalidraws"),
    path(
        "excalidraw/<pk>",
        ExcalidrawRetrieveUpdateDestroyView.as_view(),
        name="excalidraw",
    ),
]
