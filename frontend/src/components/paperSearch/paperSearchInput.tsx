"use client";
import { searchAboutPapers } from "@/rtk/slices/papersSearch";
import { useAppDispatch } from "@/rtk/store";
import { SearchIcon } from "lucide-react";
import React, { KeyboardEvent } from "react";

export default function PaperSearchInput() {
	const [inputValue, changeInputValue] = React.useState("");

	const dispatch = useAppDispatch();
	const searchHandler = (inputValue: string) => {
		dispatch(searchAboutPapers({ query: inputValue.trim(), maxResults: 10 }));
	};

	const inputHandler = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key == "Enter") {
			searchHandler(inputValue);
			changeInputValue("");
		}
		if (e.key == "Tab") {
			e.preventDefault();
		}
	};

	return (
		<div className=" w-full mx-auto flex items-center justify-center z-10  relative ">
			<form
				onSubmit={(e) => {
					e.preventDefault();
					// searchHandler(inputValue);
					// changeInputValue("");
				}}
				className="w-full"
			>
				<SearchIcon
					className="absolute text-primary left-5 top-1/2 -translate-y-1/2"
					size={20}
					strokeWidth={4}
				/>
				<input
					type="text"
					name="papername"
					value={inputValue}
					onChange={(e) => {
						changeInputValue(e.target.value);
					}}
					onKeyDown={inputHandler}
					placeholder="Enter the title of the article"
					className=" p-3 px-[50px] w-full  text-lg bg-main  dark:bg-dark-secondary  focus:outline-none  rounded-full"
				/>
			</form>
		</div>
	);
}
