interface SocketReqMessage {
	role: "assistant" | "user";
	content: string;
}
interface SocketReq {
	messages: SocketReqMessage[];
	model: string;
}

const prepareSocketMessagesReq = (
	messages: ChatboxMessageInterace[] | undefined
) => {
	let messReq: SocketReqMessage[] = [];
	if (messages) {
		for (let message of messages) {
			messReq.push({ role: "user", content: message.user_msg });
			if (message.assistant_msg.length) {
				messReq.push({ role: "assistant", content: message.assistant_msg });
			}
		}
	}
	return messReq;
};
export default prepareSocketMessagesReq;
