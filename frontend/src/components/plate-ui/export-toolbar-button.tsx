"use client";

import React from "react";

import type { DropdownMenuProps } from "@radix-ui/react-dropdown-menu";

import { toDOMNode, useEditorRef } from "@udecode/plate-common/react";
import { ArrowDownToLineIcon } from "lucide-react";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
	useOpenState,
} from "./dropdown-menu";
import { ToolbarButton } from "./toolbar";
import { Document, Packer, Paragraph, TextRun } from "docx";

export function ExportToolbarButton({ children, ...props }: DropdownMenuProps) {
	const editor = useEditorRef();
	const openState = useOpenState();

	const getCanvas = async () => {
		const { default: html2canvas } = await import("html2canvas");

		const style = document.createElement("style");
		document.head.append(style);
		style.sheet?.insertRule(
			"body > div:last-child img { display: inline-block !important; }"
		);

		const canvas = await html2canvas(toDOMNode(editor, editor)!);
		style.remove();

		return canvas;
	};

	const downloadFile = (href: string, filename: string) => {
		const element = document.createElement("a");
		element.setAttribute("href", href);
		element.setAttribute("download", filename);
		element.style.display = "none";
		document.body.append(element);
		element.click();
		element.remove();
	};

	const exportToPdf = async () => {
		const canvas = await getCanvas();
		const PDFLib = await import("pdf-lib");
		const pdfDoc = await PDFLib.PDFDocument.create();
		const page = pdfDoc.addPage([canvas.width, canvas.height]);
		const imageEmbed = await pdfDoc.embedPng(canvas.toDataURL("PNG"));
		const { height, width } = imageEmbed.scale(1);
		page.drawImage(imageEmbed, {
			height,
			width,
			x: 0,
			y: 0,
		});
		const pdfBase64 = await pdfDoc.saveAsBase64({ dataUri: true });

		downloadFile(pdfBase64, "plate.pdf");
	};

	const exportToDocx = async () => {
		const htmlContent = toDOMNode(editor, editor);

		if (htmlContent) {
			const doc = new Document({
				sections: [{ properties: {}, children: parseHtmlToDocx(htmlContent) }],
			});
			await Packer.toBlob(doc).then((blob: any) => {
				downloadFile(URL.createObjectURL(blob), "plate.docx");
			});
		}
	};

	const exportToImage = async () => {
		const canvas = await getCanvas();
		downloadFile(canvas.toDataURL("image/png"), "plate.png");
	};

	return (
		<DropdownMenu modal={false} {...openState} {...props}>
			<DropdownMenuTrigger asChild>
				<ToolbarButton pressed={openState.open} tooltip="Export" isDropdown>
					<ArrowDownToLineIcon className="size-4" />
				</ToolbarButton>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="start">
				<DropdownMenuGroup>
					<DropdownMenuItem onSelect={exportToPdf}>
						Export as PDF
					</DropdownMenuItem>
					<DropdownMenuItem onSelect={exportToImage}>
						Export as Image
					</DropdownMenuItem>
					<DropdownMenuItem onSelect={exportToDocx}>
						Export as Docx
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function parseHtmlToDocx(htmlContent: HTMLElement) {
	const body = htmlContent;
	return Array.from(body.childNodes).map((node) => {
		if (node.nodeName === "H1") {
			return new Paragraph({
				children: [
					new TextRun({
						text: node.textContent || "",
						bold: true,
						size: 48,
						color: "0000FF",
					}),
				],
				heading: "Heading1",
			});
		} else if (node.nodeName === "P") {
			return new Paragraph({
				children: [new TextRun({ text: node.textContent || "", size: 36 })],
			});
		}
		return new Paragraph(node.textContent || "");
	});
}
