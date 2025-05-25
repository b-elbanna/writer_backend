import { useEditorRef } from "@udecode/plate/react";
export default function useGetNWordsBefarPlateEditorCaret() {
	const editor = useEditorRef();
	editor.api.string();
	const getNWordsBefarePlateEditoCaret = (numOfWordsToFind: number) => {
		const currentNodePoint = editor.selection?.anchor;
		const text =
			currentNodePoint &&
			editor.api.string({
				anchor: { path: [0], offset: 0 },
				focus: currentNodePoint,
			});

		return text?.split(" ").slice(-numOfWordsToFind).join(" ") || "";
	};

	return getNWordsBefarePlateEditoCaret;
}
