import { useAppSelector } from "@/rtk/store";
import { CircleCheckIcon, LoaderCircleIcon, CreditCard } from "lucide-react";

export default function ProjectBarInfo() {
	const currentUserProject = useAppSelector(
		(state) => state.currentUserProject
	);

	return (
		<div className="flex gap-4 items-center">
			<h1 className="font-semibold capitalize text-xl text-gray-800">
				{currentUserProject.value.name}
			</h1>

			<div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm hover:shadow transition-all duration-200">
				<div className="flex items-center gap-2">
					<CreditCard className="w-4 h-4 text-gray-400" />
					<span className="text-sm font-medium text-gray-600">Credits:</span>
					<span className="font-semibold text-gray-900">
						{currentUserProject.value.used_credits}
					</span>
				</div>

				<div className="pl-2 border-l border-gray-200">
					{(currentUserProject.status === "pending" ||
						currentUserProject.status === "updating") && (
						<LoaderCircleIcon className="w-4 h-4 animate-spin text-blue-500" />
					)}
					{currentUserProject.status === "updated" && (
						<CircleCheckIcon className="w-4 h-4 text-green-500" />
					)}
				</div>
			</div>
		</div>
	);
}
