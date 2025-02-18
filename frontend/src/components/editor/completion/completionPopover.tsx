import React, { useEffect, useRef, useState } from "react";
import { useEditorState } from "@udecode/plate/react";

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

					// if (
					// 	rect &&
					// 	popupEL.clientHeight < rect.height &&
					// 	popupEL.classList.contains("popover_content")
					// ) {
					// 	// make the btn height equal to the selection height
					// 	popupEL.style.height = `${rect.height}px`;
					// 	let font = rect.height < 30 ? rect.height - 12 : rect.height - 18;

					// 	popupEL.style.fontSize = `${font}px`;
					// }
					if (editorRect && rect && editorEl) {
						x = rect.left - editorRect.left;
						y = rect.bottom - editorRect.top + editorEl?.scrollTop;

						// if the popup is going out of the editor horizontally
						if (x > editorRect.width - popupEL.clientWidth - 56) {
							popoverPosition.top = y;
							popupEL.style.bottom = `${
								editorEl.clientHeight - popoverPosition.top
							}px`;
							popupEL.style.right = `${56}px`;
						} else {
							// to get the popup position in the middle of the caret vertically
							// popoverPosition.top =
							// 	y - popupEL.clientHeight / 2 + rect.height / 2;

							popoverPosition.top = y;

							popoverPosition.left = x + rect.width / 2;

							popupEL.style.bottom = `${
								editorEl.clientHeight - popoverPosition.top
							}px`;
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
	}, [completionPopup, ref]);
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
