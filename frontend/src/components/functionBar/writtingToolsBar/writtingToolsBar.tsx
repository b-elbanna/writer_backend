import { setprojectOpenedTool } from "@/rtk/slices/projectOpenedTool";
import { useAppDispatch, useAppSelector } from "@/rtk/store";
import writtingTools from "./writtingToolsData";
import { SimpleTooltip } from "../../simpleTooltip";
import ActiveResourcesTogglerButton from "../activeResourcesTogglerButton";
import ProjectBarInfo from "./projectBarInfo";

export default function WritingToolsBar() {
	const appDispatch = useAppDispatch();
	const openedTool = useAppSelector((state) => state.projectOpenedTool);
	const currentUserProject = useAppSelector(
		(state) => state.currentUserProject
	);

	return (
		<div
			className={`
      right-0 
      ${
				openedTool.id ? "top-0" : "absolute -translate-y-full bottom-4"
			}      px-4 md:px-6 flex items-center justify-between w-full z-10 
      py-3 transition-all duration-500 ease-in-out delay-200 
      bg-gradient-to-r from-[#aa2236]/5 via-white to-primary/5 border-b bg-white border-gray-200 shadow-md
      backdrop-blur-sm
    `}
		>
			<ProjectBarInfo />

			<div className="flex items-center justify-end gap-4">
				<nav className="relative">
					<ul className="flex flex-row-reverse pointer-events-auto gap-3 items-center">
						{writtingTools.map((tool) => (
							<li
								key={tool.id}
								className={`transform transition-all duration-300 ease-in-out ${
									openedTool.id === tool.id ? "text-action" : ""
								}`}
							>
								<SimpleTooltip tooltip={tool.description} delay={0}>
									<button
										className={`
                      relative p-3 rounded-lg flex items-center justify-center
                      transition-all duration-300 ease-in-out
                      hover:scale-105 hover:shadow-md
                      ${
												openedTool.id === tool.id
													? "bg-action/5 text-action border-action/20 border shadow-md scale-105"
													: "bg-white text-gray-600 hover:text-action border border-gray-200 hover:border-action/20"
											}
                    `}
										onClick={() => {
											appDispatch(setprojectOpenedTool(tool));
										}}
									>
										<tool.Icon
											className={`w-5 h-5 transition-transform duration-300 ${
												openedTool.id === tool.id ? "scale-110" : ""
											}`}
										/>
									</button>
								</SimpleTooltip>
							</li>
						))}
					</ul>
				</nav>
			</div>
		</div>
	);
}
