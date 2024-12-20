import { forwardRef, MouseEventHandler } from "react";
import { useEditorRef } from "@udecode/plate-common/react";
import { EditIcon, ListFilter, ListPlusIcon } from "lucide-react";

export const CompletionPopup = forwardRef<
	HTMLDivElement,
	{ closePopup: () => void; completionText: string }
>((props, ref) => {
	const editor = useEditorRef();

	const handleOnClick: MouseEventHandler = (e) => {
		e.preventDefault();
		editor.insertText(props.completionText);
		// editor.setSelection({});
		props.closePopup();
	};
	return props.completionText ? (
		<div
			ref={ref}
			onMouseDown={(e) => e.preventDefault()}
			onClick={handleOnClick}
			className={`${
				props.completionText && "hover:underline"
			}  w-52 translate-y-[8px] cursor-pointer text-sm items-center z-50 font-semibold text-main max-h-[100px] shadow-xl overflow-hidden opacity-1 absolute`}
		>
			<button className="bg-white  border-s-[3px] border-action ">
				<ListPlusIcon size={22} className="text-active" />
			</button>{" "}
			<p className="p-2 -mt-1 bg-primary rounded overflow-y-auto overflow-x-hidden ">
				{props.completionText}
			</p>
		</div>
	) : (
		<div
			ref={ref}
			className={` ps-1 border-s-[3px] border-action text-xl font-bold text-main w-52  py-1 bg-primary  shadow-lg opacity-1 absolute`}
		>
			laoding...
		</div>
	);
});
