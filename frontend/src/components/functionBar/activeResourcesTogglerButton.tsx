import { FileSearchIcon, FileXIcon } from "lucide-react";
import MainTogglerButton from "../mainTogglerButton";
import { useAppDispatch, useAppSelector } from "@/rtk/store";
import { toggleActiveResources } from "@/rtk/slices/isActiveResources";
import { SimpleTooltip } from "../simpleTooltip";

export default function ActiveResourcesTogglerButton() {
	const appDispatch = useAppDispatch();
	const isActiveResources = useAppSelector((state) => state.isActiveResources);

	return (
		<div className="pointer-events-auto flex items-center gap-3">
			<SimpleTooltip
				tooltip={`${
					isActiveResources ? "Resources Search Activated" : "Resources Ignored"
				}`}
				delay={0}
			>
				<div>
					<MainTogglerButton
						toggledValue={isActiveResources}
						toggleFn={() => appDispatch(toggleActiveResources())}
						Icon1={
							<FileSearchIcon className="w-[18px] h-[18px] text-green-600" />
						}
						Icon2={<FileXIcon className="w-[18px] h-[18px] text-primary" />}
					/>
				</div>
			</SimpleTooltip>
			{/* <span className="text-sm font-medium text-gray-600">
				{isActiveResources ? "Search Active" : "Search Off"}
			</span> */}
		</div>
	);
}
