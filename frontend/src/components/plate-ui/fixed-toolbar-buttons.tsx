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
import { ImagePlugin, MediaEmbedPlugin } from "@udecode/plate-media/react";

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

export function FixedToolbarButtons() {
	const readOnly = useEditorReadOnly();

	return (
		<div className="w-full overflow-hidden">
			<div
				className="flex flex-wrap justify-between"
				style={{
					transform: "translateX(calc(-1px))",
				}}
			>
				{!readOnly && (
					<>
						<ToolbarGroup noSeparator>
							<InsertDropdownMenu />
							<TurnIntoDropdownMenu />
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

						<ToolbarGroup noSeparator>
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

						<ToolbarGroup noSeparator>
							<AlignDropdownMenu />

							<LineHeightDropdownMenu />
						</ToolbarGroup>

						<ToolbarGroup noSeparator>
							<IndentListToolbarButton nodeType={ListStyleType.Disc} />
							<IndentListToolbarButton nodeType={ListStyleType.Decimal} />

							{/* <TodoListToolbarButton nodeType={TodoListPlugin.key} /> */}
						</ToolbarGroup>

						<ToolbarGroup noSeparator>
							<OutdentToolbarButton />
							<IndentToolbarButton />
						</ToolbarGroup>

						<ToolbarGroup noSeparator>
							<CodeBlockToolbarButton />
							<LinkToolbarButton />

							<MediaToolbarButton nodeType={ImagePlugin.key} />
							<MediaToolbarButton nodeType={MediaEmbedPlugin.key} />
						</ToolbarGroup>
						<ToolbarGroup noSeparator>
							<TableDropdownMenu />

							<EmojiDropdownMenu />

							<MoreDropdownMenu />
						</ToolbarGroup>
					</>
				)}

				<div className="grow" />
				<ToolbarGroup noSeparator>
					<ModeDropdownMenu />
				</ToolbarGroup>
			</div>
		</div>
	);
}
