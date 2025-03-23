import json
from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
)


# from .pricing import calc_credits
from .models import (
    Excalidraw,
)
from .serializers import (
    ExcalidrawListCreateSerializer,
    ExcalidrawRetrieveUpdateDestroySerializer,
)


class ExcalidrawListCreateView(ListCreateAPIView):
    serializer_class = ExcalidrawListCreateSerializer

    def get_queryset(self):
        """
        Filter the queryset to QABoxes associated with the current user.
        """
        queryset = Excalidraw.objects.filter(user=self.request.user)
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ExcalidrawRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    serializer_class = ExcalidrawRetrieveUpdateDestroySerializer

    def get_queryset(self):
        """
        Filter the queryset to QABoxes associated with the current user.
        """
        queryset = Excalidraw.objects.filter(user=self.request.user)
        return queryset
