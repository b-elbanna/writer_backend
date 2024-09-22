import { forwardRef } from "react";
import { EditIcon } from "lucide-react";
import postTextCompletionAction from "@/endpointActions/postTextCompletionAction";
import { useAppDispatch, useAppSelector } from "@/rtk/store";
import useGetNWordsBefarPlateEditorCaret from "@/utils/hooks/getNWordsBefarPlateEditorCaret";
import { resetCurrentUserProject } from "@/rtk/slices/currentUserProject";

const numOfWordsToFind = 100;

export const CompletionBtn = forwardRef<
	HTMLButtonElement,
	{ openPopup: () => void; setCompletionText: (text: string) => void }
>((props, ref) => {
	const currentUserProject = useAppSelector(
		(state) => state.currentUserProject
	);
	const appDispatch = useAppDispatch();
	const getNWordsBefarePlateEditoCaret = useGetNWordsBefarPlateEditorCaret();
	return (
		<button
			ref={ref}
			className={
				"text-sm absolute z-50 hover:underline flex items-center gap-[2px] py-[1px] px-[0px] bord-primary bg-white  rounded-md font-bold  text-active active:bg-black active:text-white tracking-[1px] uppercase pointer-events-auto   cursor-pointer duration-500 transition"
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
						project: currentUserProject.value.id,
					}).then((res) => {
						props.setCompletionText(res.data?.completion_text);
						let art = currentUserProject.value;
						// art.used_credits = res.data?.used_credits;
						appDispatch(
							resetCurrentUserProject({
								...art,
								used_credits: res.data?.used_credits,
							})
						);
					});
				}
				props.openPopup();
			}}
		>
			|
			<EditIcon size={20} />
			complete
		</button>
	);
});
