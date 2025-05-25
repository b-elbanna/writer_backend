"use client";

import postCreateQABoxResourceAction from "@/endpointActions/postCreateQABoxResourceAction";
import postCreateResourceAction from "@/endpointActions/postCreateResourceAction";
import useCurrentQaBoxFetcher from "@/swrDataFetcher/currentQaBoxFetcher";
import {
	FilePlus2,
	UploadIcon,
	FileIcon,
	XIcon,
	CheckCircle,
	AlertCircle,
} from "lucide-react";
import React, { useState } from "react";
import pdfToText from "react-pdftotext";

// https://uploadcare.com/blog/how-to-upload-file-in-react/
export default function SingleResourceUploader({
	qaBoxId,
}: {
	qaBoxId?: string;
}) {
	const { mutate } = useCurrentQaBoxFetcher(qaBoxId || "");
	const inputFileRef = React.useRef<HTMLInputElement>(null);
	const [abstract, setAbstract] = useState<string | null>(null);
	const [textFile, setTextFile] = useState<string | null>(null);
	const [file, setFile] = useState<File | null>(null);
	const [status, setStatus] = useState<
		"initial" | "uploading" | "reading" | "success" | "fail"
	>("initial");

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files?.length) {
			setFile(e.target.files[0]);
			const isPdf = e.target.files[0].type === "application/pdf";

			if (isPdf) {
				setStatus("reading");
				pdfToText(e.target.files[0])
					.then((text) => {
						let abstract: string = "";
						let splitedStr = text.toLowerCase().split("abstract");

						if (text && splitedStr.length > 1) {
							abstract = splitedStr.pop()?.slice(0, 500) + "...";
						}
						splitedStr = text.toLowerCase().split("summary");
						if (text && splitedStr.length > 1) {
							abstract = splitedStr?.pop()?.slice(0, 500) + "...";
						} else {
							abstract = text?.slice(0, 500) + "...";
						}
						setAbstract(abstract);
						setTextFile(text);
						setStatus("initial");
					})
					.catch((error) => {
						console.error(error);
						setStatus("fail");
					});
			}
		}
	};

	const handleUpload = async () => {
		if (textFile && file) {
			setStatus("uploading");
			try {
				await (qaBoxId
					? postCreateQABoxResourceAction({
							text_source: textFile,
							name: file.name,
							type: "pdf",
							qaBoxId,
					  })
					: postCreateResourceAction({
							text_source: textFile,
							name: file.name,
							type: "pdf",
					  }));

				mutate();
				setFile(null);
				setAbstract(null);
				setTextFile(null);
				setStatus("success");

				// Reset success status after 2 seconds
				setTimeout(() => {
					setStatus("initial");
				}, 2000);
			} catch (error) {
				setStatus("fail");
			}
		} else {
			setStatus("fail");
		}
	};

	const clearFile = () => {
		setFile(null);
		setAbstract(null);
		setTextFile(null);
		setStatus("initial");
		if (inputFileRef.current) {
			inputFileRef.current.value = "";
		}
	};

	return (
		<div className="p-4 space-y-4">
			<div className="flex items-center gap-4">
				<button
					onClick={() => inputFileRef.current?.click()}
					className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary bg-white border border-action/20 rounded-md hover:bg-action/5 hover:border-action/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-action/20"
				>
					<FilePlus2 size={16} className="text-action" />
					Choose PDF
				</button>
				<input
					ref={inputFileRef}
					className="hidden"
					id="file"
					type="file"
					accept=".pdf"
					onChange={handleFileChange}
				/>
				{file && (
					<div className="flex-1 flex items-center justify-between px-3 py-2 bg-main rounded-md border border-action/10">
						<div className="flex items-center gap-2">
							<FileIcon size={16} className="text-action/70" />
							<span className="text-sm text-primary">{file.name}</span>
						</div>
						<button
							onClick={clearFile}
							className="p-1 hover:bg-action/10 rounded-full"
						>
							<XIcon size={14} className="text-mygray" />
						</button>
					</div>
				)}
			</div>

			{status === "reading" && (
				<div className="flex items-center gap-2 text-sm text-action">
					<div className="animate-spin">
						<UploadIcon size={16} />
					</div>
					Reading PDF content...
				</div>
			)}

			{file && abstract && (
				<div className="space-y-3">
					<div className="p-4 bg-main rounded-md border border-action/10">
						<h4 className="text-sm font-medium text-primary mb-2">Preview</h4>
						<div className="text-sm text-mygray max-h-32 overflow-y-auto scrollbar-custom">
							{abstract}
						</div>
					</div>

					{file.type === "application/pdf" && (
						<div className="flex justify-end">
							<button
								onClick={handleUpload}
								disabled={status === "uploading"}
								className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-action rounded-md hover:bg-action/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-action disabled:opacity-50 disabled:hover:bg-action"
							>
								{status === "uploading" ? (
									<>
										<div className="animate-spin">
											<UploadIcon size={16} />
										</div>
										Uploading...
									</>
								) : (
									<>
										<UploadIcon size={16} />
										Add Resource
									</>
								)}
							</button>
						</div>
					)}
				</div>
			)}

			{status === "success" && (
				<div className="flex items-center gap-2 text-sm text-[#22c55e]">
					<CheckCircle size={16} />
					File uploaded successfully!
				</div>
			)}

			{status === "fail" && (
				<div className="flex items-center gap-2 text-sm text-customred">
					<AlertCircle size={16} />
					File upload failed. Please try again.
				</div>
			)}
		</div>
	);
}
