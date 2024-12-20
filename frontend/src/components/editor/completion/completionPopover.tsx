import React, { useEffect, useRef, useState } from "react";
import { useEditorState } from "@udecode/plate-common/react";

import { CompletionPopup } from "./completionPopup";
import { CompletionBtn } from "./completionBtn";

export default function CompletionPopover() {
	const ref = useRef<HTMLDivElement>(null);
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
				let popoverPosition = { top: y, left: x };
				if (selection?.rangeCount) {
					const range = selection.getRangeAt(0);

					const rect =
						range.getClientRects().length > 1
							? range.getClientRects()[1]
							: range.getClientRects()[0];
					const editorEl = popupEL.parentElement;
					const editorRect = editorEl?.getBoundingClientRect();

					// make the popup height equal to the selection height
					if (
						rect &&
						popupEL.clientHeight < rect.height &&
						popupEL.classList.contains("popover_content")
					) {
						popupEL.style.height = `${rect.height}px`;
						let font = rect.height < 30 ? rect.height - 12 : rect.height - 15;

						popupEL.style.fontSize = `${font}px`;
					}
					if (editorRect && rect && editorEl) {
						x = rect.left - editorRect.left;
						y = rect.top - editorRect.top + editorEl?.scrollTop;

						if (x > editorRect.width - popupEL.clientWidth - 56) {
							popoverPosition.top = y + rect.height;
							popupEL.style.top = `${popoverPosition.top}px`;
							popupEL.style.right = `${56}px`;
						} else {
							popoverPosition.top =
								y - popupEL.clientHeight / 2 + rect.height / 2;

							popoverPosition.left = x + rect.width / 2;
							popupEL.style.top = `${popoverPosition.top}px`;
							popupEL.style.left = `${popoverPosition.left}px`;
						}

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
