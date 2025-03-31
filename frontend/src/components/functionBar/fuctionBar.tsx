import { soketUrl } from "@/baseApis/base";
import ChatBody from "@/components/chat/ChatBody";
import ChatInput from "@/components/chat/ChatInput";
import MessagesProvider from "@/components/chat/MessagesProvider";
import QABoxResult from "@/components/qabox/qaboxResult";
import QABoxUploadResource from "@/components/qabox/qaboxUploadResource";
import WritingToolsBar from "@/components/functionBar/writtingToolsBar/writtingToolsBar";
import { QABoxAnswerInterface } from "@/endpointActions/postCreateAnswerBoxAction";
import { useAppSelector } from "@/rtk/store";
import { useEffect, useRef, useState } from "react";
import useWebSocket from "react-use-websocket";
import ActiveResourcesTogglerButton from "./activeResourcesTogglerButton";
import { SimpleTooltip } from "../simpleTooltip";
import PaperSearchBody from "../paperSearch/paperSearchBody";
import CustomExcalidraw from "./lasyExcalidraw";

export default function FuctionBar() {
	const ref = useRef<HTMLDivElement>(null);
	const currentUserProject = useAppSelector(
		(state) => state.currentUserProject
	);
	const papersSearchData = useAppSelector((state) => state.papersSearchData);
	const arxivSearchData = useAppSelector((state) => state.arxivSearchData);
	const isActiveResources = useAppSelector((state) => state.isActiveResources);
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
				style={{ height: !currentTool.id ? "0%" : "100%" }}
				className={` transition-all ease-in-out duration-500 w-full absolute border bottom-0 z-[222] shadow-2xl bg-white`}
			>
				<div
					className={`  right-0 ${
						currentTool.id ? "top-0" : "absolute -translate-y-full bottom-4  "
					} px-5 flex items-center justify-between w-full z-10 py-3 transition-all pointer-events-none duration-500 delay-200`}
				>
					<WritingToolsBar />
					{currentUserProject.value.qaBox && <ActiveResourcesTogglerButton />}
				</div>
				{/* <div
					className={`  right-0 ${
						currentTool.id ? "top-0" : "absolute -translate-y-full bottom-4  "
					} px-5 flex items-center justify-between w-full z-10 py-3 transition-all pointer-events-none duration-500 delay-200`}
				>
					<WritingToolsBar />
					{currentUserProject.value.qaBox && <ActiveResourcesTogglerButton />}
				</div> */}
				{currentTool.id === 1 && (
					<div className={`h-full relative`}>
						<ChatBody body={ref} lastSocketMessage={lastJsonMessage} />
						<div
							className={`${
								qaResults.length ? "h-[100px] pb-36" : "h-0"
							} overflow-y-auto absolute top-0 w-full overflow-x-hidden translation-all duration-500`}
						>
							{qaResults.map(
								(qaResult, i) =>
									i < 4 && (
										<QABoxResult key={qaResult[1]} qaBoxResult={qaResult} />
									)
							)}
						</div>
					</div>
				)}
				{currentTool.id === 2 && (
					<div className={`flex flex-col h-full overflow-hidden `}>
						{currentUserProject.value.qaBox && (
							<QABoxUploadResource
								className="p-5"
								qaBoxId={currentUserProject.value.qaBox}
							/>
						)}
						<div
							className={` flex-1 pb-36 overflow-y-auto overflow-x-hidden translation-all duration-500`}
						>
							<PaperSearchBody />
						</div>
					</div>
				)}
				{currentTool.id === 3 && (
					<div className={` h-full`}>
						<CustomExcalidraw />
					</div>
				)}
				{currentTool.id !== 3 && (
					<ChatInput
						chatId={currentUserProject.value.chatbox}
						sendSocketMesssage={sendJsonMessage}
						setQAResults={isActiveResources ? setQAResults : undefined}
						qaResults={qaResults}
					/>
				)}
			</div>
		</MessagesProvider>
	);
}
