"use client";
import { SendHorizonalIcon } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { LastMessageContext } from "./MessagesProvider";
import { RecordView } from "./reactMicButton";
import { soketUrl } from "@/baseApis/base";
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";
import { useAppDispatch, useAppSelector } from "@/rtk/store";
import prepareSocketMessagesReq from "@/utils/prepareChatSocketReq";
import postCreateAnswerBoxAction, {
	QABoxAnswerInterface,
} from "@/endpointActions/postCreateAnswerBoxAction";
import { setprojectOpenedToolId } from "@/rtk/slices/projectOpenedTool";
import { useEventListener } from "usehooks-ts";
type ChatInputProps = {
	chatId: string;
	setQAResults?: React.Dispatch<React.SetStateAction<QABoxAnswerInterface[]>>;
	qaResults?: QABoxAnswerInterface[];
	sendSocketMesssage: SendJsonMessage;
};

let answerSearchTimeOut: string | number | NodeJS.Timeout | undefined;

export default function ChatInput({
	chatId,
	setQAResults,
	qaResults,
	sendSocketMesssage,
}: ChatInputProps) {
	const socketUrl = `${soketUrl}chat/${chatId}`;
	const appDispatch = useAppDispatch();
	const currentUserProject = useAppSelector(
		(state) => state.currentUserProject
	);
	const currentTool = useAppSelector((state) => state.projectOpenedTool);
	const currentChat = useAppSelector((state) => state.currentUserChatbox);
	const contentEditableRef = useRef<HTMLDivElement>(null);
	const [inputContent, changeInputContet] = React.useState<string>("");
	const [placeholderContent, setPlaceholder] =
		React.useState<string>("ask me anything");
	const [lastChatMessage, setLastChatMessage] =
		React.useContext(LastMessageContext);

	const handelBlurEvent = () => {
		(!contentEditableRef.current?.innerText ||
			contentEditableRef.current?.innerHTML == "<br>") &&
			setPlaceholder("ask me anything");
	};
	const handelSendButton = () => {
		if (setQAResults) setQAResults([]);

		if (!chatId) chatId = currentUserProject.value.chatbox;
		if (inputContent && contentEditableRef.current && chatId) {
			const tt = new Date().toString();
			let lastUserMess: ChatboxMessageInterace = {
				id: tt,
				user_msg: inputContent,
				assistant_msg: "",
				created_at: tt,
			};
			let reqMess: ChatboxMessageInterace[] = [];
			if (currentChat.chatbox.messages)
				reqMess = [...currentChat.chatbox.messages, lastUserMess];
			else reqMess = [lastUserMess];

			setLastChatMessage(lastUserMess);

			if (setQAResults && currentTool.id === 2 && qaResults?.length) {
				sendSocketMesssage({
					messages: prepareSocketMessagesReq(reqMess),
					model: "gpt_4",
					source_text: qaResults.reduce(
						(acc, cur, i) => (i < 4 ? acc + cur[0] + ".\n" : ""),
						""
					),
				});
			} else {
				sendSocketMesssage({
					messages: prepareSocketMessagesReq(reqMess),
					model: "gpt_4",
				});
			}

			changeInputContet("");
			contentEditableRef.current.textContent = "";
		}
	};

	const handleKeyDownEvent = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.key === "Enter" && !event.shiftKey) {
			event.preventDefault();
			handelSendButton();
			setPlaceholder("ask me anything");
		}
	};

	const handelOnChangeEvent = () => {
		let inputTextContent = contentEditableRef.current?.textContent;
		if (inputTextContent !== inputContent)
			changeInputContet(inputTextContent || "");
		if (answerSearchTimeOut) clearTimeout(answerSearchTimeOut);
		if (setQAResults) {
			if (currentTool.id === 2) {
				!inputTextContent?.length && setQAResults([]);
				answerSearchTimeOut = setTimeout(() => {
					inputTextContent = contentEditableRef.current?.textContent;
					inputTextContent?.length
						? postCreateAnswerBoxAction({
								qaBoxId: currentUserProject.value.qaBox,
								query: inputTextContent,
						  }).then((res) => {
								setQAResults(res.data);
						  })
						: setQAResults([]);
				}, 500);
			}
		}
	};
	useEventListener(
		"focus",
		() => !currentTool.id && appDispatch(setprojectOpenedToolId(1)),
		contentEditableRef
	);

	useEffect(() => {
		if (contentEditableRef?.current?.textContent) {
			if (
				contentEditableRef?.current?.textContent?.trim().length < 1 ||
				inputContent.trim().length < 1
			) {
				setPlaceholder("ask me anything");
			} else setPlaceholder("");
		}
	}, [inputContent]);

	return (
		<div className=" absolute bottom-0 bg-gradient-to-t from-white to-transparent w-full px-10  pt-4 pb-4 z-20  ">
			<div className="flex items-center justify-center rounded-3xl p-2 shadow-2xl bg-primary m-auto">
				<RecordView
					inputRef={contentEditableRef}
					setPlaceholder={setPlaceholder}
				/>

				<div className={`flex items-center relative grow    overflow-hidden  `}>
					<div
						className="block  w-full rounded-[20px] border bg-main  max-h-[200px] py-3 px-4 overflow-y-auto scrollbar-hide focus:outline-none"
						ref={contentEditableRef}
						onKeyDown={handleKeyDownEvent}
						onChange={handelOnChangeEvent}
						contentEditable
						onInput={handelOnChangeEvent}
						onFocus={(e) => {
							setPlaceholder("");
							changeInputContet(e.target.textContent || "");
						}}
						onBlur={handelBlurEvent}
					></div>
					<p
						onMouseEnter={() => contentEditableRef.current?.focus()}
						className="text-mygray   absolute top-1/2 left-0 py-3 px-4  -translate-y-1/2  block"
					>
						{placeholderContent}
					</p>
					<button
						disabled={!inputContent}
						onClick={handelSendButton}
						className={` ${
							inputContent
								? " text-action hover:bg-primary hover:text-main   active:bg-primary  active:text-white"
								: " text-white"
						}  focus: flex items-center  justify-center py-1 px-2 `}
					>
						<SendHorizonalIcon size={26} />
					</button>
				</div>
			</div>
		</div>
	);
}
const PlaceHolder = ({ message }: { message: string }) => {
	return (
		<p className="text-mygray   absolute top-1/2 left-0 py-3 px-4  -translate-y-1/2  block">
			{message}
		</p>
	);
};

// make messages socket request
