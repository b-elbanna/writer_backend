import { BotIcon } from "lucide-react";
import { ChatMessageInterface } from "./AssistantMessage";

export default function RawAssistantMessage({
	message,
}: {
	message: ChatMessageInterface;
}) {
	return (
		<div className="relative w-fit max-w-[85%] md:max-w-[75%] transform transition-all duration-200 ease-out group">
			<div className="absolute -left-2 -top-2">
				<div className="bg-white dark:bg-gray-800 rounded-full p-1 shadow-md">
					<BotIcon size={24} className="text-primary dark:text-white" />
				</div>
			</div>
			<div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-2xl rounded-tl-none px-4 py-2 mt-2 shadow-md">
				<div className="whitespace-pre-line overflow-x-auto text-sm md:text-base">
					{message.content}
					{message.finish_reason && (
						<span className="text-xs text-gray-500 ml-2">
							({message.finish_reason})
						</span>
					)}
				</div>
			</div>
		</div>
	);
}
