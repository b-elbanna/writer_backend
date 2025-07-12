import ButtonLoader from "@/loaders/buttonLoader";
import React, { useRef } from "react";
import { useEventListener } from "usehooks-ts";

export function CustomButton({
	children,
	onClickFunc,
	className,
	dark,
}: {
	children: React.ReactNode | string;
	onClickFunc: (event?: any) => void;
	className?: string;
	dark?: boolean;
}) {
	const ref = useRef(null);
	const [isSubmitting, setSubmitting] = React.useState(false);

	const cls = dark
		? ` flex  font-semibold items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl active:shadow-md ${
				className && className
		  }`
		: ` p-2 px-3  flex items-center  !tracking-[2px] outline-2 outline outline-action text-action hover:bg-action hover:text-main active:bg-action active:text-main border rounded-sm font-semibold capitalize pointer-events-auto relative  cursor-pointer duration-500 ${
				className && className
		  }`;
	return (
		<button
			ref={ref}
			onClick={async (e) => {
				setSubmitting(true);
				await onClickFunc(e);
				setSubmitting(false);
				// console.log("clicked");
			}}
			className={cls}
			type="button"
			disabled={isSubmitting}
		>
			{isSubmitting ? <ButtonLoader /> : children}
		</button>
	);
}
