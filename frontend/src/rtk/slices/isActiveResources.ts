import { createSlice } from "@reduxjs/toolkit";

let initialState: boolean = false;

export const isActiveResources = createSlice({
	name: "isActiveResources",
	initialState,
	reducers: {
		activateResources: (state) => {
			state = true;
			return state;
		},
		deactivateResources: (state) => {
			state = false;
			return state;
		},
		toggleActiveResources: (state) => {
			state = !state;
			return state;
		},
	},
});

export const { deactivateResources, activateResources, toggleActiveResources } =
	isActiveResources.actions;

export default isActiveResources.reducer;
