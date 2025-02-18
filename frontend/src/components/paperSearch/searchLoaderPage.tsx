"use client";

import Image from "next/image";
import searchIcon from "@/loaders/searchIcon.svg";
export default function SearchLoaderPage({
	className,
}: {
	className?: string;
}) {
	return (
		<div
			className={`${className} h-full p-2	 flex flex-wrap gap-2 items-center justify-center`}
		>
			<p className="font-bold text-xl mb-4">
				Generating suggestions. Please wait...
			</p>
			<Image
				src={searchIcon}
				alt="search"
				width={200}
				height={200}
				className=" !bg-transparent"
			/>
			{/* <searchIcon className="!bg-transparent w-[150px]" /> */}
		</div>
	);
}
