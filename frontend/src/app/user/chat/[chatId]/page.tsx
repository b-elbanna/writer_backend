"use client";
import authProtection from "@/auth/authProtection";
import ChatBox from "@/components/chat/chatbox";
import MainTitle from "@/components/mainTitle";
import { uuidRegex } from "@/regex/uuid";
import { notFound } from "next/navigation";

function ChatPage({ params }: { params: any }) {
	const { chatId } = params;
	if (!uuidRegex.test(chatId)) return notFound();
	return (
		<div className="h-screen overflow-hidden flex flex-col mx-auto max-w-2xl">
			<div className="text-center">
				<MainTitle title="CHatBox" />
			</div>
			<ChatBox chatId={chatId} />
		</div>
	);
}

export default authProtection(ChatPage);
