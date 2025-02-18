"use client";

import React from "react";
import { withProps } from "@udecode/cn";
import { AlignPlugin } from "@udecode/plate-alignment/react";
import {
	BoldPlugin,
	CodePlugin,
	ItalicPlugin,
	StrikethroughPlugin,
	SubscriptPlugin,
	SuperscriptPlugin,
	UnderlinePlugin,
} from "@udecode/plate-basic-marks/react";
import { BlockquotePlugin } from "@udecode/plate-block-quote/react";
import { ExitBreakPlugin, SoftBreakPlugin } from "@udecode/plate-break/react";
import { CaptionPlugin } from "@udecode/plate-caption/react";

import {
	CodeBlockPlugin,
	CodeLinePlugin,
	CodeSyntaxPlugin,
} from "@udecode/plate-code-block/react";

import { INDENT_LIST_KEYS, ListStyleType } from "@udecode/plate-indent-list";

import {
	createPlateEditor,
	ParagraphPlugin,
	PlateElement,
	PlateLeaf,
} from "@udecode/plate/react";
import { DndPlugin } from "@udecode/plate-dnd";
import { DocxPlugin } from "@udecode/plate-docx";
import { EmojiPlugin } from "@udecode/plate-emoji/react";
import {
	FontBackgroundColorPlugin,
	FontColorPlugin,
	FontSizePlugin,
} from "@udecode/plate-font/react";
import { HEADING_KEYS, HEADING_LEVELS } from "@udecode/plate-heading";
import { HeadingPlugin, TocPlugin } from "@udecode/plate-heading/react";
import { HighlightPlugin } from "@udecode/plate-highlight/react";
import { HorizontalRulePlugin } from "@udecode/plate-horizontal-rule/react";
import { IndentListPlugin } from "@udecode/plate-indent-list/react";
import { IndentPlugin } from "@udecode/plate-indent/react";
import { JuicePlugin } from "@udecode/plate-juice";
import { LineHeightPlugin } from "@udecode/plate-line-height/react";
import { LinkPlugin } from "@udecode/plate-link/react";
import {
	BulletedListPlugin,
	ListItemPlugin,
	ListPlugin,
	NumberedListPlugin,
	TodoListPlugin,
} from "@udecode/plate-list/react";
import { MarkdownPlugin } from "@udecode/plate-markdown";
import {
	AudioPlugin,
	FilePlugin,
	ImagePlugin,
	MediaEmbedPlugin,
	PlaceholderPlugin,
	VideoPlugin,
} from "@udecode/plate-media/react";
import { NodeIdPlugin } from "@udecode/plate-node-id";
import { SelectOnBackspacePlugin } from "@udecode/plate-select";
import {
	BlockMenuPlugin,
	BlockSelectionPlugin,
} from "@udecode/plate-selection/react";
import { TabbablePlugin } from "@udecode/plate-tabbable/react";
import {
	TableCellHeaderPlugin,
	TableCellPlugin,
	TablePlugin,
	TableRowPlugin,
} from "@udecode/plate-table/react";

import { ColumnGroupElement } from "@/components/plate-ui/column-group-element";
import { ColumnElement } from "@/components/plate-ui/column-element";

import { BlockquoteElement } from "@/components/plate-ui/blockquote-element";
import { CodeBlockElement } from "@/components/plate-ui/code-block-element";
import { CodeLeaf } from "@/components/plate-ui/code-leaf";
import { CodeLineElement } from "@/components/plate-ui/code-line-element";
import { CodeSyntaxLeaf } from "@/components/plate-ui/code-syntax-leaf";
import { CursorOverlayPlugin } from "@udecode/plate-selection/react";
import { HeadingElement } from "@/components/plate-ui/heading-element";
import { HighlightLeaf } from "@/components/plate-ui/highlight-leaf";
import { HrElement } from "@/components/plate-ui/hr-element";
import { ImageElement } from "@/components/plate-ui/image-element";
import { LinkElement } from "@/components/plate-ui/link-element";
import { LinkFloatingToolbar } from "@/components/plate-ui/link-floating-toolbar";
import { MediaEmbedElement } from "@/components/plate-ui/media-embed-element";
import { ParagraphElement } from "@/components/plate-ui/paragraph-element";
import { withPlaceholders } from "@/components/plate-ui/placeholder";
import {
	TableCellElement,
	TableCellHeaderElement,
} from "@/components/plate-ui/table-cell-element";
import { TableElement } from "@/components/plate-ui/table-element";
import { TableRowElement } from "@/components/plate-ui/table-row-element";
import { TodoListElement } from "@/components/plate-ui/todo-list-element";
import { KbdLeaf } from "@/components/plate-ui/kbd-leaf";
// import { withDraggables } from "@/components/plate-ui/with-draggables";
import Prism from "prismjs";
import {
	SlashInputPlugin,
	SlashPlugin,
} from "@udecode/plate-slash-command/react";
import { CsvPlugin } from "@udecode/plate-csv";
import { ImagePreview } from "@/components/plate-ui/image-preview";
import { MediaUploadToast } from "../plate-ui/media-upload-toast";
import { MediaAudioElement } from "../plate-ui/media-audio-element";
import { MediaFileElement } from "../plate-ui/media-file-element";
import { MediaPlaceholderElement } from "../plate-ui/media-placeholder-element";
import { MediaVideoElement } from "../plate-ui/media-video-element";
import { KbdPlugin } from "@udecode/plate-kbd/react";
import { EquationPlugin } from "@udecode/plate-math/react";
import { TogglePlugin } from "@udecode/plate-toggle/react";
import { ColumnPlugin, ColumnItemPlugin } from "@udecode/plate-layout/react";
import { CursorOverlay } from "../plate-ui/cursor-overlay";
import { SlashInputElement } from "../plate-ui/slash-input-element";
import { DraggableAboveNodes } from "../plate-ui/draggable";
import { ListElement } from "../plate-ui/list-element";
import { autoformatPlugins } from "@/lib/plate/autoformat-plugins";
import { FireLiComponent, FireMarker } from "../plate-ui/indent-fire-marker";
import { TodoLi, TodoMarker } from "../plate-ui/indent-todo-marker";
import { resetBlockTypePlugin } from "./resetRules";
import { ToggleElement } from "../plate-ui/toggle-element";
import { EquationElement } from "../plate-ui/equation-element";
import { TocElement } from "../plate-ui/toc-element";

