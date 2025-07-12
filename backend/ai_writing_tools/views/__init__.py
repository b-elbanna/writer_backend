# from .views import (
#     ProjectListCreateView,
#     ProjectRetrieveUpdateDestroyView,
#     SortByRelatednessView,
# )
# from .views.draw_views import (
#     ExcalidrawRetrieveUpdateDestroyView,
#     ExcalidrawListCreateView,
# )
# from .views.ai_views import (
#     TextImprovementView,
#     TextCompletionView,
#     ArticleOutlineView,
# )
# from .apis.views import GetArticleDescriptionView
from .ai_views import (
    TextImprovementView,
    TextCompletionView,
    ArticleOutlineView,
    GetArticleDescriptionView,
    SortByRelatednessView,
)
from .draw_views import (
    ExcalidrawRetrieveUpdateDestroyView,
    ExcalidrawListCreateView,
)
from .project_views import (
    ProjectListCreateView,
    ProjectRetrieveUpdateDestroyView,
)
