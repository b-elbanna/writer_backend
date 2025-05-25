"use client";
import { getInternetArchiveItemPdfUrl } from "@/utils/searchUtils/searchInInternetArchiveUtils";
import { useEffect, useState } from "react";
import { BookOpen, ExternalLink, FileText } from "lucide-react";
import dateObjFromIsoStr from "@/utils/datTimeRep";
import { SimpleTooltip } from "../simpleTooltip";

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
		<div className="flex items-center justify-between flex-wrap gap-4 py-3">
			<div className="flex items-center gap-6">
				<div className="flex items-center gap-3">
					{(pdfUrl || createdPdfUrl) && (
						<SimpleTooltip tooltip="Open PDF" delay={0}>
							<button
								className="p-2 rounded-md text-action/70 hover:text-action hover:bg-action/5 transition-colors"
								onClick={() => window.open(pdfUrl || createdPdfUrl, "_blank")}
							>
								<FileText size={18} />
							</button>
						</SimpleTooltip>
					)}
					{url && (
						<SimpleTooltip tooltip="Visit Source" delay={0}>
							<button
								className="p-2 rounded-md text-action/70 hover:text-action hover:bg-action/5 transition-colors"
								onClick={() => window.open(url, "_blank")}
							>
								<ExternalLink size={18} />
							</button>
						</SimpleTooltip>
					)}
				</div>
				{publisher && (
					<div className="text-sm text-mygray flex items-center gap-2">
						<BookOpen size={14} className="text-mygray/70" />
						{publisher}
					</div>
				)}
			</div>
			<div className="flex items-center gap-4 text-xs">
				{source && (
					<div className="px-2 py-1 rounded-full bg-main border border-action/10 text-mygray">
						{source.toUpperCase()}
					</div>
				)}
				{published && (
					<time className="text-mygray">
						{dateObjFromIsoStr(published).toLocaleDateString("en-US", {
							year: "numeric",
							month: "short",
							day: "numeric",
						})}
					</time>
				)}
			</div>
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
		<div className="group">
			<div className="relative bg-white rounded-lg border border-action/10 p-4 transition-shadow duration-300 hover:shadow-md">
				<h3 className="font-semibold text-lg text-primary leading-tight mb-3">
					{title}
				</h3>

				{summary && (
					<p className="text-sm text-mygray mb-4 transition-all duration-300">
						{expandResult ? summary : summary.slice(0, 280)}
						{summary.length > 280 && (
							<button
								className="ml-2 text-action hover:text-action/80 font-medium"
								onClick={() => setExpandResult(!expandResult)}
							>
								{expandResult ? "Show Less" : "Read More"}
							</button>
						)}
					</p>
				)}

				<PaperInfo
					published={published}
					source={source}
					publisher={publisher}
					pdfUrl={pdfUrl}
					url={url}
					identifier={identifier}
				/>
			</div>
		</div>
	);
}
