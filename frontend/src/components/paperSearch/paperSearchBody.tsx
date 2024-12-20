"use client";
import { RootState } from "@/rtk/store";
import { useSelector } from "react-redux";
import PaperSearchResultCard from "./paperSearchResultCard";
import SearchToolPlaceholder from "./searchToolPlaceholder";
import SearchLoaderPage from "./searchLoaderPage";
import { useEffect, useState } from "react";
import sortByRelatedness from "@/utils/sortByRelatedness";
import { PapersSearchData } from "@/rtk/slices/papersSearch";

export default function PaperSearchBody() {
	const papersSearchData = useSelector(
		(state: RootState) => state.papersSearchData
	);

	useEffect(() => {}, [papersSearchData]);
	if (papersSearchData.status === "init")
		return (
			<SearchToolPlaceholder
				icon={
					<div className="text-sm text-mygray flex items-center gap-1 capitalize">
						powered By Internet archive scholar{" "}
					</div>
				}
				label="Label"
				description="Search more than 25 million Scientific Papers!"
			/>
		);
	if (papersSearchData.status === "pending") return <SearchLoaderPage />;
	else {
		return <PaperSearchResults papersSearchData={papersSearchData} />;
	}
}

function PaperSearchResults({
	papersSearchData,
}: {
	papersSearchData: PapersSearchData;
}) {
	const [sortedPapers, setSortedPapers] = useState(papersSearchData.value);
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
	// 	});
	// }, [papersSearchData]);
	// end sort by relatedness
	// /////////////////////////
	return (
		<div className="p-5 transition-all duration-300">
			{sortedPapers.map((result, i) => {
				return (
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
				);
			})}
		</div>
	);
}
