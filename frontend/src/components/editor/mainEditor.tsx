"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
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
import { setprojectOpenedToolId } from "@/rtk/slices/projectOpenedTool";

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
	const currentTool = useAppSelector((state) => state.projectOpenedTool);
	const [rewritePopoverVisaiblity, setRewritePopoverVisaiblity] =
		useState(false);
	const appDispatch = useAppDispatch();

	const editor = useMemo(() => {
		console.log("### rendering Editor..... ");
		if (currentUserProject.value.article) {
			return buildEditor(currentUserProject.value.article);
		} else {
			return buildEditor(initialvalue);
		}
	}, []);
	const containerRef = useRef<HTMLDivElement>(null);
	const saveArticle = useCallback(() => {
		console.log("saving article...");
		appDispatch(
			updateUserProject({
				projectBody: editor.children,
				projectId: currentUserProject.value.id,
			})
		);
	}, []);

	return (
		<div className={`h-full w-full ${className}`}>
			<DndProvider backend={HTML5Backend}>
				<TooltipProvider>
					<Plate
						onChange={(e) => {
							setRewritePopoverVisaiblity(false);
							if (timer1) clearTimeout(timer1);
							timer1 = setTimeout(() => {
								setRewritePopoverVisaiblity(true);
								// if (currentUserProject.value.id) saveArticle();
							}, 1500);
						}}
						onValueChange={(e) => {
							// console.log(normalizeEditor(e.editor));
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
								`relative flex flex-col h-full overflow-hidden  `,
								// Block selection
								"[&_.slate-start-area-left]:!w-[64px] [&_.slate-start-area-right]:!w-[64px] [&_.slate-start-area-top]:!h-4"
							)}
						>
							<FixedToolbar className=" backdrop-blur-md bg-main shrink-0 overflow-hidden">
								<FixedToolbarButtons />
							</FixedToolbar>

							<Editor
								className="p-11 min-h-full  shadow-lg  bg-white"
								focusRing={false}
								variant="ghost"
								onFocus={() =>
									currentTool.id && appDispatch(setprojectOpenedToolId(0))
								}
								size="md"
								// placeholder="Start writing..."
							>
								{rewritePopoverVisaiblity &&
									editor.string([0]).length > 1 &&
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
