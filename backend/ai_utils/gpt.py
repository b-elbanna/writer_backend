from collections import namedtuple
from openai import OpenAI
from openai.types import Completion
from django.conf import settings
import tiktoken
from tenacity import retry, wait_exponential, stop_after_attempt
import re

open_ai = OpenAI(api_key=settings.OPENAI_KEY)
openai_models = namedtuple(
    "openai_models",
    [
        "base_model",
        "gpt_35_turbo",
        "gpt_4",
        "gpt_4_turbo",
        "gpt_4_vision",
        "gpt_4o",
        "gpt_4o_mini",
        "embedding_model",
    ],
)
available_models = openai_models(
    base_model="gpt-4o-mini",
    gpt_35_turbo="gpt-3.5-turbo-1106",
    gpt_4="gpt-4",
    gpt_4_turbo="gpt-4-1106-preview",
    gpt_4_vision="gpt-4-vision-preview",
    gpt_4o="gpt-4o",
    gpt_4o_mini="gpt-4o-mini-2024-07-18",
    embedding_model="text-embedding-ada-002",
)
app_languages = namedtuple("app_languages", ["english", "arabic"])
available_langs = app_languages(english="en", arabic="ar")
tokenizer = tiktoken.get_encoding("cl100k_base")


@retry(
    wait=wait_exponential(multiplier=1, min=1, max=5),
    stop=stop_after_attempt(5),
)
def chat_completion(
    messages: list[dict],
    system_message: str = None,
    model=available_models.base_model,
    **kwargs,
) -> Completion:
    """
      for more info:
      https://platform.openai.com/docs/api-reference/chat
      https://platform.openai.com/docs/guides/chat-completions/getting-started
    {
        "choices": [
        {
          "finish_reason": "stop",
          "index": 0,
          "message": {
            "content": "The 2020 World Series was played in Texas at Globe Life Field in Arlington.",
            "role": "assistant"
          },
          "logprobs": null
        }
      ],
      "created": 1677664795,
      "id": "chatcmpl-7QyqpwdfhqwajicIEznoc6Q47XAyW",
      "model": "gpt-4o-mini",
      "object": "chat.completion",
      "usage": {
        "completion_tokens": 17,
        "prompt_tokens": 57,
        "total_tokens": 74
      }
    }

    """
    if system_message:
        messages.insert(0, {"role": "system", "content": system_message})
    return open_ai.chat.completions.create(messages=messages, model=model, **kwargs)


def streamed_chat_completion(
    messages: list[dict],
    system_message: str = None,
    model=available_models.base_model,
    **kwargs,
):
    """
      for more info:
      https://platform.openai.com/docs/api-reference/chat
      https://platform.openai.com/docs/guides/chat-completions/getting-started
    {
      return chunks(generator)
    }
      chunk.choices[0].delta.content

    """
    return chat_completion(
        messages=messages,
        system_message=system_message,
        model=model,
        stream=True,
        **kwargs,
    )


def calc_token_count(argument, chat=False, encoding=tokenizer):
    if chat:
        num_tokens = 0
        for message in argument:
            # every message follows <im_start>{role/name}\n{content}<im_end>\n
            num_tokens += 4
            for key, value in message.items():
                num_tokens += len(encoding.encode(value))
                if key == "name":  # if there's a name, the role is omitted
                    num_tokens += -1  # role is always required and always 1 token
        num_tokens += 2  # every reply is primed with <im_start>assistant
        return num_tokens
    elif not chat:
        encoded_string = encoding.encode(argument)
        tokens = [encoding.decode([token]) for token in encoded_string]
        return len(tokens)


@retry(wait=wait_exponential(multiplier=1, min=1, max=5), stop=stop_after_attempt(5))
def text_improvement(
    text: str,
    lang: str = available_langs.english,
    instruction: str = None,
):
    language = "English" if lang == available_langs.english else "Arabic"
    messages = [
        {
            "role": "system",
            "content": f"You will be given a piece of text and your goal is to paraphrase it \
                        and to improve the quality and relevance of it\n\n\
                        please:\n\
                        - Use engaging language to make the text more compelling.\n\
                        - Rephrase any complex or unclear sections for clarity.\n\
                        - USe the same language as the text which is {language}\n\
                        - Return the improved text only without any Brackets.",
        },
        {"role": "user", "content": f"Improve this piece of text: {text}"},
    ]
    if instruction:
        messages[0]["content"] += f"- {instruction},"

    return chat_completion(messages=messages)


def prepare_last_sentence(text, max_tokens=70):
    mirrored = text[::-1]
    last_paragraph = re.split("\n", mirrored)[0]
    last_paragraph_sentences = re.split("\.", last_paragraph)
    last_sentence = last_paragraph_sentences[0][::-1]
    encoded = tokenizer.encode(last_sentence)
    if (len(encoded) <= 10) & (len(last_paragraph_sentences) > 1):
        encoded = tokenizer.encode(last_paragraph_sentences[1][::-1]) + encoded
    if len(encoded) >= max_tokens:
        feed = tokenizer.decode(encoded[-max_tokens:])
    else:
        feed = tokenizer.decode(encoded)
    return feed


@retry(wait=wait_exponential(multiplier=1, min=1, max=5), stop=stop_after_attempt(5))
def text_completion(
    text: str,
    title: str,
    lang: str = available_langs.english,
    description=None,
    sentence=False,
    max_tokens=100,
):
    text = prepare_last_sentence(text) if not sentence else text

    messages = [
        {
            "role": "system",
            "content": f"you will be given the start of a paragrah and your goal is to complete it.\n\
					The paragraph is within an article with the title {title}. ",
        },
        {"role": "user", "content": text},
    ]
    if description:
        messages[0]["content"] += f"The discription of the article is {description}"

    return chat_completion(messages=messages, max_tokens=max_tokens)
