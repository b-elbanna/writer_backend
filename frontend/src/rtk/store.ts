import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, useStore } from "react-redux";
import currentUserProject from "./slices/currentUserProject";
import papersSearchData from "./slices/papersSearch";
import projectOpenedTool from "./slices/projectOpenedTool";
import currentUserChatbox from "./slices/currentUserChat";

export const makeStore = () => {
	return configureStore({
		reducer: {
			currentUserProject,
			papersSearchData,
			projectOpenedTool,
			currentUserChatbox,
		},
	});
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();
