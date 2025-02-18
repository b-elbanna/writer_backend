import searchInSynthicalClient from "@/utils/searchUtils/searchInSynthicalUtils";
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

export const getSynthicalSearch = createAsyncThunk(
	"synthicalSearchData/getSynthicalSearch",
	async ({
		query,
		maxResults,
		pageNumber,
	}: {
		query: string;
		maxResults?: number;
		pageNumber?: number;
	}) => {
		const arxivRes = await searchInSynthicalClient(
			query,
			maxResults,
			pageNumber
		);

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
export const synthicalSearchData = createSlice({
	name: "synthicalSearchData",
	initialState,
	reducers: {
		resetSynthicalSearchData: (state) => {
			state.value = [];
			return state;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(getSynthicalSearch.fulfilled, (state, action) => {
			state.status = "fulfilled";

			state.value = action.payload.papers;
			state.query = action.payload.query;
			return state;
		});
		builder.addCase(getSynthicalSearch.pending, (state, action) => {
			state.status = "pending";

			return state;
		});
		builder.addCase(getSynthicalSearch.rejected, (state, action) => {
			state.status = "rejected";

			return state;
		});
	},
});

export const { resetSynthicalSearchData } = synthicalSearchData.actions;

export default synthicalSearchData.reducer;
