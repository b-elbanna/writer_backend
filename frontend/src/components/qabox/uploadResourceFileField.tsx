"use client";

import postCreateQABoxResourceAction from "@/endpointActions/postCreateQABoxResourceAction";
import postCreateResourceAction from "@/endpointActions/postCreateResourceAction";
import useCurrentQaBoxFetcher from "@/swrDataFetcher/currentQaBoxFetcher";
import { FilePlus2, UploadIcon } from "lucide-react";
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
			setStatus("reading");
			e.target.files[0].type === "application/pdf" &&
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
					.catch((error) => console.error(error));
		}
	};

	const handleUpload = async () => {
		console.log(qaBoxId);
		if (textFile && file) {
			setStatus("uploading");
			(qaBoxId
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
				  })
			)
				.then((res) => {
					mutate();
					setFile(null);
					setStatus("success");
				})
				.catch((error) => {
					setStatus("fail");
				});
		} else {
			setStatus("fail");
		}
	};
	return (
		<div>
			<div className="input-group mx-auto max-w-[500px] flex border-4 bg-main rounded border-primary p-2">
				<input
					ref={inputFileRef}
					className="hidden"
					id="file"
					type="file"
					onChange={handleFileChange}
				/>
				<button
					className="flex items-center justify-center px-1"
					onClick={() => inputFileRef.current?.click()}
				>
					<FilePlus2
						className={`${
							file
								? file.type === "application/pdf"
									? "stroke-green-300"
									: "stroke-customred"
								: "stroke-mygray"
						} fill-primary`}
						size={30}
					/>
				</button>
				<div className="flex items-center justify-center border-s-4 ps-2 border-primary">
					{status !== "fail" ? (
						file ? (
							file.name
						) : (
							"No file selected"
						)
					) : (
						<p className="text-customred"> File upload failed!</p>
					)}
				</div>
			</div>
			{file && (
				<div className="max-w-2xl mx-auto my-5">
					<section>
						<p className=" font-bold">File details:</p>
						<ul className="px-4 max-h-56 overflow-y-auto">
							<li>
								<span className="font-bold">Name: </span>
								{file.name}
							</li>
							<li>
								<span className="font-bold">Type:</span> {file.type}
							</li>
							<li>
								<span className="font-bold">Size:</span> {file.size} bytes
							</li>
							{abstract && status !== "reading" ? (
								<li>
									<span className="font-bold">Abstract:</span>

									{abstract}
								</li>
							) : (
								<p>⏳ Reading selected file...</p>
							)}
						</ul>
					</section>

					{file.type === "application/pdf" && (
						<button
							onClick={handleUpload}
							className="submit flex p-1 items-center justify-center capitalize font-bold text-action"
						>
							<UploadIcon size={25} className="text-action" />
							Add source
						</button>
					)}
				</div>
			)}

			<Result status={status} />
		</div>
	);
}

const Result = ({ status }: { status: string }) => {
	if (status === "success") {
		return <p>✅ File uploaded successfully!</p>;
	} else if (status === "fail") {
		return <p>❌ File upload failed!</p>;
	} else if (status === "uploading") {
		return <p>⏳ Uploading selected file...</p>;
	} else if (status === "reading") {
		return <p>⏳ Reading selected file...</p>;
	} else {
		return null;
	}
};
