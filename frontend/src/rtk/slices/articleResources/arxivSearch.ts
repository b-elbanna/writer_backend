import searchInArxivClient from "@/utils/searchUtils/searchInArxivUtils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

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

export const getArxivSearch = createAsyncThunk(
	"arxivSearchData/getArxivSearch",
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
export const arxivSearchData = createSlice({
	name: "arxivSearchData",
	initialState,
	reducers: {
		resetArxivSearchData: (state) => {
			state.value = [];
			return state;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(getArxivSearch.fulfilled, (state, action) => {
			state.status = "fulfilled";

			state.value = action.payload.papers;
			state.query = action.payload.query;
			return state;
		});
		builder.addCase(getArxivSearch.pending, (state, action) => {
			state.status = "pending";

			return state;
		});
		builder.addCase(getArxivSearch.rejected, (state, action) => {
			state.status = "rejected";

			return state;
		});
	},
});

export const { resetArxivSearchData } = arxivSearchData.actions;

export default arxivSearchData.reducer;
