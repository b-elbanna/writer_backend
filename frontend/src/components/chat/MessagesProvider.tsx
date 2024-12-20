import { createContext, Dispatch, SetStateAction, useState } from "react";

export const LastMessageContext = createContext<
	[
		ChatboxMessageInterace | undefined,
		Dispatch<SetStateAction<ChatboxMessageInterace | undefined>>
	]
>([undefined, () => {}]);

export default function MessagesProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [lastChatMessage, setLastChatMessage] =
		useState<ChatboxMessageInterace>();
	return (
		<LastMessageContext.Provider value={[lastChatMessage, setLastChatMessage]}>
			{children}
		</LastMessageContext.Provider>
	);
}
