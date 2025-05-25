import { forwardRef, useEffect, useRef, useState } from "react";
import { EditIcon } from "lucide-react";
import postTextCompletionAction from "@/endpointActions/postTextCompletionAction";
import { useAppDispatch, useAppSelector } from "@/rtk/store";
import useGetNWordsBefarPlateEditorCaret from "@/utils/hooks/getNWordsBefarPlateEditorCaret";
import { resetCurrentUserProject } from "@/rtk/slices/currentUserProject";
import postCreateAnswerBoxAction, {
	QABoxAnswerInterface,
} from "@/endpointActions/postCreateAnswerBoxAction";

const numOfWordsToFind = 10;

export const CompletionBtn = forwardRef<
	HTMLDivElement,
	{ openPopup: () => void; setCompletionText: (text: string) => void }
>((props, ref) => {
	const currentUserProject = useAppSelector(
		(state) => state.currentUserProject
	);
	const [qaResults, setQAResults] = useState<QABoxAnswerInterface[]>([]);
	const isActiveResources = useAppSelector((state) => state.isActiveResources);
	const appDispatch = useAppDispatch();
	const getNWordsBefarePlateEditoCaret = useGetNWordsBefarPlateEditorCaret();
	const wordsBeforeCaretRef = useRef(
		getNWordsBefarePlateEditoCaret(numOfWordsToFind)
	);

	useEffect(() => {
		isActiveResources &&
			wordsBeforeCaretRef.current &&
			postCreateAnswerBoxAction({
				qaBoxId: currentUserProject.value.qaBox,
				query: wordsBeforeCaretRef.current,
			}).then((res) => {
				setQAResults(res.data.slice(0, 2));
			});
	}, []);

	return (
		<div
			ref={ref}
			className="absolute z-10 pt-[1px] bg-transparent pointer-events-none transition-all duration-300"
			onMouseDown={(e) => {
				e.preventDefault();
			}}
		>
			{isActiveResources && qaResults.length > 0 && (
				<div className="mb-2 p-3 bg-main rounded-lg shadow-lg border-2 border-action/20 pointer-events-auto max-h-[200px] w-64 text-sm text-primary overflow-x-hidden overflow-y-auto scrollbar-custom">
					{qaResults.map((qaResult, i) => (
						<div
							key={i}
							className="p-2 hover:bg-action/5 rounded-md transition-colors duration-200 cursor-pointer mb-1 last:mb-0"
						>
							{qaResult[0]}
						</div>
					))}
				</div>
			)}
			<button
				className="flex items-center gap-2 px-3 py-2 bg-action/10 hover:bg-action/20 rounded-md pointer-events-auto cursor-pointer transition-all duration-200 hover:shadow-md group"
				onClick={() => {
					const textToComplete = wordsBeforeCaretRef.current;
					if (textToComplete) {
						console.log(textToComplete, "textToComplete");
						postTextCompletionAction({
							original_text: textToComplete,
							project:
								currentUserProject.value.id && currentUserProject.value.id,
						}).then((res) => {
							props.setCompletionText(res.data?.completion_text);
							let art = currentUserProject.value;
							appDispatch(
								resetCurrentUserProject({
									...art,
									used_credits: art.used_credits + res.data?.used_credits,
								})
							);
						});
					}
					props.openPopup();
				}}
			>
				<EditIcon className="w-4 h-4 text-action group-hover:rotate-12 transition-transform duration-200" />
				<span className="font-medium text-action text-sm tracking-wide">
					Complete
				</span>
			</button>
		</div>
	);
});
