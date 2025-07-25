from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static
from .views import GetApiEndPointsView

admin.site.site_header = "AI_WRiteR"  # default: "Django Administration"
admin.site.index_title = (
    "AI_WRiteR Site administration"  # default: "Site administration"
)
admin.site.site_title = "AI_WRiteR admin"  # default: "Django site admin"

urlpatterns = [
    path("", TemplateView.as_view(template_name="ai_chat/indexws.html")),
    path("admin/", admin.site.urls),
    path("api/v1", GetApiEndPointsView.as_view()),
    path("api/v1/auth/", include("accounts.urls")),
    path("api/v1/chat/", include("ai_chat.urls")),
    path("api/v1/writing/", include("ai_writing_tools.urls")),
    path("api/v1/qa/", include("QA_box.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
