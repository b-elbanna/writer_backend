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
		<div className="border shadow-md p-1 z-10 bg-main  rounded-full inline-flex items-center cursor-pointer">
			<div
				onClick={toggleFn}
				className={` group relative  flex justify-between items-center outline-none duration-100  peer-focus:outline-none`}
			>
				{Icon1}
				{Icon2}
				<span
					className={`${!toggledValue && " translate-x-[-100%] bg-mygray "}${
						toggledValue && " bg-green-300 "
					} duration-500 absolute border-black  border-2 group-active:bg-black   rounded-full h-[25px] w-[25px]  right-0 flex justify-center items-center font-bold`}
				></span>
			</div>
		</div>
	);
}
