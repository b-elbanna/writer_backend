from collections import namedtuple 
from openai import OpenAI
from django.conf import settings
import tiktoken
from tenacity import retry, wait_exponential, stop_after_attempt


open_ai = OpenAI( api_key=settings.OPENAI_KEY)
openai_models = namedtuple(
      'openai_models',
      ["base_model",'gpt_35_turbo', 'gpt_4',"gpt_4_turbo","gpt_4_vision","gpt_4o","gpt_4o_mini","embedding_model"]
    )
available_models = openai_models(base_model="gpt-4o-mini", gpt_35_turbo="gpt-3.5-turbo-1106", gpt_4="gpt-4", gpt_4_turbo="gpt-4-1106-preview", gpt_4_vision="gpt-4-vision-preview", gpt_4o="gpt-4o",gpt_4o_mini="gpt-4o-mini-2024-07-18", embedding_model="text-embedding-ada-002")
tokenizer = tiktoken.get_encoding("cl100k_base")











@retry(
    wait=wait_exponential(multiplier=1, min=1, max=5),
    stop=stop_after_attempt(5),
)
def chat_completion(messages: list[dict], system_message: str=None, model=available_models.base_model,**kwargs):
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
    return open_ai.chat.completions.create(messages=messages, model=model,**kwargs)




def streamed_chat_completion(messages: list[dict], system_message: str=None, model=available_models.base_model,**kwargs):
    """
    for more info:
    https://platform.openai.com/docs/api-reference/chat
    https://platform.openai.com/docs/guides/chat-completions/getting-started
  {
    return chunks(generator)
  }
    chunk.choices[0].delta.content

    """
    return chat_completion(messages=messages, system_message=system_message, model=model,stream=True,**kwargs)



def calc_token_count(
    argument, chat=False, encoding=tokenizer
):
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


