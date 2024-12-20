import { soketUrl } from "@/baseApis/base";
import ChatBody from "@/components/chat/ChatBody";
import ChatInput from "@/components/chat/ChatInput";
import MessagesProvider from "@/components/chat/MessagesProvider";
import QABoxResult from "@/components/qabox/qaboxResult";
import QABoxUploadResource from "@/components/qabox/qaboxUploadResource";
import WritingToolsBar from "@/components/writtingToolsBar/writtingToolsBar";
import { QABoxAnswerInterface } from "@/endpointActions/postCreateAnswerBoxAction";
import { useAppSelector } from "@/rtk/store";
import { useEffect, useRef, useState } from "react";
import useWebSocket from "react-use-websocket";

export default function FuctionBar() {
	const ref = useRef<HTMLDivElement>(null);
	const currentUserProject = useAppSelector(
		(state) => state.currentUserProject
	);
	const [qaResults, setQAResults] = useState<QABoxAnswerInterface[]>([]);
	const currentTool = useAppSelector((state) => state.projectOpenedTool);
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
		if (ref.current) ref.current?.scrollTo(0, ref.current.scrollHeight);
	}, [currentTool]);
	return (
		<MessagesProvider>
			<div
				style={{ height: !currentTool.id ? "100px" : "70%" }}
				className={` transition-all duration-700 w-full border bottom-0 z-10 shadow-2xl absolute backdrop-blur-sm`}
			>
				<div
					className={` absolute right-0 top-0 px-8 z-10 py-3 -translate-y-full`}
				>
					<WritingToolsBar />
				</div>

				<div
					className={`${![1, 2].includes(currentTool.id) && "hidden"} h-full`}
				>
					<div
						className={`${
							currentTool.id === 2 && qaResults.length ? "h-full pb-36" : "h-0"
						} overflow-y-auto overflow-x-hidden translation-all duration-500`}
					>
						{qaResults.map(
							(qaResult, i) =>
								i < 4 && (
									<QABoxResult key={qaResult[1]} qaBoxResult={qaResult} />
								)
						)}
					</div>

					<ChatBody body={ref} lastSocketMessage={lastJsonMessage} />
				</div>
				<div
					className={`${
						currentTool.id !== 3 && "hidden"
					} h-full overflow-hidden `}
				>
					<QABoxUploadResource
						className="px-5"
						qaBoxId={currentUserProject.value.qaBox}
					/>
				</div>
			</div>
			<ChatInput
				chatId={currentUserProject.value.chatbox}
				sendSocketMesssage={sendJsonMessage}
				setQAResults={setQAResults}
				qaResults={qaResults}
			/>
		</MessagesProvider>
	);
}
