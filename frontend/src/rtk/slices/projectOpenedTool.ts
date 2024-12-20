import { createSlice } from "@reduxjs/toolkit";
import React from "react";

let initialState: {
	id: number;
	name: string;
	description: string;
	Icon?: React.ReactNode;
} = {
	id: 0,
	name: "editor",
	description: "smart text editor",
};

export const projectOpenedTool = createSlice({
	name: "projectOpenedTool",
	initialState,
	reducers: {
		setprojectOpenedToolId: (state, action) => {
			state.id = action.payload;
			return state;
		},
		setprojectOpenedTool: (state, action) => {
			state = action.payload;
			return state;
		},
	},
});

export const { setprojectOpenedToolId, setprojectOpenedTool } =
	projectOpenedTool.actions;

export default projectOpenedTool.reducer;
