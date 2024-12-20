import Chat from "@/components/chat/chat";

export default function ChatBox({
	chatId,
	className,
}: {
	chatId?: any;
	className?: string;
}) {
	return <Chat chatId={chatId} className={className} />;
}
