"use client";
import searchInSynthicalClient from "@/utils/searchUtils/searchInSynthicalUtils";

export default function TextPage() {
	return (
		<div className="text-center h-full m-5">
			<input
				type="text"
				className="text-center w-full p-5 text-lg outline-none bg-mygray rounded-md"
				onKeyDown={async (e) => {
					if (e.key === "Enter") {
						const v = e.currentTarget.value;
						e.currentTarget.value = "";
						console.log(v);
						const res = await searchInSynthicalClient(v);
						console.log(res);
					}
				}}
			/>
			<div className="font-semibold p-4">
				there is no results available with this title
			</div>
		</div>
	);
}
