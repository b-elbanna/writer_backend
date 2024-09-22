"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@udecode/cn";

import { ParagraphPlugin, Plate } from "@udecode/plate-common/react";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { CursorOverlay } from "@/components/plate-ui/cursor-overlay";
import { Editor } from "@/components/plate-ui/editor";
import { FixedToolbar } from "@/components/plate-ui/fixed-toolbar";
import { FixedToolbarButtons } from "@/components/plate-ui/fixed-toolbar-buttons";

import { TooltipProvider } from "@/components/plate-ui/tooltip";
import buildEditor from "./editorBuilder";
import { useAppDispatch, useAppSelector } from "@/rtk/store";
import { updateUserProject } from "@/rtk/slices/currentUserProject";
import CompletionPopover from "./completion/completionPopover";
import { isEditorFocused } from "@udecode/slate-react";

const initialvalue = [
	{
		id: "1",
		type: ParagraphPlugin.key,
		children: [{ text: "" }],
	},
];
let timer: string | number | NodeJS.Timeout | undefined;
let timer1: string | number | NodeJS.Timeout | undefined;

export default function MainEditor({ className }: { className?: string }) {
	const currentUserProject = useAppSelector(
		(state) => state.currentUserProject
	);
	const [rewritePopoverVisaiblity, setRewritePopoverVisaiblity] =
		useState(false);
	const appDispatch = useAppDispatch();

	const editor = useMemo(() => {
		console.log("### rendering Editor..... ");
		if (currentUserProject.value.article) {
			return buildEditor(JSON.parse(currentUserProject.value.article));
		} else {
			return buildEditor(initialvalue);
		}
	}, []);
	const containerRef = useRef<HTMLDivElement>(null);
	// const [value, setValue] = useState(initialvalue);
	const saveArticle = () => {
		let articleBody = JSON.stringify([...editor.children]);
		// setCurrentText(serializeNodesToText(editor.children));
		console.log("saving article...");
		appDispatch(
			updateUserProject({
				projectBody: articleBody,
				projectId: currentUserProject.value.id,
			})
		);
	};

	return (
		<div className={`h-full w-full ${className}`}>
			<DndProvider backend={HTML5Backend}>
				<TooltipProvider>
					<Plate
						onChange={() => {
							setRewritePopoverVisaiblity(false);
							if (timer1) clearTimeout(timer1);
							timer1 = setTimeout(() => {
								setRewritePopoverVisaiblity(true);
							}, 1000);
						}}
						onValueChange={(e) => {
							console.log(e.editor.children);
							if (timer) clearTimeout(timer);
							timer = setTimeout(() => {
								if (currentUserProject.value.id) saveArticle();
							}, 2000);
						}}
						editor={editor}
					>
						<div
							ref={containerRef}
							className={cn(
								`relative flex flex-col h-full  `,
								// Block selection
								"[&_.slate-start-area-left]:!w-[64px] [&_.slate-start-area-right]:!w-[64px] [&_.slate-start-area-top]:!h-4"
							)}
						>
							<FixedToolbar>
								<FixedToolbarButtons />
							</FixedToolbar>

							<Editor
								className="p-4 h-full overflow-x-hidden overflow-y-auto  border border-slate-300"
								focusRing={false}
								variant="ghost"
								size="md"
								// placeholder="Start writing..."
							>
								{rewritePopoverVisaiblity &&
									editor.children.length > 2 &&
									isEditorFocused(editor) && <CompletionPopover />}
							</Editor>

							<CursorOverlay containerRef={containerRef} />
						</div>
					</Plate>
				</TooltipProvider>
			</DndProvider>
		</div>
	);
}
