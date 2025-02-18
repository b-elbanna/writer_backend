import searchInScopusClient from "@/utils/searchUtils/elsvier/searchInScopus";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PapersSearchData } from "../papersSearch";

const initialState = {
	value: [],
	status: "init",
	query: "",
} as PapersSearchData;

export const getScopusSearch = createAsyncThunk(
	"scopusSearchData/getScopusSearch",
	async ({
		query,
		maxResults,
		pageNumber,
	}: {
		query: string;
		maxResults?: number;
		pageNumber?: number;
	}) => {
		const arxivRes = await searchInScopusClient(query, maxResults, pageNumber);

		const papers: PaperSearchDataInerface[] = [...arxivRes];
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
export const scopusSearchData = createSlice({
	name: "scopusSearchData",
	initialState,
	reducers: {
		resetScopusSearchData: (state) => {
			state.value = [];
			return state;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(getScopusSearch.fulfilled, (state, action) => {
			state.status = "fulfilled";

			state.value = action.payload.papers;
			state.query = action.payload.query;
			return state;
		});
		builder.addCase(getScopusSearch.pending, (state, action) => {
			state.status = "pending";

			return state;
		});
		builder.addCase(getScopusSearch.rejected, (state, action) => {
			state.status = "rejected";

			return state;
		});
	},
});

export const { resetScopusSearchData } = scopusSearchData.actions;

export default scopusSearchData.reducer;