export default function useMyEditor(initialValue: any) {
	const editor = createPlateEditor({
		plugins: [
			CursorOverlayPlugin.configure({
				render: { afterEditable: () => <CursorOverlay /> },
			}),

			// Nodes

			HeadingPlugin,
			BlockquotePlugin,
			CodeLinePlugin,
			CodeSyntaxPlugin,
			HorizontalRulePlugin,
			LinkPlugin.configure({
				render: { afterEditable: () => <LinkFloatingToolbar /> },
			}),
			// start Media Plugins
			ImagePlugin.extend({
				options: { disableUploadInsert: true },
				render: { afterEditable: ImagePreview },
			}),
			SelectOnBackspacePlugin.configure({
				options: {
					query: {
						allow: [
							HorizontalRulePlugin.key,
							ImagePlugin.key,
							VideoPlugin.key,
							AudioPlugin.key,
							FilePlugin.key,
							MediaEmbedPlugin.key,
						],
					},
				},
			}),

			MediaEmbedPlugin,
			VideoPlugin,
			AudioPlugin,
			FilePlugin,
			CaptionPlugin.configure({
				options: {
					plugins: [
						ImagePlugin,
						VideoPlugin,
						AudioPlugin,
						FilePlugin,
						MediaEmbedPlugin,
					],
				},
			}),
			TogglePlugin,
			ColumnPlugin,
			TocPlugin.configure({
				options: {
					topOffset: 80,
				},
			}),
			EquationPlugin,
			KbdPlugin,

			PlaceholderPlugin.configure({
				options: { disableEmptyPlaceholder: true },
				render: { afterEditable: MediaUploadToast },
			}),
			// end Media Plugins

			TablePlugin,
			TableRowPlugin,
			TableCellPlugin,
			TableCellHeaderPlugin,
			// lists
			TodoListPlugin,
			BulletedListPlugin,
			ListItemPlugin,
			ListPlugin,
			NumberedListPlugin,
			// Marks
			BoldPlugin,
			ItalicPlugin,
			UnderlinePlugin,
			StrikethroughPlugin,
			CodePlugin,
			CodeBlockPlugin.configure({
				options: {
					prism: Prism,
				},
			}),
			SubscriptPlugin,
			SuperscriptPlugin,
			FontColorPlugin,
			FontBackgroundColorPlugin,
			FontSizePlugin,
			HighlightPlugin,

			// Block Style
			AlignPlugin.configure({
				inject: {
					targetPlugins: [ParagraphPlugin.key, ...HEADING_LEVELS],
				},
			}),

			IndentPlugin.extend({
				inject: {
					targetPlugins: [
						ParagraphPlugin.key,
						...HEADING_LEVELS,
						BlockquotePlugin.key,
						CodeBlockPlugin.key,
						TogglePlugin.key,
					],
				},
			}),

			IndentListPlugin.extend({
				inject: {
					targetPlugins: [
						ParagraphPlugin.key,
						...HEADING_LEVELS,
						BlockquotePlugin.key,
						CodeBlockPlugin.key,
						TogglePlugin.key,
					],
				},
				options: {
					listStyleTypes: {
						fire: {
							liComponent: FireLiComponent,
							markerComponent: FireMarker,
							type: "fire",
						},
						todo: {
							liComponent: TodoLi,
							markerComponent: TodoMarker,
							type: "todo",
						},
					},
				},
			}),
			LineHeightPlugin.configure({
				inject: {
					nodeProps: {
						defaultNodeValue: 1.5,
						validNodeValues: [1, 1.2, 1.5, 2, 3],
					},
					targetPlugins: [ParagraphPlugin.key, ...HEADING_LEVELS],
				},
			}),

			// Functionality
			autoformatPlugins,
			BlockSelectionPlugin,
			DndPlugin.configure({
				options: {
					enableScroller: true,
					onDropFiles: ({ dragItem, editor, target }) => {
						editor
							.getTransforms(PlaceholderPlugin)
							.insert.media(dragItem.files, { at: target, nextBlock: false });
					},
				},
				render: {
					aboveNodes: DraggableAboveNodes,
				},
			}),
			EmojiPlugin,
			ExitBreakPlugin.configure({
				options: {
					rules: [
						{
							hotkey: "mod+enter",
						},
						{
							hotkey: "mod+shift+enter",
							before: true,
						},
						{
							hotkey: "enter",
							query: {
								start: true,
								end: true,
								allow: HEADING_LEVELS,
							},
							relative: true,
							level: 1,
						},
					],
				},
			}),
			NodeIdPlugin,
			resetBlockTypePlugin,
			SoftBreakPlugin.configure({
				options: {
					rules: [
						{ hotkey: "shift+enter" },
						{
							hotkey: "enter",
							query: {
								allow: [
									CodeBlockPlugin.key,
									BlockquotePlugin.key,
									TableCellPlugin.key,
									TableCellHeaderPlugin.key,
								],
							},
						},
					],
				},
			}),
			TabbablePlugin,
			// start Slash Plugin (not working)
			SlashPlugin,

			SlashInputPlugin,
			BlockMenuPlugin,
			// end Slash Plugin
			// Deserialization
			DocxPlugin,
			MarkdownPlugin,
			JuicePlugin,
			CsvPlugin,
		],
		override: {
			components:
				// withDraggables(
				withPlaceholders({
					[BlockquotePlugin.key]: BlockquoteElement,
					[CodeBlockPlugin.key]: CodeBlockElement,
					[CodeLinePlugin.key]: CodeLineElement,
					[CodeSyntaxPlugin.key]: CodeSyntaxLeaf,
					[HorizontalRulePlugin.key]: HrElement,
					[HEADING_KEYS.h1]: withProps(HeadingElement, { variant: "h1" }),
					[HEADING_KEYS.h2]: withProps(HeadingElement, { variant: "h2" }),
					[HEADING_KEYS.h3]: withProps(HeadingElement, { variant: "h3" }),
					[HEADING_KEYS.h4]: withProps(HeadingElement, { variant: "h4" }),
					[HEADING_KEYS.h5]: withProps(HeadingElement, { variant: "h5" }),
					[HEADING_KEYS.h6]: withProps(HeadingElement, { variant: "h6" }),
					[LinkPlugin.key]: LinkElement,
					// end media components
					[AudioPlugin.key]: MediaAudioElement,
					[FilePlugin.key]: MediaFileElement,
					[ImagePlugin.key]: ImageElement,
					[PlaceholderPlugin.key]: MediaPlaceholderElement,
					[VideoPlugin.key]: MediaVideoElement,
					[MediaEmbedPlugin.key]: MediaEmbedElement,
					// end media components
					[ParagraphPlugin.key]: ParagraphElement,
					[TablePlugin.key]: TableElement,
					[TableRowPlugin.key]: TableRowElement,
					[TableCellPlugin.key]: TableCellElement,
					[TableCellHeaderPlugin.key]: TableCellHeaderElement,
					[BoldPlugin.key]: withProps(PlateLeaf, { as: "strong" }),
					[CodePlugin.key]: CodeLeaf,
					[KbdPlugin.key]: KbdLeaf,
					[HighlightPlugin.key]: HighlightLeaf,
					[ItalicPlugin.key]: withProps(PlateLeaf, { as: "em" }),
					[StrikethroughPlugin.key]: withProps(PlateLeaf, { as: "s" }),
					[SubscriptPlugin.key]: withProps(PlateLeaf, { as: "sub" }),
					[SuperscriptPlugin.key]: withProps(PlateLeaf, { as: "sup" }),
					[UnderlinePlugin.key]: withProps(PlateLeaf, { as: "u" }),
					// list
					[BulletedListPlugin.key]: withProps(ListElement, { variant: "ul" }),
					[ListItemPlugin.key]: withProps(PlateElement, { as: "li" }),
					[NumberedListPlugin.key]: withProps(ListElement, { variant: "ol" }),
					[TodoListPlugin.key]: TodoListElement,

					[TogglePlugin.key]: ToggleElement,
					[ColumnPlugin.key]: ColumnGroupElement,
					[ColumnItemPlugin.key]: ColumnElement,
					[EquationPlugin.key]: EquationElement,
					[SlashInputPlugin.key]: SlashInputElement,
					[TocPlugin.key]: TocElement,
				}),
			// ),
		},
		value: initialValue,
	});

	return editor;
}
