import { setprojectOpenedTool } from "@/rtk/slices/projectOpenedTool";
import { useAppDispatch, useAppSelector } from "@/rtk/store";
import writtingTools from "./writtingToolsData";
import { SimpleTooltip } from "../../simpleTooltip";

export default function WritingToolsBar() {
	const appDispatch = useAppDispatch();
	const openedTool = useAppSelector((state) => state.projectOpenedTool);
	return (
		<nav>
			<ul className="flex flex-row-reverse pointer-events-auto gap-2 items-end">
				{writtingTools.map((tool) => (
					<li
						key={tool.id}
						className={`${
							openedTool.id === tool.id ? " text-active" : ""
						} font-semibold capitalize delay-0  `}
					>
						<SimpleTooltip tooltip={tool.description} delay={0}>
							<button
								className={` ${
									openedTool.id === tool.id
										? " border-active border-4 shadow-xl"
										: "border shadow-md"
								} p-2 rounded-full flex items-center justify-center bg-main`}
								onClick={() => {
									appDispatch(setprojectOpenedTool(tool));
								}}
							>
								{<tool.Icon />}
							</button>
						</SimpleTooltip>
					</li>
				))}
			</ul>
		</nav>
	);
}
