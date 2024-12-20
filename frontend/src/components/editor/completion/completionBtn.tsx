import { forwardRef } from "react";
import { EditIcon } from "lucide-react";
import postTextCompletionAction from "@/endpointActions/postTextCompletionAction";
import { useAppDispatch, useAppSelector } from "@/rtk/store";
import useGetNWordsBefarPlateEditorCaret from "@/utils/hooks/getNWordsBefarPlateEditorCaret";
import { resetCurrentUserProject } from "@/rtk/slices/currentUserProject";

const numOfWordsToFind = 100;

export const CompletionBtn = forwardRef<
	HTMLDivElement,
	{ openPopup: () => void; setCompletionText: (text: string) => void }
>((props, ref) => {
	const currentUserProject = useAppSelector(
		(state) => state.currentUserProject
	);
	const appDispatch = useAppDispatch();
	const getNWordsBefarePlateEditoCaret = useGetNWordsBefarPlateEditorCaret();
	return (
		<div
			ref={ref}
			className={
				" popover_content border-s-active border-s-2 leading-3  absolute z-10 hover:underline flex items-center justify-center gap-[1px] pt-[1px] bg-white font-semibold  text-active  tracking-[1px] capitalize pointer-events-auto   cursor-pointer duration-500 transition"
			}
			onMouseDown={(e) => {
				e.preventDefault();
			}}
			onClick={() => {
				const textToComplete = getNWordsBefarePlateEditoCaret(numOfWordsToFind);
				if (textToComplete) {
					console.log(textToComplete, "textToComplete");
					postTextCompletionAction({
						original_text: textToComplete,
						project: currentUserProject.value.id && currentUserProject.value.id,
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
			<EditIcon style={{ fontSize: "inherit" }} className="text-inherit" />
			<span>complete</span>
		</div>
	);
});
