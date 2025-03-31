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
const beforeElClassNames = [
	"max-h-[100px] ",
	"bg-main",
	"p-2",
	"rounded-[8px]",
	"border-primary",
];

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
		// wordsBeforeCaretRef.current &&
		// 	setQAResults([
		// 		[
		// 			wordsBeforeCaretRef.current,
		// 			numOfWordsToFind,
		// 			"wordsBeforeCaretRef.current",
		// 		],
		// 	]);
	}, []);
	return (
		<div
			ref={ref}
			className={` popover_content   absolute z-10  pt-[1px] bg-transparent font-semibold   pointer-events-none duration-500 transition`}
			// before="true"
			onMouseDown={(e) => {
				e.preventDefault();
			}}
		>
			{isActiveResources && qaResults.length && (
				<div
					className={`${beforeElClassNames.join(
						" "
					)} leading-none pointer-events-auto  shadow font-normal w-52  text-xs border-[3px] text-primary overflow-x-hidden overflow-y-auto`}
				>
					{qaResults.map((qaResult, i) => (
						<div key={i} className="">
							{qaResult[0]}
						</div>
					))}
				</div>
			)}
			<button
				className="flex items-end border-s-active border-s-2 pointer-events-auto   cursor-pointer gap-[1px]"
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
							// art.used_credits = res.data?.used_credits;
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
				<EditIcon fill="white" className="text-active" />
				<div className="bg-white text-active leading-none rounded-full tracking-[1px] capitalize">
					complete
				</div>
			</button>
		</div>
	);
});
