from typing import List, Dict, TypedDict, Generator
from abc import ABC, abstractmethod
from openai import OpenAI
from google import genai
from django.core.files.uploadedfile import InMemoryUploadedFile


class ChatCompletionResponse(TypedDict):
    """Type definition for the chat completion response."""

    finish_reason: str
    model: str
    text: str
    prompt_tokens: int
    completion_tokens: int
    total_tokens: int


class TextEmbeddingResponse(TypedDict):

    model: str
    embedding: List[float]
    total_tokens: int


class SuggestDescriptionsResponse(TypedDict):

    model: str
    descriptions: List[str]
    total_tokens: int


class BaseGenerationModel(ABC):
    """Abstract base class for AI models."""

    api_key: str
    default_model: str
    client_class: type[genai.Client | OpenAI]
    available_models: List[str]
    audio_transcription_model: str
    client: genai.Client | OpenAI

    def __init__(self, model=None, api_key=None):
        self.model = model or self.default_model
        if self.model not in self.available_models:
            raise ValueError(
                f"Invalid model name: {self.model}. Choose from: {self.available_models}"
            )
        self.client = self.client_class(api_key=self.api_key)

    @abstractmethod
    def chat_completion(
        self, messages: List[Dict[str, str]], system_message: str = None
    ) -> ChatCompletionResponse:
        """method for chat completion."""
        pass

    @abstractmethod
    def streamed_chat_completion(
        self, messages: List[Dict[str, str]], system_message: str = None
    ) -> Generator[ChatCompletionResponse, None, None]:
        """method for streamed chat completion."""
        pass

    @abstractmethod
    def audio_transcription(
        self, audio_file: InMemoryUploadedFile
    ) -> ChatCompletionResponse:
        """method for audio transcription."""
        pass

    @abstractmethod
    def text_embedding(
        self,
        text: str,
    ) -> TextEmbeddingResponse:
        """method for embedding text"""
        pass

    @abstractmethod
    def suggest_descriptions(
        self,
        article_title: str,
    ) -> SuggestDescriptionsResponse:
        """method return list of suggested descriptions"""
        pass

    @abstractmethod
    def genereate_article_outline(
        self, article_title: str, description: str
    ) -> ChatCompletionResponse:
        """method return article templete"""
        pass

    @abstractmethod
    def text_improvement(
        self,
        text: str,
    ) -> ChatCompletionResponse:
        """method return improved text version"""
        pass

    @abstractmethod
    def text_completion(
        self,
        text: str,
        article_title: str,
        article_outline: str,
        max_tokens: int,
    ) -> ChatCompletionResponse:
        """method return improved text version"""
        pass
