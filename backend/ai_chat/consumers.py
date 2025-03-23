from channels.generic.websocket import JsonWebsocketConsumer
from ai_utils.generation_model import GenerationModel


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
        user = self.scope.get("user")
        print(self.chat_id)
        print(user)
        # self.chatbox = user.chatboxes.get(id=self.chat_id)
        self.accept()

    def receive_json(self, res):
        """
        {"messages":[{"role":"user","content":"hi"}],"model":"gpt_4","source_text":"text content"}
        """
        source_text: list[dict[str, str]] | None = res.get("source_text", None)
        messages: list[dict[str, str]] | None = res.get("messages", None)

        if messages:

            chatbox_id = self.chat_id
            user_msg = messages.pop()["content"]
            if chatbox_id and user_msg:
                from ai_chat.models import ChatMessage, ChatBox

                chatbox = ChatBox.objects.get(id=chatbox_id)
                # chatbox = self.chatbox

                chatmessage = ChatMessage(
                    user=self.scope["user"],
                    chatbox_id=chatbox_id,
                    user_msg=user_msg,
                )
                assistant_msg = ""
                finish_reason = ""
                get_answer_user_msg = (
                    f"'question': '{user_msg}'    .text_source': '{source_text}'"
                )
                generation_model = GenerationModel()

                chat_stream_chunks = (
                    generation_model.streamed_chat_completion(
                        system_message=QABOX_SYSTEM_MESSAGE,
                        messages=[
                            *messages,
                            {"role": "user", "content": get_answer_user_msg},
                        ],
                    )
                    if source_text
                    else generation_model.streamed_chat_completion(
                        system_message=chatbox.sys_message,
                        messages=[
                            *messages,
                            {"role": "user", "content": user_msg},
                        ],
                    )
                )
                for chunk in chat_stream_chunks:
                    print(chunk["total_tokens"])
                    print(chunk["completion_tokens"])
                    finish_reason = chunk["finish_reason"]
                    res_content = chunk["text"]
                    assistant_msg += res_content or ""
                    self.send_json(
                        {
                            "content": res_content,
                            "finish_reason": finish_reason,
                        }
                    )

                if finish_reason.lower() == "length":
                    messages.append(
                        {"role": "assistant", "content": assistant_msg},
                    )
                    messages.append(
                        {"role": "user", "content": "continue"},
                    )
                    for chunk in generation_model.streamed_chat_completion(messages):
                        finish_reason = chunk["finish_reason"]
                        res_content = chunk["text"]
                        assistant_msg += res_content or ""
                        print(chunk["total_tokens"])
                        print(chunk["completion_tokens"])
                        self.send_json(
                            {"content": res_content, "finish_reason": finish_reason}
                        )

                chatmessage.assistant_msg = assistant_msg
                chatmessage.finish_reason = finish_reason
                # chatmessage.used_credits =
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
