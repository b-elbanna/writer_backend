import { useAppSelector } from "@/rtk/store";
import { CircleCheckIcon, LoaderCircleIcon } from "lucide-react";

export default function ProjectBarInfo() {
	const currentUserProject = useAppSelector(
		(state) => state.currentUserProject
	);
	return (
		<div className="py-4 flex gap-2 items-center">
			<h1 className="font-bold capitalize text-2xl">
				{currentUserProject.value.name}
			</h1>
			<div className=" flex items-center gap-1">
				<span className="">Credits:</span>
				<span className="font-bold">
					{currentUserProject.value.used_credits}
				</span>
			</div>
			{(currentUserProject.status === "pending" ||
				currentUserProject.status === "updating") && (
				<LoaderCircleIcon className="animate-spin stroke-active" />
			)}
			{currentUserProject.status === "updated" && (
				<CircleCheckIcon className="stroke-active" />
			)}
		</div>
	);
}
