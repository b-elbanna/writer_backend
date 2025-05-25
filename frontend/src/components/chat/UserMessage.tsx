import React, { KeyboardEvent } from "react";

interface ChatMessageInterface {
	message: {
		id?: string;
		role: "user" | "assistant" | "system";
		content: string;
		voice_message?: boolean;
		finish_reason?: "stop" | "length" | "content_filter" | null;
		created_at?: string;
	};
}
export default function UserMessage({ message }: ChatMessageInterface) {
	const pRef = React.useRef<HTMLParagraphElement>(null);

	return (
		<div className="relative w-fit max-w-[85%] md:max-w-[75%] ml-auto transform transition-all duration-200 ease-out">
			<div className="bg-primary text-white dark:text-dark rounded-2xl rounded-tr-none px-4 py-2 shadow-md hover:shadow-lg transition-shadow">
				<p
					ref={pRef}
					className="whitespace-pre-line overflow-x-auto text-sm md:text-base leading-relaxed"
				>
					{message.content}
				</p>
				<div className="mt-1 text-xs opacity-70">
					{message.created_at &&
						new Date(message.created_at).toLocaleTimeString()}
				</div>
			</div>
		</div>
	);
}
