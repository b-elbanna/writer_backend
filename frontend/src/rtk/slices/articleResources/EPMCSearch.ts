import searchInEPMCClient from "@/utils/searchUtils/searchInEuropePMCUtils";
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

export const getEPMCSearch = createAsyncThunk(
	"EPMCSearchData/getEPMCSearch",
	async ({
		query,
		maxResults,
		pageNumber,
	}: {
		query: string;
		maxResults?: number;
		pageNumber?: number;
	}) => {
		const arxivRes = await searchInEPMCClient(query, maxResults, pageNumber);

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
export const EPMCSearchData = createSlice({
	name: "EPMCSearchData",
	initialState,
	reducers: {
		resetEPMCSearchData: (state) => {
			state.value = [];
			return state;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(getEPMCSearch.fulfilled, (state, action) => {
			state.status = "fulfilled";

			state.value = action.payload.papers;
			state.query = action.payload.query;
			return state;
		});
		builder.addCase(getEPMCSearch.pending, (state, action) => {
			state.status = "pending";

			return state;
		});
		builder.addCase(getEPMCSearch.rejected, (state, action) => {
			state.status = "rejected";

			return state;
		});
	},
});

export const { resetEPMCSearchData } = EPMCSearchData.actions;

export default EPMCSearchData.reducer;
