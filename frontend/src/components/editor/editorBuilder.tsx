"use client";

import React from "react";
import { withProps } from "@udecode/cn";
import { AlignPlugin } from "@udecode/plate-alignment/react";
import { AutoformatPlugin } from "@udecode/plate-autoformat/react";
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
	isCodeBlockEmpty,
	isSelectionAtCodeBlockStart,
	unwrapCodeBlock,
} from "@udecode/plate-code-block";
import {
	CodeBlockPlugin,
	CodeLinePlugin,
	CodeSyntaxPlugin,
} from "@udecode/plate-code-block/react";
// import { CommentsPlugin } from "@udecode/plate-comments/react";
import {
	isBlockAboveEmpty,
	isSelectionAtBlockStart,
	someNode,
} from "@udecode/plate-common";
import {
	createPlateEditor,
	ParagraphPlugin,
	PlateLeaf,
} from "@udecode/plate-common/react";
import { DndPlugin } from "@udecode/plate-dnd";
import { DocxPlugin } from "@udecode/plate-docx";
import { EmojiPlugin } from "@udecode/plate-emoji/react";
import {
	FontBackgroundColorPlugin,
	FontColorPlugin,
	FontSizePlugin,
} from "@udecode/plate-font/react";
import { HEADING_KEYS, HEADING_LEVELS } from "@udecode/plate-heading";
import { HeadingPlugin } from "@udecode/plate-heading/react";
import { HighlightPlugin } from "@udecode/plate-highlight/react";
import { HorizontalRulePlugin } from "@udecode/plate-horizontal-rule/react";
import { IndentListPlugin } from "@udecode/plate-indent-list/react";
import { IndentPlugin } from "@udecode/plate-indent/react";
import { JuicePlugin } from "@udecode/plate-juice";
import { LineHeightPlugin } from "@udecode/plate-line-height/react";
import { LinkPlugin } from "@udecode/plate-link/react";
import { TodoListPlugin } from "@udecode/plate-list/react";
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
import { ResetNodePlugin } from "@udecode/plate-reset-node/react";
import { SelectOnBackspacePlugin } from "@udecode/plate-select";
import { BlockSelectionPlugin } from "@udecode/plate-selection/react";
import { TabbablePlugin } from "@udecode/plate-tabbable/react";
import {
	TableCellHeaderPlugin,
	TableCellPlugin,
	TablePlugin,
	TableRowPlugin,
} from "@udecode/plate-table/react";

import { autoformatRules } from "@/lib/plate/autoformat-rules";
import { BlockquoteElement } from "@/components/plate-ui/blockquote-element";
import { CodeBlockElement } from "@/components/plate-ui/code-block-element";
import { CodeLeaf } from "@/components/plate-ui/code-leaf";
import { CodeLineElement } from "@/components/plate-ui/code-line-element";
import { CodeSyntaxLeaf } from "@/components/plate-ui/code-syntax-leaf";
import { DragOverCursorPlugin } from "@/components/plate-ui/cursor-overlay";
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
import { withDraggables } from "@/components/plate-ui/with-draggables";
import Prism from "prismjs";
import { CsvPlugin } from "@udecode/plate-csv";
import { ImagePreview } from "@/components/plate-ui/image-preview";
import { MediaUploadToast } from "../plate-ui/media-upload-toast";
import { MediaAudioElement } from "../plate-ui/media-audio-element";
import { MediaFileElement } from "../plate-ui/media-file-element";
import { MediaPlaceholderElement } from "../plate-ui/media-placeholder-element";
import { MediaVideoElement } from "../plate-ui/media-video-element";

export default function useMyEditor(initialValue: any) {
	const editor = createPlateEditor({
		plugins: [
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
			PlaceholderPlugin.configure({
				options: { disableEmptyPlaceholder: true },
				render: { afterEditable: MediaUploadToast },
			}),
			// end Media Plugins

			TablePlugin,
			TableRowPlugin,
			TableCellPlugin,
			TableCellHeaderPlugin,
			TodoListPlugin,

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
			IndentPlugin.configure({
				inject: {
					targetPlugins: [
						ParagraphPlugin.key,
						BlockquotePlugin.key,
						CodeBlockPlugin.key,
						...HEADING_LEVELS,
					],
				},
			}),
			IndentListPlugin.configure({
				inject: {
					targetPlugins: [
						ParagraphPlugin.key,
						BlockquotePlugin.key,
						CodeBlockPlugin.key,
						...HEADING_LEVELS,
					],
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
			AutoformatPlugin.configure({
				options: {
					rules: autoformatRules,
					enableUndoOnDelete: true,
				},
			}),
			BlockSelectionPlugin,
			DndPlugin.configure({
				options: { enableScroller: true },
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
			ResetNodePlugin.configure({
				options: {
					rules: [
						{
							types: [BlockquotePlugin.key, TodoListPlugin.key],
							defaultType: ParagraphPlugin.key,
							hotkey: "Enter",
							predicate: isBlockAboveEmpty,
						},
						{
							types: [BlockquotePlugin.key, TodoListPlugin.key],
							defaultType: ParagraphPlugin.key,
							hotkey: "Backspace",
							predicate: isSelectionAtBlockStart,
						},
						{
							types: [CodeBlockPlugin.key],
							defaultType: ParagraphPlugin.key,
							onReset: unwrapCodeBlock,
							hotkey: "Enter",
							predicate: isCodeBlockEmpty,
						},
						{
							types: [CodeBlockPlugin.key],
							defaultType: ParagraphPlugin.key,
							onReset: unwrapCodeBlock,
							hotkey: "Backspace",
							predicate: isSelectionAtCodeBlockStart,
						},
					],
				},
			}),
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
			TabbablePlugin.configure(({ editor }) => ({
				options: {
					query: () => {
						if (isSelectionAtBlockStart(editor)) return false;

						return !someNode(editor, {
							match: (n) => {
								return !!(
									n.type &&
									([
										TablePlugin.key,
										TodoListPlugin.key,
										CodeBlockPlugin.key,
									].includes(n.type as string) ||
										n.listStyleType)
								);
							},
						});
					},
				},
			})),
			DragOverCursorPlugin,
			// Deserialization
			DocxPlugin,
			MarkdownPlugin,
			JuicePlugin,
			CsvPlugin,
		],
		override: {
			components: withDraggables(
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
					[TodoListPlugin.key]: TodoListElement,
					[BoldPlugin.key]: withProps(PlateLeaf, { as: "strong" }),
					[CodePlugin.key]: CodeLeaf,
					[HighlightPlugin.key]: HighlightLeaf,
					[ItalicPlugin.key]: withProps(PlateLeaf, { as: "em" }),
					[StrikethroughPlugin.key]: withProps(PlateLeaf, { as: "s" }),
					[SubscriptPlugin.key]: withProps(PlateLeaf, { as: "sub" }),
					[SuperscriptPlugin.key]: withProps(PlateLeaf, { as: "sup" }),
					[UnderlinePlugin.key]: withProps(PlateLeaf, { as: "u" }),
				})
			),
		},
		value: initialValue,
	});

	return editor;
}
