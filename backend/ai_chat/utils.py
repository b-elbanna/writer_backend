from ai_chat.models import ChatBox

def prepare_chatbox_messages(chatbox_id:str,user_msg:str)->list[dict[str,str]]:
  chatbox = ChatBox.objects.get(id=chatbox_id)
  old_messages = chatbox.messages.only("assistant_msg","user_msg").all()[:3]
  messages = [
      {"role": "user", "content": user_msg},
  ]
  for old_message in old_messages:
      messages.insert(0,{"role": "assistant", "content": old_message.assistant_msg})
      messages.insert(0,{"role": "user", "content": old_message.user_msg})
  if chatbox.sys_message:
      messages.insert(0,{"role": "system", "content": chatbox.sys_message})
  return messages