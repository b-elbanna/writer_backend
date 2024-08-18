from rest_framework import serializers
from .models import ChatBox,ChatMessage




class FileUploadSerializer(serializers.Serializer):
    file = serializers.FileField(allow_empty_file=False, required=True)

    def validated_file(self, value):
        max_size = 5242
        # valid_file_format =[""]
        if value.size > max_size:
            raise serializers.ValidationError("file too large")
        return value

class ChatBoxSerializer(serializers.ModelSerializer):
  name = serializers.CharField(max_length=20,min_length=3,trim_whitespace=True)
  sys_message = serializers.CharField(required=False,trim_whitespace=True,allow_blank=True)
  user_name = serializers.SerializerMethodField()
  
  class Meta:
    model=ChatBox
    fields = (
      "id",
      "name",
      "user_name",
      "temperature",
      "sys_message",
      "created_at",
    )

  def get_user_name(self, obj):
    return obj.user.username

  def validate_name(self, value):
    user = self.context['request'].user
    existing_chatbox = ChatBox.objects.filter(user=user, name=value).first()
    if existing_chatbox:
      raise serializers.ValidationError("A chatbox with this name already exists for this user.")
    return value
  
  def validate_sys_message(self, value):
    # msg_tokens=gpt3_tokens_calc(str(value))
    # if msg_tokens >100:
    #   raise serializers.ValidationError(
    #                 f"system messages can't contain more than 100 tokens\ncurrent message contain {msg_tokens} tokens")
    return value
  
  def validate(self, data):
    user = self.context['request'].user
    max_chatboxes = 10 # Set the maximum number of chatboxes per user
    num_chatboxes = ChatBox.objects.filter(user=user).count()
    if num_chatboxes >= max_chatboxes:
        raise serializers.ValidationError(f"Maximum {max_chatboxes} chatboxes allowed per user.")
    return data

  # def create(self, validated_data):
  #   user = self.context['request'].user
  #   chatbox = ChatBox.objects.create(user=user, **validated_data)
  #   return chatbox


class ChatMessageSerializer(serializers.ModelSerializer):
  assistant_msg = serializers.CharField(trim_whitespace=True,read_only=True)
  n_prompt_messages = serializers.CharField(trim_whitespace=True,read_only=True)
  finish_reason = serializers.CharField(trim_whitespace=True,read_only=True)
  chatbox_name = serializers.SerializerMethodField()
  
  def validate_chatbox(self, value):
    request = self.context['request']
    if value.user != request.user:
        raise serializers.ValidationError("Invalid chatbox for that user")
    return value
  
  def get_chatbox_name(self, obj):
    return obj.chatbox.name
  
  class Meta:
    model=ChatMessage
    fields = (
      "id",
      "chatbox_name",
      "user_msg",
      "assistant_msg",
      "n_prompt_messages",
      "finish_reason",
      "voice_message",
      "created_at",
    )

    # message:
# 	-id
# 	-user_id
# 	-chatbox_id
# 	-user_msg
# 	-assistant_msg
# 	-n_prompt_messages
# 	-prompt_tokens
# 	-user_msg_tokens
# 	-assistant_msg_tokens 
# 	-finish_reason
# 	-voice_message
#   -created_at
# 	-used_credits