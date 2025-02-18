import { FileQuestionIcon, FileXIcon } from "lucide-react";
import MainTogglerButton from "../mainTogglerButton";
import { useAppDispatch, useAppSelector } from "@/rtk/store";
import { toggleActiveResources } from "@/rtk/slices/isActiveResources";
import { SimpleTooltip } from "../simpleTooltip";

export default function ActiveResourcesTogglerButton() {
	const appDispatch = useAppDispatch();
	const isActiveResources = useAppSelector((state) => state.isActiveResources);
	return (
		<MainTogglerButton
			toggledValue={isActiveResources}
			toggleFn={() => appDispatch(toggleActiveResources())}
			Icon1={
				<FileQuestionIcon
					width={25}
					height={25}
					className="w-[25px] p-[2px] inline-block"
				/>
			}
			Icon2={
				<FileXIcon
					width={25}
					height={25}
					className="w-[25px] p-[2px]  h-[25px]  "
				/>
			}
		/>
	);
}
