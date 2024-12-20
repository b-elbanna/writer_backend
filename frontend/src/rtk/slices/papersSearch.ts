import searchInArxivClient from "@/utils/searchUtils/searchInArxivUtils";
import searchInSpringerClient from "@/utils/searchUtils/searchInSpringerUtils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import searchInInternetArchiveClient from "@/utils/searchUtils/searchInInternetArchiveUtils";
import searchInScopusClient from "@/utils/searchUtils/elsvier/searchInScopus";
import searchInEPMCClient from "@/utils/searchUtils/searchInEuropePMCUtils";
import searchInSynthicalClient from "@/utils/searchUtils/searchInSynthicalUtils";

export interface PapersSearchData {
	value: PaperSearchDataInerface[];
	query: string;
	status: "init" | "pending" | "fulfilled" | "rejected";
}

const initialState = {
	value: [],
	status: "init",
	query: "",
} as PapersSearchData;

export const searchAboutPapers = createAsyncThunk(
	"papersSearchData/searchAboutPapers",
	async ({
		query,
		maxResults,
		pageNumber,
	}: {
		query: string;
		maxResults?: number;
		pageNumber?: number;
	}) => {
		const arxivRes = await searchInArxivClient(query, maxResults, pageNumber);
		let springerRes: PaperSearchDataInerface[] = [];
		let internetArchiveRes: PaperSearchDataInerface[] = [];
		let scopusRes: PaperSearchDataInerface[] = [];
		let ePMCRes: PaperSearchDataInerface[] = [];
		let synthicalRes: PaperSearchDataInerface[] = [];

		try {
			internetArchiveRes = await searchInInternetArchiveClient(
				query,
				maxResults,
				pageNumber
			);
			// springerRes = await searchInSpringerClient(query, maxResults, pageNumber);
			scopusRes = await searchInScopusClient(query, maxResults, pageNumber);
			ePMCRes = await searchInEPMCClient(query, maxResults, pageNumber);
			synthicalRes = await searchInSynthicalClient(
				query,
				maxResults,
				pageNumber
			);
		} catch (e) {
			console.log(e);
		}

		const papers: PaperSearchDataInerface[] = [
			...arxivRes,
			...springerRes,
			...internetArchiveRes,
			...scopusRes,
			...ePMCRes,
			...synthicalRes,
		];
		console.log(papers);
		// /////////////////////////
		// star sort by relatedness

		// const relatednesses = await sortByRelatedness(
		//   query,
		// 	papers.map((paper) => paper.title)
		// );
		// let sortedPapers: PaperSearchDataInerface[] = [];
		// for (let el of relatednesses) {
		// 	const [title, rate] = el;
		// 	for (let paper of papers) {
		//     if (paper.title === title) {
		//       sortedPapers.push(paper);
		// 		}
		// 	}
		// }

		// end sort by relatedness
		// /////////////////////////
		return { papers, query } as {
			papers: PaperSearchDataInerface[];
			query: string;
		};
	}
);
export const papersSearchData = createSlice({
	name: "papersSearchData",
	initialState,
	reducers: {
		resetPapersSearchData: (state, action) => {
			state.value = action.payload;
			return state;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(searchAboutPapers.fulfilled, (state, action) => {
			state.status = "fulfilled";

			state.value = action.payload.papers;
			state.query = action.payload.query;
			return state;
		});
		builder.addCase(searchAboutPapers.pending, (state, action) => {
			state.status = "pending";

			return state;
		});
		builder.addCase(searchAboutPapers.rejected, (state, action) => {
			state.status = "rejected";

			return state;
		});
	},
});

export const { resetPapersSearchData } = papersSearchData.actions;

export default papersSearchData.reducer;
