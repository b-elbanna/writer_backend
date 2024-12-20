import { QABoxAnswerInterface } from "@/endpointActions/postCreateAnswerBoxAction";
import { BookUp2, CopyCheck, CopyIcon } from "lucide-react";
import React from "react";
import { SimpleTooltip } from "../simpleTooltip";

export default function QABoxResult({
	qaBoxResult,
}: {
	qaBoxResult: QABoxAnswerInterface;
}) {
	const [answerParagraph, relatedness, sourceName] = qaBoxResult;
	const divRef = React.useRef<HTMLParagraphElement>(null);
	const [isCopied, setIsCopied] = React.useState<boolean>(false);
	const handelCopyText = React.useCallback(() => {
		const textToCopy = divRef?.current?.textContent;
		textToCopy && navigator.clipboard.writeText(textToCopy);
	}, []);
	return (
		<div
			key={relatedness}
			className="shadow-xl w-fit max-w-[90%] my-8 px-4 py-2 border-primary border-4 bg-main mx-auto  rounded-[8px] group"
		>
			<div ref={divRef} className="whitespace-pre-line overflow-x-auto">
				{answerParagraph} ||
			</div>
			<div className="flex gap-3 pt-2 justify-between">
				<p className="text-mygray text-sm ">
					{sourceName} || {relatedness}
				</p>
				<div className="flex gap-3">
					<SimpleTooltip delay={200} tooltip="Add to editor">
						<button
							onClick={() => {
								// handelAddToEditor();
							}}
						>
							<BookUp2
								size={20}
								className="stroke-action active:fill-primary "
							/>
						</button>
					</SimpleTooltip>

					<SimpleTooltip delay={0} tooltip={isCopied ? "Copied" : "Copy text"}>
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
	);
}
