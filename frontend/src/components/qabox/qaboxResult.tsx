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
		<div className="bg-gray-50 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-200">
			<div
				ref={divRef}
				className="text-sm text-gray-700 whitespace-pre-line break-words"
			>
				{answerParagraph}
			</div>
			<div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
				<p className="text-xs text-gray-500 flex items-center gap-2">
					<span className="font-medium">{sourceName}</span>
					<span className="text-gray-400">•</span>
					<span>Score: {relatedness}</span>
				</p>
				<div className="flex gap-2">
					<SimpleTooltip delay={200} tooltip="Add to editor">
						<button
							className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
							onClick={() => {
								// handelAddToEditor();
							}}
						>
							<BookUp2
								size={16}
								className="stroke-gray-600 active:stroke-primary"
							/>
						</button>
					</SimpleTooltip>

					<SimpleTooltip delay={0} tooltip={isCopied ? "Copied" : "Copy text"}>
						<button
							className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
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
								<CopyCheck size={16} className="stroke-green-600" />
							) : (
								<CopyIcon
									size={16}
									className="stroke-gray-600 active:stroke-primary"
								/>
							)}
						</button>
					</SimpleTooltip>
				</div>
			</div>
		</div>
	);
}
