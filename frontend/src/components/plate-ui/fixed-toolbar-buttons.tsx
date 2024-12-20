import React from "react";
import {
	BoldPlugin,
	CodePlugin,
	ItalicPlugin,
	StrikethroughPlugin,
	UnderlinePlugin,
} from "@udecode/plate-basic-marks/react";
import { useEditorReadOnly } from "@udecode/plate-common/react";
import {
	FontBackgroundColorPlugin,
	FontColorPlugin,
} from "@udecode/plate-font/react";
import { ListStyleType } from "@udecode/plate-indent-list";
import {
	AudioPlugin,
	FilePlugin,
	ImagePlugin,
	MediaEmbedPlugin,
	VideoPlugin,
} from "@udecode/plate-media/react";

import { Icons, iconVariants } from "@/components/icons";
import { AlignDropdownMenu } from "@/components/plate-ui/align-dropdown-menu";
import { EmojiDropdownMenu } from "@/components/plate-ui/emoji-dropdown-menu";
import { IndentListToolbarButton } from "@/components/plate-ui/indent-list-toolbar-button";
import { IndentToolbarButton } from "@/components/plate-ui/indent-toolbar-button";

import { LineHeightDropdownMenu } from "@/components/plate-ui/line-height-dropdown-menu";
import { LinkToolbarButton } from "@/components/plate-ui/link-toolbar-button";
import { MediaToolbarButton } from "@/components/plate-ui/media-toolbar-button";
import { MoreDropdownMenu } from "@/components/plate-ui/more-dropdown-menu";
import { OutdentToolbarButton } from "@/components/plate-ui/outdent-toolbar-button";
import { TableDropdownMenu } from "@/components/plate-ui/table-dropdown-menu";

import { ColorDropdownMenu } from "./color-dropdown-menu";
import { InsertDropdownMenu } from "./insert-dropdown-menu";
import { MarkToolbarButton } from "./mark-toolbar-button";
import { ModeDropdownMenu } from "./mode-dropdown-menu";
import { ToolbarGroup } from "./toolbar";
import { TurnIntoDropdownMenu } from "./turn-into-dropdown-menu";
import { CodeBlockToolbarButton } from "./code-bock-button";
import { ExportToolbarButton } from "./export-toolbar-button";
import { ArrowUpToLineIcon } from "lucide-react";

// https://github.com/udecode/plate-playground-template/blob/main/src/components/plate-ui/fixed-toolbar-buttons.tsxhttps://github.com/udecode/plate-playground-template/blob/main/src/components/plate-ui/fixed-toolbar-buttons.tsx
export function FixedToolbarButtons() {
	const readOnly = useEditorReadOnly();

	return (
		<div className="w-full overflow-hidden overflow-x-auto p-1 ">
			<div
				className="flex flex-wrap justify-between "
				style={{
					transform: "translateX(calc(-1px))",
				}}
			>
				{!readOnly && (
					<>
						<ToolbarGroup>
							<InsertDropdownMenu />
							<TurnIntoDropdownMenu />
						</ToolbarGroup>
						<ToolbarGroup>
							<ExportToolbarButton>
								<ArrowUpToLineIcon />
							</ExportToolbarButton>
						</ToolbarGroup>

						<ToolbarGroup>
							<MarkToolbarButton nodeType={BoldPlugin.key} tooltip="Bold (⌘+B)">
								<Icons.bold />
							</MarkToolbarButton>
							<MarkToolbarButton
								nodeType={ItalicPlugin.key}
								tooltip="Italic (⌘+I)"
							>
								<Icons.italic />
							</MarkToolbarButton>
							<MarkToolbarButton
								nodeType={UnderlinePlugin.key}
								tooltip="Underline (⌘+U)"
							>
								<Icons.underline />
							</MarkToolbarButton>

							<MarkToolbarButton
								nodeType={StrikethroughPlugin.key}
								tooltip="Strikethrough (⌘+⇧+M)"
							>
								<Icons.strikethrough />
							</MarkToolbarButton>
							<MarkToolbarButton nodeType={CodePlugin.key} tooltip="Code (⌘+E)">
								<Icons.code />
							</MarkToolbarButton>
						</ToolbarGroup>

						<ToolbarGroup>
							<ColorDropdownMenu
								nodeType={FontColorPlugin.key}
								tooltip="Text Color"
							>
								<Icons.color className={iconVariants({ variant: "toolbar" })} />
							</ColorDropdownMenu>
							<ColorDropdownMenu
								nodeType={FontBackgroundColorPlugin.key}
								tooltip="Highlight Color"
							>
								<Icons.bg className={iconVariants({ variant: "toolbar" })} />
							</ColorDropdownMenu>
						</ToolbarGroup>

						<ToolbarGroup>
							<AlignDropdownMenu />

							<LineHeightDropdownMenu />
						</ToolbarGroup>

						<ToolbarGroup>
							<IndentListToolbarButton nodeType={ListStyleType.Disc} />
							<IndentListToolbarButton nodeType={ListStyleType.Decimal} />

							{/* <TodoListToolbarButton nodeType={TodoListPlugin.key} /> */}
						</ToolbarGroup>

						<ToolbarGroup>
							<OutdentToolbarButton />
							<IndentToolbarButton />
						</ToolbarGroup>

						<ToolbarGroup>
							<CodeBlockToolbarButton />
							<LinkToolbarButton />
						</ToolbarGroup>
						<ToolbarGroup>
							<MediaToolbarButton nodeType={ImagePlugin.key} />
							<MediaToolbarButton nodeType={VideoPlugin.key} />
							<MediaToolbarButton nodeType={AudioPlugin.key} />
							<MediaToolbarButton nodeType={FilePlugin.key} />
						</ToolbarGroup>
						<ToolbarGroup>
							<TableDropdownMenu />

							<EmojiDropdownMenu />

							<MoreDropdownMenu />
						</ToolbarGroup>
					</>
				)}

				<div className="grow" />
				<ToolbarGroup>
					<ModeDropdownMenu />
				</ToolbarGroup>
			</div>
		</div>
	);
}
