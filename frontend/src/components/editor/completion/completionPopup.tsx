import { forwardRef } from "react";
import { useEditorRef } from "@udecode/plate-common/react";

export const CompletionPopup = forwardRef<
	HTMLButtonElement,
	{ closePopup: () => void; completionText: string }
>((props, ref) => {
	const editor = useEditorRef();
	const handleOnClick = () => {
		editor.insertText(props.completionText);
		props.closePopup();
	};
	return (
		<button
			ref={ref}
			onClick={handleOnClick}
			className={`${
				props.completionText && "hover:underline"
			} text-sm text-primary max-h-[100px] overflow-y-auto overflow-x-hidden py-1 bg-main  shadow-lg opacity-1 absolute`}
		>
			|{props.completionText ? props.completionText.trim() : "laoding..."}
		</button>
	);
});
