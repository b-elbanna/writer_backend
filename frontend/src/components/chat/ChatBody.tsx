"use client";
import React, {
	Fragment,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import UserMessage from "./UserMessage";
import AssistantMessage from "./AssistantMessage";
import { LastMessageContext } from "./MessagesProvider";
import { useAppDispatch, useAppSelector } from "@/rtk/store";
import { addChatMessage } from "@/rtk/slices/currentUserChat";
import RawAssistantMessage from "./RawAssistantMessage";

type ChatBodyProps = {
	// chatMessages: ChatMessageInterface[];
	body: React.RefObject<HTMLDivElement>;
	chatId?: string;
	lastSocketMessage: {
		content: string;
		finish_reason: "stop" | "length" | "content_filter" | null;
	};
};
let interval: NodeJS.Timeout | undefined;
export default function ChatBody({
	body,
	chatId,
	lastSocketMessage,
}: ChatBodyProps) {
	const [currentMessage, setCurrentMessage] = useContext(LastMessageContext);
	const currentChatbox = useAppSelector((state) => state.currentUserChatbox);
	const appDispatch = useAppDispatch();
	console.log("currentMessage", currentChatbox.chatbox.messages);
	useEffect(() => {
		if (lastSocketMessage && currentMessage) {
			console.log(lastSocketMessage);
			if (lastSocketMessage.finish_reason) {
				setCurrentMessage({
					...currentMessage,
					finish_reason: lastSocketMessage.finish_reason,
				});
			}
			if (lastSocketMessage.content) {
				setCurrentMessage((prev) => {
					if (prev) {
						return {
							...prev,
							finish_reason: lastSocketMessage.finish_reason || undefined,
							assistant_msg:
								currentMessage.assistant_msg + lastSocketMessage.content,
						};
					}
					return prev;
				});
			}

			if (lastSocketMessage.finish_reason?.toLocaleLowerCase() == "stop") {
				appDispatch(
					addChatMessage({ ...currentMessage, finish_reason: "stop" })
				);
				setCurrentMessage(undefined);
			}
		}
	}, [lastSocketMessage]);

	useEffect(() => {
		if (
			body.current &&
			body.current?.scrollHeight - body.current?.scrollTop >
				body.current?.clientHeight + 100
		) {
			body.current?.scrollTo(0, body.current.scrollHeight);
			console.log("scrolling");
		}
	}, [currentMessage]);
	return (
		<div
			ref={body}
			className=" flex-1 h-full w-full mx-auto overflow-x-hidden  overflow-y-auto px-5 "
		>
			{currentChatbox.chatbox.messages &&
				currentChatbox.chatbox.messages.map((message, index: number) => {
					return (
						<Fragment key={message.id}>
							<UserMessage
								message={{
									id: message.id,
									role: "user",
									content: message.user_msg,
									created_at: message.created_at,
									finish_reason: message.finish_reason,
									voice_message: message.voice_message,
								}}
							/>
							<AssistantMessage
								message={{
									id: message.id,
									role: "assistant",
									content: message.assistant_msg,
									created_at: message.created_at,
									finish_reason: message.finish_reason,
									voice_message: message.voice_message,
								}}
							/>
						</Fragment>
					);
				})}
			{/* <p className="text-center text-customred"> _____ context cleard _____ </p> */}
			{currentMessage && (
				<>
					<UserMessage
						key={currentMessage.id + Math.random()}
						message={{
							id: currentMessage.id,
							role: "user",
							content: currentMessage.user_msg,
							created_at: currentMessage.created_at,
							finish_reason: currentMessage.finish_reason,
							voice_message: currentMessage.voice_message,
						}}
					/>
					<RawAssistantMessage
						key={currentMessage.id + Math.random()}
						message={{
							id: currentMessage.id,
							role: "assistant",
							content: currentMessage.assistant_msg,
							created_at: currentMessage.created_at,
							finish_reason: currentMessage.finish_reason,
							voice_message: currentMessage.voice_message,
						}}
					/>
				</>
			)}
			<div className=" h-[150px]"></div>
		</div>
	);
}
