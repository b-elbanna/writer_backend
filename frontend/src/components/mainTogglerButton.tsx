import { ReactNode } from "react";

export default function MainTogglerButton({
	toggleFn,
	toggledValue,
	Icon1,
	Icon2,
}: {
	toggleFn: () => void;
	toggledValue: boolean;
	Icon1: ReactNode;
	Icon2: ReactNode;
}) {
	return (
		<div
			className={`
				relative bg-white border rounded-full inline-flex items-center cursor-pointer w-9 h-9
				transition-all duration-200 ease-in-out
				${
					toggledValue
						? "border-green-400 shadow-[0_0_0_1px_rgba(74,222,128,0.2)] hover:shadow-[0_0_0_2px_rgba(74,222,128,0.3)]"
						: "border-gray-200 shadow-sm hover:border-gray-300"
				}
			`}
		>
			<div
				onClick={toggleFn}
				className="w-full h-full relative flex justify-center items-center outline-none"
			>
				<div className="relative z-20 flex justify-center items-center w-full h-full">
					{toggledValue ? Icon1 : Icon2}
				</div>
				<span
					className={`
						absolute inset-0 rounded-full
						transition-all duration-300 ease-in-out z-10
						${toggledValue ? "bg-green-50" : "bg-gray-50"}
					`}
				/>
			</div>
		</div>
	);
}
