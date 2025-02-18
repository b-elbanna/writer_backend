import { forwardRef, MouseEventHandler } from "react";
import { useEditorRef } from "@udecode/plate/react";
import { EditIcon, ListFilter, ListPlusIcon } from "lucide-react";
import SmileFaceLoader from "@/loaders/smileFace/smileFace";

export const CompletionPopup = forwardRef<
	HTMLDivElement,
	{ closePopup: () => void; completionText: string }
>((props, ref) => {
	const editor = useEditorRef();

	const handleOnClick: MouseEventHandler = (e) => {
		e.preventDefault();
		if (props.completionText) {
			const startPoints = editor.selection?.anchor;
			editor.tf.select(editor.selection?.anchor);
			editor.tf.insertText(props.completionText);
			const endPoints = editor.selection?.focus;
			startPoints &&
				endPoints &&
				editor.tf.select({ anchor: startPoints, focus: endPoints });
			props.closePopup();
		}
	};
	return (
		<div
			ref={ref}
			onMouseDown={(e) => e.preventDefault()}
			className={`${
				props.completionText && "hover:underline "
			}  w-52 -mb-1  text-sm items-center bg-transparent z-50 font-semibold text-main pointer-events-none  overflow-hidden opacity-1 absolute`}
		>
			<div className="p-2  bg-primary max-h-[100px] shadow-xl rounded overflow-y-auto overflow-x-hidden ">
				{props.completionText ? (
					<p>{props.completionText}</p>
				) : (
					<div className="flex justify-center items-center">
						<SmileFaceLoader className=" !w-[50px] !h-[50px]" />
					</div>
				)}
			</div>
			<button
				onClick={handleOnClick}
				className="cursor-pointer mt-2 pointer-events-auto -mb-1 bg-white shadow-md  border-s-[3px] border-action "
			>
				<ListPlusIcon size={22} className="text-active" />
			</button>{" "}
		</div>
	);
});
