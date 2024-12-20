import ChatBox from "@/components/chat/chatbox";
import MainEditor from "@/components/editor/mainEditor";
import QABox from "@/components/qabox/qabox";
import { getCurrentUserChatbox } from "@/rtk/slices/currentUserChat";
import { useAppDispatch, useAppSelector } from "@/rtk/store";
import { useEffect } from "react";

export default function ActiveToolPage() {
	const openedTool = useAppSelector((state) => state.projectOpenedTool);
	const currentUserProject = useAppSelector(
		(state) => state.currentUserProject
	);
	// const currentChatbox = useAppSelector((state) => state.currentUserChatbox);
	// const appDispatch = useAppDispatch();
	// useEffect(() => {
	// 	if (!currentChatbox.chatbox.messages) {
	// 		appDispatch(
	// 			getCurrentUserChatbox({ chatboxId: currentUserProject.value.chatbox })
	// 		);
	// 	}
	// }, [currentUserProject]);
	return (
		<>
			<MainEditor
				className={`${openedTool.id && "hidden"} overflow-hidden rounded `}
			/>
			<ChatBox className={`${openedTool.id !== 1 && "hidden"} `} />
			{currentUserProject.value.qaBox ? (
				<QABox
					className={`${openedTool.id !== 2 && "hidden"} `}
					id={currentUserProject.value.qaBox}
				/>
			) : (
				<div>this project has no qa box</div>
			)}
		</>
	);
	// if (openedTool.id === 0)
	// 	return (
	// 		<MainEditor className={`$ overflow-hidden rounded border-4 border-primary`} />
	// 	);
	// if (openedTool.id === 1)
	// 	return <ChatBox chatId={currentUserProject.value.chatbox} />;
	// if (openedTool.id === 2) {
	// 	let qaIds = currentUserProject.value.qaBoxes;
	// 	return qaIds?.length ? (
	// 		<QABox id={qaIds[0]} />
	// 	) : (
	// 		<div>this project has no qa box</div>
	// 	);
	// }
}
