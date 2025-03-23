import json
from openai.types.chat.chat_completion_chunk import ChatCompletionChunk
from environs import Env
from openai import OpenAI
from .prompts import (
    SUGGEST_DESCRIPTIONS_SYSTEM_MESSAGE,
    CREATE_OUTLINE_SYSTEM_MESSAGE,
    TEXT_COMPLETION_SYSTEM_MESSAGE,
    TEXT_IMPROVEMENT_SYSTEM_MESSAGE,
)
from .types import (
    BaseGenerationModel,
    ChatCompletionResponse,
    SuggestDescriptionsResponse,
    TextEmbeddingResponse,
)


env = Env()
env.read_env()
OPENAI_KEY = env.str("OPENAI_KEY")


class OpenaiModel(BaseGenerationModel):
    """Concrete class for OpenAI models."""

    api_key = OPENAI_KEY
    default_model = "gpt-4o-mini"
    client_class = OpenAI
    available_models = [
        "gpt-4o-mini",
        "text-embedding-ada-002",
        "gpt-3.5-turbo-1106",
        "gpt-4o",
    ]
    embedding_model = "text-embedding-ada-002"
    audio_transcription_model = "whisper-1"

    def chat_completion(self, messages, system_message=None):
        if system_message:
            messages.insert(0, {"role": "system", "content": system_message})
        try:
            response = self.client.chat.completions.create(
                messages=messages, model=self.model
            )
            return ChatCompletionResponse(
                text=response.choices[0].message.content,
                prompt_tokens=response.usage.prompt_tokens,
                completion_tokens=response.usage.completion_tokens,
                total_tokens=response.usage.total_tokens,
                finish_reason=response.choices[0].finish_reason,
                model=response.model,
            )
        except Exception as e:
            raise RuntimeError(f"OpenAI API error: {e}")

    def streamed_chat_completion(self, messages, system_message=None):
        if system_message:
            messages.insert(0, {"role": "system", "content": system_message})
        try:
            response = self.client.chat.completions.create(
                messages=messages, model=self.model, stream=True
            )
            chunk: ChatCompletionChunk
            for chunk in response:
                yield ChatCompletionResponse(
                    text=chunk.choices[0].delta.content,
                    prompt_tokens=chunk.usage.prompt_tokens,
                    completion_tokens=chunk.usage.completion_tokens,
                    total_tokens=chunk.usage.total_tokens,
                    finish_reason=chunk.choices[0].finish_reason,
                    model=chunk.model,
                )
        except Exception as e:
            raise RuntimeError(f"OpenAI API error: {e}")

    def audio_transcription(self, audio_file):
        res = self.client.audio.transcriptions.create(
            model=self.audio_transcription_model,
            file=(audio_file.name, audio_file.file, audio_file.content_type),
        )
        return ChatCompletionResponse(
            text=res.text,
            prompt_tokens=0,
            completion_tokens=0,
            total_tokens=0,
            finish_reason="stop",
            model=self.audio_transcription_model,
        )

    def text_embedding(self, text):
        res = self.client.embeddings.create(input=text, model=self.embedding_model)
        print(res.data)
        return TextEmbeddingResponse(
            text=text,
            embedding=res.data[0].embedding,
            model=self.embedding_model,
            total_tokens=0,
        )

    def suggest_descriptions(
        self,
        article_title: str,
    ) -> SuggestDescriptionsResponse:
        res = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {
                    "role": "system",
                    "content": SUGGEST_DESCRIPTIONS_SYSTEM_MESSAGE,
                },
                {
                    "role": "user",
                    "content": f"{article_title} ",
                },
            ],
            response_format={"type": "json_object"},
            stream=False,
        )
        data = res.choices[0].message.content
        data = json.loads(data)
        print(data)
        return SuggestDescriptionsResponse(
            descriptions=data,
            model=self.model,
            total_tokens=res.usage.total_tokens,
        )

    def genereate_article_outline(self, article_title: str, description: str):
        res = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": CREATE_OUTLINE_SYSTEM_MESSAGE},
                {
                    "role": "user",
                    "content": f"Article Title: {article_title}\nArticle Description: {description}",
                },
            ],
            stream=False,
        )
        return ChatCompletionResponse(
            text=res.choices[0].message.content,
            prompt_tokens=res.usage.prompt_tokens,
            completion_tokens=res.usage.completion_tokens,
            total_tokens=res.usage.total_tokens,
            finish_reason=res.choices[0].finish_reason,
        )

    def text_completion(
        self, text: str, article_title: str, article_outline: str, max_tokens: int
    ):
        prompt = f" TEXT: '{text}' \n" + (
            f"Article Title: {article_title} \n Article Outline: {article_outline}"
            if article_outline
            else f"Article Title: {article_title}"
        )
        res = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": TEXT_COMPLETION_SYSTEM_MESSAGE},
                {"role": "user", "content": prompt},
            ],
            stream=False,
            max_completion_tokens=max_tokens,
        )
        return ChatCompletionResponse(
            text=res.choices[0].message.content,
            prompt_tokens=res.usage.prompt_tokens,
            completion_tokens=res.usage.completion_tokens,
            total_tokens=res.usage.total_tokens,
            finish_reason=res.choices[0].finish_reason,
        )

    def text_improvement(
        self,
        text: str,
    ):
        prompt = f"the piece of TEXT: '{text}' \n"
        res = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": TEXT_COMPLETION_SYSTEM_MESSAGE},
                {"role": "user", "content": prompt},
            ],
            stream=False,
        )
        return ChatCompletionResponse(
            text=res.choices[0].message.content,
            prompt_tokens=res.usage.prompt_tokens,
            completion_tokens=res.usage.completion_tokens,
            total_tokens=res.usage.total_tokens,
            finish_reason=res.choices[0].finish_reason,
        )
