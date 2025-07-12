from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
)


# from .pricing import calc_credits
from ..models import (
    Excalidraw,
)
from ..serializers import (
    ExcalidrawListCreateSerializer,
    ExcalidrawRetrieveUpdateDestroySerializer,
)


class ExcalidrawListCreateView(ListCreateAPIView):
    serializer_class = ExcalidrawListCreateSerializer

    def get_queryset(self):
        """
        Filter the queryset to QABoxes associated with the current user.
        """
        project_id = self.kwargs["project_pk"]
        queryset = Excalidraw.objects.filter(
            user=self.request.user, project_id=project_id
        )
        return queryset

    def perform_create(self, serializer):
        project_id = self.kwargs["project_pk"]
        serializer.save(user=self.request.user, project_id=project_id)


class ExcalidrawRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    serializer_class = ExcalidrawRetrieveUpdateDestroySerializer

    def get_queryset(self):
        """
        Filter the queryset to QABoxes associated with the current user.
        """
        queryset = Excalidraw.objects.filter(user=self.request.user)
        return queryset
