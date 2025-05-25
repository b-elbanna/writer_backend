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
			className="absolute w-[350px] -mb-1    z-50"
		>
			<div
				className={`${
					props.completionText ? "bg-white" : "bg-transparent"
				} rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3 transition-all duration-200`}
			>
				{props.completionText ? (
					<p className="text-sm text-gray-800 max-h-32 overflow-y-auto overflow-x-hidden dark:text-gray-200 leading-relaxed">
						{props.completionText}
					</p>
				) : (
					<div className="flex justify-center items-center p-2">
						<SmileFaceLoader className="!w-[40px] !h-[40px]" />
					</div>
				)}
			</div>
			{props.completionText && (
				<button
					onClick={handleOnClick}
					className="absolute -right-2 -bottom-2 pointer-events-auto p-2 rounded-full bg-action hover:bg-hover text-white shadow-lg transform transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-action"
				>
					<ListPlusIcon size={18} className="stroke-[2.5]" />
				</button>
			)}
		</div>
	);
});
