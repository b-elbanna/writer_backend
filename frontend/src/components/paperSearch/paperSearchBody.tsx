"use client";
import PaperSearchResultCard from "./paperSearchResultCard";
import SearchToolPlaceholder from "./searchToolPlaceholder";
import SearchLoaderPage from "./searchLoaderPage";
import { useEffect, useState } from "react";
import sortByRelatedness from "@/utils/sortByRelatedness";
import { PapersSearchData } from "@/rtk/slices/papersSearch";
import { useAppSelector } from "@/rtk/store";

export default function PaperSearchBody() {
	const papersSearchData = useAppSelector((state) => state.papersSearchData);
	const arxivSearchData = useAppSelector((state) => state.arxivSearchData);
	const archiveSearchData = useAppSelector((state) => state.archiveSearchData);
	const synthicalSearchData = useAppSelector(
		(state) => state.synthicalSearchData
	);
	const scopusSearchData = useAppSelector((state) => state.scopusSearchData);
	const EPMCSearchData = useAppSelector((state) => state.EPMCSearchData);

	// useEffect(() => {}, [papersSearchData]);

	//  if all search data is init
	if (
		papersSearchData.status === "init" &&
		arxivSearchData.status === "init" &&
		archiveSearchData.status === "init" &&
		synthicalSearchData.status === "init" &&
		scopusSearchData.status === "init" &&
		EPMCSearchData.status === "init"
	)
		return (
			<SearchToolPlaceholder
				icon={
					<div className="text-sm text-mygray flex items-center gap-1 capitalize">
						powered By Arxiv
					</div>
				}
				label="Label"
				description="Search more than 25 million Scientific Papers!"
			/>
		);
	// if all search data is pending
	if (
		papersSearchData.status === "pending" &&
		arxivSearchData.status === "pending" &&
		archiveSearchData.status === "pending" &&
		synthicalSearchData.status === "pending" &&
		scopusSearchData.status === "pending" &&
		EPMCSearchData.status === "pending"
	)
		return <SearchLoaderPage />;
	else {
		return (
			<>
				<PaperSearchResults papersSearchData={arxivSearchData} />;
				<PaperSearchResults papersSearchData={EPMCSearchData} />;
				<PaperSearchResults papersSearchData={synthicalSearchData} />;
				<PaperSearchResults papersSearchData={archiveSearchData} />;
				<PaperSearchResults papersSearchData={scopusSearchData} />;
				<PaperSearchResults papersSearchData={papersSearchData} />;
			</>
		);
	}
}

function PaperSearchResults({
	papersSearchData,
}: {
	papersSearchData: PapersSearchData;
}) {
	const [sortedPapers, setSortedPapers] = useState();
	const [sorted, setSorted] = useState(false);
	// /////////////////////////
	// star sort by relatedness
	// useEffect(() => {
	// 	sortByRelatedness(
	// 		papersSearchData.query,
	// 		papersSearchData.value.map((paper) => paper.title)
	// 	).then((relatednesses) => {
	// 		relatednesses;
	// 		let sortedPapers: PaperSearchDataInerface[] = [];
	// 		for (let res of relatednesses) {
	// 			const [title, rate] = res;
	// 			for (let paper of papersSearchData.value) {
	// 				if (paper.title === title) {
	// 					sortedPapers.push(paper);
	// 				}
	// 			}
	// 		}
	// 		setSortedPapers(sortedPapers);
	// }, [papersSearchData]);
	// end sort by relatedness
	// /////////////////////////
	return (
		<div className="p-5 transition-all duration-300">
			{papersSearchData.value.map((result, i) => {
				return (
					(result.pdfUrl || result.url) && (
						<PaperSearchResultCard
							key={result.url + result.source}
							title={result.title}
							summary={result.summary}
							pdfUrl={result.pdfUrl}
							publisher={result.publisher}
							published={result.published}
							url={result.url}
							identifier={result.identifier}
							source={result.source}
						/>
					)
				);
			})}
		</div>
	);
}
