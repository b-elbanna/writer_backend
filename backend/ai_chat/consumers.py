from channels.generic.websocket import JsonWebsocketConsumer
from ai_utils.gpt import streamed_chat_completion
from ai_chat.utils import prepare_chatbox_messages
from openai.resources.chat.completions import ChatCompletionChunk


class ChatConsumer(JsonWebsocketConsumer):
    def connect(self):
        self.chat_id = self.scope["url_route"]["kwargs"]["chat_id"]
        # cookies = self.scope["headers"]
        # print(cookies)
        user = self.scope.get("user")
        print(self.chat_id)
        print(user)
        self.accept()

        # else:
        #     print(user)
        #     self.close(code=401)

    def receive_json(self, res):
        """
        {"messages":[{"role":"user","content":"hi"}],"model":"gpt_4"}
        """
        messages: list[dict[str, str]] | None = res.get("messages", None)
        if messages:

            ## start ## chat.completion
            chatbox_id = self.chat_id
            user_msg = messages[-1]["content"]
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
                for chunk in streamed_chat_completion(
                    [{"role": "system", "content": chatbox.sys_message}, *messages]
                ):
                    finish_reason = chunk.choices[0].finish_reason
                    res_content = chunk.choices[0].delta.content
                    assistant_msg += res_content or ""
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
