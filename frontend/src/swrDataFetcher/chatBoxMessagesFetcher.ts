import useSWR from "swr";
import fetcher from "./swrFetcher";
// import { ChatMessageInterface } from "@/components/chat/MessagesProvider";
import { useCallback } from "react";
export interface ChatMessageResInterface {
	id: string;
	chatbox_name: string;
	user_msg: string;
	assistant_msg: string;
	n_prompt_messages: string;
	finish_reason: "stop" | "length" | "content_filter" | null;
	voice_message: boolean;
	created_at: string;
}
export default function useChatBoxMessagesFetcher(chatId: string) {
	const { data, error, isLoading, mutate } = useSWR(
		`/chat/messages/${chatId}`,
		fetcher
	);

	const getChatMesssages = useCallback(() => {
		let chatMess: {
			id: string;
			role: string;
			content: string;
			created_at: string;
			finish_reason?: string | null;
			voice_message?: boolean;
		}[] = [];
		if (data?.results) {
			for (let message of data?.results as ChatMessageResInterface[]) {
				chatMess.unshift({
					id: message.id + "user",
					role: "user",
					content: message.user_msg,
					created_at: message.created_at,
					finish_reason: message.finish_reason,
					voice_message: message.voice_message,
				});
				chatMess.unshift({
					id: message.id + "assistant",
					role: "assistant",
					content: message.assistant_msg,
					created_at: message.created_at,
					finish_reason: message.finish_reason,
					voice_message: message.voice_message,
				});
			}
		}
		return chatMess;
	}, [data]);

	return {
		messages: getChatMesssages(),
		isLoading,
		isError: error,
		mutate,
		nextPageUrl: data?.next,
		prevPageUrl: data?.previous,
	};
}
