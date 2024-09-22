import React, { useRef } from "react";
import { useEventListener } from "usehooks-ts";

export function CustomButton({
	children,
	onClickFunc,
	className,
}: {
	children: React.ReactNode | string;
	onClickFunc: (event?: any) => void;
	className?: string;
}) {
	const ref = useRef(null);
	useEventListener("click", onClickFunc, ref);
	return (
		<button
			ref={ref}
			className={` outline-2 outline outline-action text-action hover:bg-action hover:text-main active:bg-action active:text-main border rounded-sm font-semibold capitalize pointer-events-auto relative  inline-block  px-1  cursor-pointer duration-500 ${
				className && className
			}`}
			type="button"
			// onClick={(e) => {
			// 	onClickFunc(e);
			// 	// console.log("clicked");
			// }}
		>
			{children}
		</button>
	);
}
