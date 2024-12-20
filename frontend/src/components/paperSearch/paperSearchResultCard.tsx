"use client";
import { getInternetArchiveItemPdfUrl } from "@/utils/searchUtils/searchInInternetArchiveUtils";
import { useEffect, useState } from "react";
import { ExternalLinkIcon, FileTextIcon } from "lucide-react";
import dateObjFromIsoStr from "@/utils/datTimeRep";

function PaperInfo({
	pdfUrl,
	url,
	identifier,
	source,
	published,
	publisher,
}: {
	url: string;
	pdfUrl?: string;
	identifier?: string;
	source?: string;
	published?: string;
	publisher?: string;
}) {
	const [createdPdfUrl, setPdfUrl] = useState<string | undefined>(pdfUrl);

	useEffect(() => {
		if (!pdfUrl && source === "archive" && identifier) {
			getInternetArchiveItemPdfUrl(identifier).then((pdf_url) => {
				setPdfUrl(pdf_url?.pdfdownloadUrl);
			});
		}
	}, []);

	return (
		<div className=" justify-between flex flex-wrap gap-1 py-2">
			<div className="paper-buttons flex gap-1 ">
				<button
					className="text-active "
					onClick={async () => {
						window.open(pdfUrl || createdPdfUrl, "_blank");
					}}
				>
					<FileTextIcon width={25} height={25} strokeWidth={2} />
				</button>

				<div className="h-full border-l-4 border-primary "></div>
				{url && (
					<button
						className="text-active "
						onClick={async () => {
							window.open(url, "_blank");
						}}
					>
						<ExternalLinkIcon width={25} height={25} strokeWidth={2} />
					</button>
				)}
			</div>
			{!published && !publisher && (
				<a className="text-sm flex justify-center items-end" href={url}>
					{url}
				</a>
			)}

			{publisher && (
				<div className="text-sm flex justify-center items-end text-mygray">
					{publisher}
				</div>
			)}
			<div>from: {source?.toUpperCase()}</div>
			{published && (
				<div className="text-sm flex justify-center items-end text-mygray">
					{dateObjFromIsoStr(published).getDate()}-
					{dateObjFromIsoStr(published).getMonth()}-
					{dateObjFromIsoStr(published).getFullYear()}
				</div>
			)}
		</div>
	);
}

export default function PaperSearchResultCard({
	title,
	summary,
	pdfUrl,
	url,
	identifier,
	source,
	published,
	publisher,
}: PaperSearchDataInerface) {
	const [expandResult, setExpandResult] = useState(false);

	return (
		<div className="relative w-full  mb-6 last-of-type:m-0   group">
			<div className="mb-2  ">
				<h3 className="  font-bold text-primary text-2xl md:text-3xl">
					{title}
				</h3>
				<PaperInfo
					published={published}
					source={source}
					publisher={publisher}
					pdfUrl={pdfUrl}
					url={url}
					identifier={identifier}
				/>
			</div>
			<p className="  pb-4">
				{expandResult && summary ? summary : summary?.slice(0, 200)}
				{summary && summary?.length > 200 && (
					<button
						className="text-sm text-active font-semibold"
						onClick={() => setExpandResult(!expandResult)}
					>
						{expandResult ? " |See Less" : "...Read More"}
					</button>
				)}
			</p>
			<div className="absolute bottom-0 mx-auto w-1/2 group-hover:w-full transition-all border-b-primary border-2"></div>
		</div>
	);
}
