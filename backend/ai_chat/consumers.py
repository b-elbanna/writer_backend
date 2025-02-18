from channels.generic.websocket import JsonWebsocketConsumer
from ai_utils.gpt import streamed_chat_completion
from ai_chat.utils import prepare_chatbox_messages
from openai.resources.chat.completions import ChatCompletionChunk

QABOX_SYSTEM_MESSAGE = """
Your task is to answer 'question' only using the information within the provided 'text_source'. 
Follow these guidelines:
- 'text_source' is peice of text that collected paragraphs from different sources(books, articles, etc). 
- Do not provide any information that is not supported by the 'text_source'.
- Explain your answer if necessary.
"""


class ChatConsumer(JsonWebsocketConsumer):
    def connect(self):
        self.chat_id = self.scope["url_route"]["kwargs"]["chat_id"]
        # cookies = self.scope["headers"]
        # print(cookies)
        user = self.scope.get("user")
        print(self.chat_id)
        print(user)
        self.chatbox = user.chatboxes.get(id=self.chat_id)
        self.accept()

        # else:
        #     print(user)
        #     self.close(code=401)

    def receive_json(self, res):
        """
        {"messages":[{"role":"user","content":"hi"}],"model":"gpt_4","source_text":"text content"}
        """
        source_text: list[dict[str, str]] | None = res.get("source_text", None)
        messages: list[dict[str, str]] | None = res.get("messages", None)

        if messages:

            ## start ## chat.completion
            chatbox_id = self.chat_id
            user_msg = messages.pop()["content"]
            if chatbox_id and user_msg:
                from ai_chat.models import ChatMessage, ChatBox

                chatbox = ChatBox.objects.get(id=chatbox_id)

                chatmessage = ChatMessage(
                    user=self.scope["user"],
                    chatbox_id=chatbox_id,
                    user_msg=user_msg,
                )
                assistant_msg = ""
                chunk: ChatCompletionChunk
                finish_reason = ""
                get_answer_user_msg = (
                    f"'question': '{user_msg}'    .text_source': '{source_text}'"
                )
                chat_stream_chunks = (
                    streamed_chat_completion(
                        system_message=QABOX_SYSTEM_MESSAGE,
                        messages=[
                            *messages,
                            {"role": "user", "content": get_answer_user_msg},
                        ],
                    )
                    if source_text
                    else streamed_chat_completion(
                        system_message=chatbox.sys_message,
                        messages=[
                            *messages,
                            {"role": "user", "content": user_msg},
                        ],
                    )
                )
                for chunk in chat_stream_chunks:
                    finish_reason = chunk.choices[0].finish_reason
                    res_content = chunk.choices[0].delta.content
                    assistant_msg += res_content or ""
                    print(chunk.choices[0])
                    self.send_json(
                        {
                            "content": res_content,
                            "finish_reason": finish_reason,
                        }
                    )

                if finish_reason == "length":
                    messages.append(
                        {"role": "assistant", "content": assistant_msg},
                    )
                    messages.append(
                        {"role": "user", "content": "continue"},
                    )
                    for chunk in streamed_chat_completion(messages):
                        finish_reason = chunk.choices[0].finish_reason
                        res_content = chunk.choices[0].delta.content
                        assistant_msg += res_content or ""
                        self.send_json(
                            {"content": res_content, "finish_reason": finish_reason}
                        )

                chatmessage.assistant_msg = assistant_msg
                chatmessage.finish_reason = finish_reason
                chatmessage.save()

            else:
                self.send_json(
                    {
                        "type": "error",
                        "content": "invalid content must be in format {chatbox_id:'' , user_msg:'' }",
                    }
                )

        else:
            self.send_json(
                {"type": "error", "content": "invalid message type or content"}
            )
        # user = self.scope["user"]
        # print(user)
        # belal
        # cookies = self.scope["cookies"]
        # print(cookies)
        # cookies = self.scope['headers']
        # print(cookies)
