
from channels.generic.websocket import JsonWebsocketConsumer
from ai_utils.gpt import streamed_chat_completion
from ai_chat.utils import prepare_chatbox_messages
from openai.resources.chat.completions import ChatCompletionChunk

class ChatConsumer(JsonWebsocketConsumer):
  def connect(self):
          # self.accept()
          user = self.scope.get("user")

          if user and user.is_authenticated and not user.is_anonymous:
              self.accept()


          else:
              self.send_json({"type":"error","content": "user authentication fialed"})
              self.close(code=401)

  def receive_json(self, res):
    """
    {
      type: "chat.completion",
      content: {
        chatbox_id: "",
        user_msg: ""
      }
    }
    """
    message_type = res.get("type", None)
    message_content = res.get("content", None)
    if message_type and message_content :
        
        ## start ## chat.completion
        if message_type == "chat.completion":
            chatbox_id = message_content.get("chatbox_id", None)
            user_msg = message_content.get("user_msg", None)
            if chatbox_id and user_msg:
                from ai_chat.models import ChatMessage
                chatmessage = ChatMessage(user=self.scope["user"], chatbox_id=chatbox_id,user_msg=user_msg)
                messages = prepare_chatbox_messages(chatbox_id, user_msg)
                assistant_msg = ""
                chunk:ChatCompletionChunk
                finish_reason = ""
                for chunk in  streamed_chat_completion(messages):
                  finish_reason = chunk.choices[0].finish_reason
                  if chunk.choices[0].delta.content:
                    assistant_msg += chunk.choices[0].delta.content
                    self.send_json({"type": "chat.completion.stream", "content": chunk.choices[0].delta.content})
                  else:
                      print("chunk")
                  
                chatmessage.assistant_msg = assistant_msg
                chatmessage.finish_reason = finish_reason
                chatmessage.save()
                  
            else:
                self.send_json({"type": "error", "content": "invalid content must be in format {chatbox_id:'' , user_msg:'' }"})
        ## end ## chat.completion

            
        else:
            self.send_json({"type": "error", "content": "invalid  type"})
    else:
        self.send_json({"type": "error", "content": "invalid message type or content"}) 
    user = self.scope["user"]
    # print(user)
    # belal
    cookies = self.scope['cookies']
    # print(cookies)
    # cookies = self.scope['headers']
    # print(cookies)




