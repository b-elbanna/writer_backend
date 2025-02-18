import { useAppSelector } from "@/rtk/store";
import WrittingToolsBar from "../functionBar/writtingToolsBar/writtingToolsBar";
import { CircleCheckIcon, LoaderPinwheel } from "lucide-react";

export default function ProjectNavbar() {
	const currentUserProject = useAppSelector(
		(state) => state.currentUserProject
	);
	return (
		<div className="sm:flex justify-between items-center border-b relative z-20  bg-gradient-to-t from-main to-white">
			<div className="flex flex-col justify-center items-center sm:items-start px-2 py-1">
				<h1 className="flex items-center gap-1 font-bold capitalize text-2xl">
					{currentUserProject.value.name}
				</h1>
				<div className="flex gap-2 items-center text-sm ">
					<div className=" flex flex-wrap items-end gap-1">
						<span className="font-bold">
							{currentUserProject.value.article_text?.length}
						</span>
						<span className="">Letters</span>
					</div>
					<div className=" flex flex-wrap items-end gap-1">
						<span className="font-bold">
							{
								currentUserProject.value.article_text
									?.split(/\s+/)
									.filter((word) => word.length > 0).length
							}
						</span>
						<span className="">Words</span>
					</div>
					<div className=" flex flex-wrap items-end gap-1">
						<span className="font-bold">
							{currentUserProject.value.used_credits}
						</span>
						<span className="">Credits</span>
					</div>

					<div>
						{currentUserProject.status === "updating" ? (
							<LoaderPinwheel
								size={22}
								className="animate-spin  stroke-mygray"
							/>
						) : (
							<CircleCheckIcon size={22} className=" stroke-green-300" />
						)}
					</div>
				</div>
			</div>
			<div className="flex justify-center  sm:block pb-2 sm:p-2 self-end">
				<WrittingToolsBar />
			</div>
		</div>
	);
}
