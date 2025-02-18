import { useEffect, useRef } from "react";
import { soketUrl } from "@/baseApis/base";
import ChatBody from "./ChatBody";
import ChatInput from "./ChatInput";
import useWebSocket from "react-use-websocket";
import { useAppSelector } from "@/rtk/store";
import MessagesProvider from "./MessagesProvider";

export default function Chat({
	chatId,
	className,
}: {
	chatId?: string;
	className?: string;
}) {
	const ref = useRef<HTMLDivElement>(null);
	const currentUserProject = useAppSelector(
		(state) => state.currentUserProject
	);
	const { sendJsonMessage, lastJsonMessage, readyState, getWebSocket } =
		useWebSocket<{
			content: string;
			finish_reason: "stop" | "length" | "content_filter" | null;
		}>(`${soketUrl}chat/${currentUserProject.value.chatbox}`, {
			onOpen: () => console.log("opened"),
			shouldReconnect: (closeEvent) =>
				currentUserProject.value.chatbox?.length > 0,
		});
	useEffect(() => {
		if (ref.current) {
			ref.current.scrollTop = ref.current.scrollHeight;
		}
	}, [className]);

	return (
		<div
			className={` snap-center h-full overflow-hidden   mx-auto relative  flex-1 ${className} `}
		>
			<MessagesProvider>
				<ChatBody
					body={ref}
					lastSocketMessage={lastJsonMessage}
					chatId={chatId}
				/>
				<ChatInput
					chatId={currentUserProject.value.chatbox}
					// setCurrentAssistantMessage={setCurrenAssistantMessage}
					sendSocketMesssage={sendJsonMessage}
				/>
			</MessagesProvider>
		</div>
	);
}
