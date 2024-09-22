import { Range, Node } from "slate";
import { useEditorRef } from "@udecode/plate-common/react";
export default function useGetNWordsBefarPlateEditorCaret() {
	const editor = useEditorRef();

	const getNWordsBefarePlateEditoCaret = (numOfWordsToFind: number) => {
		const { selection } = editor;
		const offset = selection?.anchor?.offset;
		const path = selection?.anchor?.path;
		if (selection && path) {
			const [start] = Range.edges(selection);

			const nodePath = start.path.slice(0, start.path.length - 1);
			const cursorNode = editor.node(start);
			let fullNode = (
				editor.node(nodePath)[0] as {
					type: string;
					children: { text: string }[];
				}
			).children;
			let preText: string[] = [];
			fullNode.forEach((e) => {
				preText.push(e.text);
			});

			const text = Node.string(cursorNode[0]).slice(0, offset);
			const fullText = preText.slice(0, -1).join(" ") + text;
			console.log(fullText);
			let legalText = fullText
				.split(" ")
				.filter((e) => e !== "")
				.slice(-numOfWordsToFind)
				.join(" ");
			let legalTextNumber = legalText.split(" ").length;
			let childNumber = start.path[0];

			while (legalTextNumber < numOfWordsToFind && childNumber > 0) {
				let preNodeText = Node.string(editor.children[childNumber - 1])
					.split(" ")
					.filter((e) => e !== "")
					.slice(legalTextNumber - numOfWordsToFind)
					.join(" ");
				legalText = preNodeText + " " + legalText;

				legalTextNumber = legalText.split(" ").length;
				childNumber -= 1;
			}
			return legalText;
		}

		return undefined;
	};

	return getNWordsBefarePlateEditoCaret;
}
