import { BookUp2, BotIcon, CopyCheck, CopyIcon } from "lucide-react";
import React, { KeyboardEvent } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SimpleTooltip } from "../simpleTooltip";
export interface ChatMessageInterface {
	id?: string;
	role: "user" | "assistant" | "system";
	content: string;
	voice_message?: boolean;
	finish_reason?: "stop" | "length" | "content_filter" | null;
	created_at: string;
}

// npm install remark-gfm

export default function AssistantMessage({
	message,
}: {
	message: ChatMessageInterface;
}) {
	const MemoizedMessage = React.useMemo(
		// https://retool.com/blog/react-markdown-component-the-easy-way-to-create-rich-text

		() => <Markdown remarkPlugins={[remarkGfm]}>{message.content}</Markdown>,
		[]
	);
	const pRef = React.useRef<HTMLParagraphElement>(null);
	// editor.insertText("hello");
	const [isCopied, setIsCopied] = React.useState<boolean>(false);
	const handelCopyText = React.useCallback(() => {
		const textToCopy = pRef?.current?.textContent;
		textToCopy && navigator.clipboard.writeText(textToCopy);
	}, []);

	const preventScrolling = (e: KeyboardEvent) => {
		if (e.key == "ArrowRight" || e.key == "ArrowLeft") {
			e.preventDefault();
		}
	};
	const handelAddToEditor = React.useCallback(() => {
		const editorText = pRef?.current?.textContent;
		console.log(editorText);

		// dispatch(addText(content));
	}, [message]);
	return (
		<>
			{message && (
				<div className="relative shadow-xl w-fit max-w-[90%] my-8 px-4 py-2 border-primary border-4 bg-main  rounded-[0_8px_8px] group">
					<div className=" pb-1 w-fit left-0 top-[-1px] -translate-y-full absolute  rounded-full ">
						<BotIcon
							size={30}
							strokeWidth={2}
							className="   dark:fill-white "
						/>
					</div>
					<div ref={pRef} className="whitespace-pre-line overflow-x-auto">
						{MemoizedMessage}
						{message.finish_reason}
					</div>
					{/* <Button onKeyDown={(e) => { preventScrolling(e) }} variant="outlined" className="!ml-auto !block transition-opacity !duration-100 opacity-0 group-hover:opacity-100" onClick={handelCopyText}>copyText</Button> */}
					<div className="flex gap-3 pt-2 justify-between">
						<p className="text-mygray text-sm ">
							{message.created_at &&
								new Date(message.created_at).toLocaleString()}
						</p>
						<div className="flex gap-3">
							<SimpleTooltip delay={200} tooltip="Add to editor">
								<button
									onClick={() => {
										handelAddToEditor();
									}}
									onKeyDown={preventScrolling}
								>
									<BookUp2
										size={20}
										className="stroke-action active:fill-primary "
									/>
								</button>
							</SimpleTooltip>

							<SimpleTooltip
								delay={0}
								tooltip={isCopied ? "Copied" : "Copy text"}
							>
								<button
									onClick={() => {
										handelCopyText();
										if (!isCopied) {
											setIsCopied(true);
										}
										setTimeout(() => {
											setIsCopied(false);
										}, 2000);
									}}
									onKeyDown={preventScrolling}
								>
									{isCopied ? (
										<CopyCheck size={20} className="stroke-action " />
									) : (
										<CopyIcon
											size={20}
											className="stroke-action active:fill-action "
										/>
									)}
								</button>
							</SimpleTooltip>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
