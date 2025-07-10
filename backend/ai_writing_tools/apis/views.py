from rest_framework.generics import (
    GenericAPIView,
    CreateAPIView,
)
from rest_framework.request import Request
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import (
    Project,
    TextCompletion,
    TextImprovement,
)
from ..serializers import (
    TextImprovementSerializer,
    TextCompletionSerializer,
    ArticleOutlineSerializer,
    GetArticleDescriptionSerializer,
)
from ai_utils.generation_model import GenerationModel

from ..pricing import Credit, Operation


class GetArticleDescriptionView(APIView):
    """
    API view to suggest article descriptions based on a given article title.
    """

    serializer_class = GetArticleDescriptionSerializer

    def post(self, request: Request) -> Response:
        """
        Handles POST requests to generate article descriptions.

        Expects 'title' in the request data.
        Returns a list of suggested descriptions or an error response.
        """
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data
        title = validated_data.get("title", "")

        try:

            model = GenerationModel()
            suggested_content = model.suggest_descriptions(article_title=title)

            if not isinstance(suggested_content, dict):

                return Response(
                    {
                        "error": "Received an unexpected data structure from the generation model."
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

            descriptions_list = suggested_content.get("descriptions")

            if descriptions_list is None:

                return Response(
                    {
                        "error": "Failed to retrieve descriptions from the generation model's output."
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
            # decrease user creadits
            request.user.user_credits -= suggested_content.get(
                "total_tokens"
            )  # ~500 credit
            request.user.save()

            return Response(descriptions_list, status=status.HTTP_200_OK)
        except Exception as e:

            return Response(
                {
                    "error": f"An unexpected error occurred while generating descriptions .{e}"
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class ArticleOutlineView(APIView):
    """
    API view to generate an article outline based on a title and description.
    """

    serializer_class = ArticleOutlineSerializer

    def post(self, request: Request) -> Response:
        """
        Handles POST requests to generate an article outline.

        Expects 'title' and optionally 'description' in the request data.
        Returns the generated outline text or an error response.
        """
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data
        title = validated_data.get("title", "")
        description = validated_data.get("description", "")

        try:
            # Consider optimizing GenerationModel instantiation if it's resource-intensive
            model = GenerationModel()
            outline_res = model.genereate_article_outline(
                article_title=title, description=description
            )

            # Check if the response is a dictionary and contains the 'text' key
            if not isinstance(outline_res, dict) or "text" not in outline_res:
                # logger.error(f"GenerationModel returned unexpected structure for outline (title: '{title}'): {outline_res}")
                return Response(
                    {
                        "error": "Received an unexpected data structure from the generation model."
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

            outline_text = outline_res.get("text")
            total_tokens = outline_res.get("total_tokens", 0)

            if outline_text is None:
                # logger.warning(f"'text' key missing or None in GenerationModel response for outline (title: '{title}').")
                return Response(
                    {
                        "error": "Failed to retrieve outline text from the generation model's output."
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

            # Decrease user credits based on token usage
            if total_tokens > 0:
                # Determine the correct operation type for outline generation
                # Assuming 'chat' or a new 'outline' type is appropriate
                # You might need to define a specific operation type in pricing.py
                used_credits = Credit.calc(
                    Operation.chat, total_tokens
                )  # Or Operation.outline if added
                if request.user.user_credits < used_credits:
                    return Response(
                        {"error": "Insufficient credits."},
                        status=status.HTTP_402_PAYMENT_REQUIRED,
                    )
                request.user.user_credits -= used_credits
                request.user.save()
                # Consider logging credit usage
                # logger.info(f"User {request.user.id} used {used_credits} credits for outline generation (title: '{title}', tokens: {total_tokens})")

            return Response(
                outline_text,
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            # Log the exception for debugging purposes.
            # logger.error(f"Error during outline generation for title '{title}': {e}", exc_info=True)
            return Response(
                {
                    "error": f"An unexpected error occurred while generating the outline. {e}"
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


# class ArticleOutlineView(APIView):
#     serializer_class = ArticleOutlineSerializer

#     def post(self, request):
#         serializer = self.serializer_class(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         validated_data = serializer.validated_data
#         title = validated_data.get("title", "")
#         description = validated_data.get("description", "")
#         # res = create_outline(article_title=title, descriptions=description)
#         outline_res = GenerationModel().genereate_article_outline(
#             article_title=title, description=description
#         )
#         # outline = json.loads(outline)

#         # print token numers

#         return Response(
#             outline_res["text"],
#             status=status.HTTP_200_OK,
#         )
