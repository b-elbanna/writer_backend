import React, { useEffect, useRef, useState } from "react";
import { useEditorState } from "@udecode/plate-common/react";

import { CompletionPopup } from "./completionPopup";
import { CompletionBtn } from "./completionBtn";

export default function CompletionPopover() {
	const ref = useRef<HTMLButtonElement>(null);
	const editorState = useEditorState();
	const [completionPopup, setCompletionPopup] = useState(false);
	const [completionText, setCompletionText] = useState("");

	useEffect(() => {
		const popupEL = ref?.current;

		if (popupEL) {
			popupEL.getBoundingClientRect();
			const selection = window.getSelection();

			if (selection?.type === "Caret") {
				// x,y represents the position of the caret relative to the editor
				let x = 0;
				let y = 0;
				if (selection?.rangeCount) {
					const range = selection.getRangeAt(0);

					const rect =
						range.getClientRects().length > 1
							? range.getClientRects()[1]
							: range.getClientRects()[0];
					const editorEl = popupEL.parentElement;
					const editorRect = editorEl?.getBoundingClientRect();

					if (editorRect && rect && editorEl) {
						x = rect.left - editorRect.left + 1;
						y =
							rect.top -
							editorRect.top +
							editorEl?.scrollTop +
							rect.height / 2 -
							popupEL.clientHeight / 2;

						if (x > editorRect.width - popupEL.clientWidth) {
							x = editorRect.width - popupEL.clientWidth - 18;
							y = y + popupEL.clientHeight;
						}

						popupEL.style.top = `${y}px`;
						popupEL.style.left = `${x}px`;
						// if (y > editorRect.height - popupEL.clientHeight - 15) {
						// 	// popupEL.style.bottom = ;
						// 	popupEL.style.top = `${y - popupEL.clientHeight}px`;
						// }
					}
					console.log(x, y);
				}
			} else {
				popupEL.style.display = "none";
			}
		}
	}, [completionPopup, editorState.children, editorState.selection, ref]);
	return completionPopup ? (
		<CompletionPopup
			ref={ref}
			closePopup={() => setCompletionPopup(false)}
			completionText={completionText}
		/>
	) : (
		<CompletionBtn
			ref={ref}
			openPopup={() => setCompletionPopup(true)}
			setCompletionText={setCompletionText}
		/>
	);
}
