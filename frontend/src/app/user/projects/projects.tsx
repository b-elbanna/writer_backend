import { CustomButton } from "@/components/forms/formFiels/customButton";
import { getCurrentUserProject } from "@/rtk/slices/currentUserProject";
import { useAppDispatch } from "@/rtk/store";
import pagePaths from "@/urlPaths/pagePaths";
import dateObjFromIsoStr from "@/utils/datTimeRep";
import { EditIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function ProjectsBox({ projects }: { projects: ProjectInterface[] }) {
	return (
		<>
			{" "}
			{projects.length > 0 ? (
				projects.map((project: ProjectInterface) => (
					<ProjectBox key={project.id} project={project} />
				))
			) : (
				<div className="col-span-full flex flex-col items-center justify-center py-16 px-4">
					<div className="relative">
						<div className="absolute -inset-0.5 bg-gradient-to-r from-action to-primary opacity-20 blur"></div>
						<div className="relative bg-white/80 backdrop-blur-sm px-6 py-8 rounded-xl shadow-sm ring-1 ring-gray-900/5 max-w-md mx-auto text-center">
							<svg
								className="w-12 h-12 mx-auto mb-4 text-gray-400"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="1.5"
									d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
								/>
							</svg>
							<h3 className="text-xl font-semibold text-gray-900 mb-2">
								No projects yet
							</h3>
							<p className="text-gray-500 mb-6">
								Get started by creating your first project. You can create
								articles, research papers, or any other written content.
							</p>
							<button
								onClick={() =>
									document
										.querySelector<HTMLButtonElement>(
											'button[aria-label="Create new project"]'
										)
										?.click()
								}
								className="inline-flex items-center justify-center gap-2 bg-action hover:bg-action/90 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 hover:shadow-md"
							>
								<svg
									className="w-5 h-5"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M12 4v16m8-8H4"
									/>
								</svg>
								<span>Create Project</span>
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
export function ProjectBox({ project }: { project: ProjectInterface }) {
	const router = useRouter();
	const appDispatch = useAppDispatch();
	const handleEditArticleBtn = (event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault();
		appDispatch(getCurrentUserProject({ projectId: project.id })).then(() => {
			router.push(pagePaths.appPage + "/" + project.id);
		});
	};

	const createdDate =
		project.id !== "error" ? dateObjFromIsoStr(project.created_at) : new Date();
	const modifiedDate =
		project.id !== "error"
			? dateObjFromIsoStr(project.modified_at)
			: new Date();

	return (
		<div className="group relative bg-white/90 backdrop-blur-sm rounded-xl shadow-md hover:shadow-xl ring-1 ring-gray-900/5 transition-all duration-300 overflow-hidden">
			<div className="absolute inset-0 bg-gradient-to-br from-primary/[0.07] via-transparent to-[#aa2236]/[0.1] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
			<div className="relative p-6 flex flex-col h-full">
				<div className="mb-6">
					<div className="flex items-center justify-between mb-2">
						<h2 className="text-xl sm:text-2xl font-bold text-primary capitalize group-hover:text-primary/80 transition-colors line-clamp-1">
							{project.name}
						</h2>
						<span className="text-xs px-2 py-1 rounded-full bg-action/10 text-action font-medium">
							{project.lang === "en" ? "English" : "Arabic"}
						</span>
					</div>
					<h3 className="text-base sm:text-lg text-gray-600 capitalize line-clamp-2">
						{project.title}
					</h3>
				</div>{" "}
				<div className="flex-grow space-y-6">
					<div className="grid grid-cols-2 gap-4">
						<div className="bg-gray-50/80 p-3 rounded-lg backdrop-blur-sm ring-1 ring-gray-900/5">
							<p className="text-sm font-medium text-gray-600 mb-1">
								Credits Used
							</p>
							<div className="flex items-baseline gap-1">
								<p className="text-xl font-semibold text-primary">
									{project.used_credits}
								</p>
								<span className="text-xs text-gray-500">credits</span>
							</div>
						</div>
						<div className="bg-gray-50/80 p-3 rounded-lg backdrop-blur-sm ring-1 ring-gray-900/5">
							<p className="text-sm font-medium text-gray-600 mb-1">
								Word Count
							</p>
							<div className="flex items-baseline gap-1">
								<p className="text-xl font-semibold text-primary">
									{project.article_text
										?.split(/\s+/)
										.filter((word) => word.length > 0).length || 0}
								</p>
								<span className="text-xs text-gray-500">words</span>
							</div>
						</div>
					</div>

					<div className="space-y-2.5 text-sm text-gray-500">
						<div className="flex justify-between items-center py-1">
							<span className="font-medium flex items-center gap-1.5">
								<svg
									className="w-4 h-4 text-gray-400"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								Created
							</span>
							<time
								dateTime={createdDate.toISOString()}
								className="text-gray-600"
							>
								{createdDate.toLocaleDateString()} at{" "}
								{createdDate.toLocaleTimeString()}
							</time>
						</div>
						<div className="flex justify-between items-center py-1">
							<span className="font-medium flex items-center gap-1.5">
								<svg
									className="w-4 h-4 text-gray-400"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
									/>
								</svg>
								Modified
							</span>
							<time
								dateTime={modifiedDate.toISOString()}
								className="text-gray-600"
							>
								{modifiedDate.toLocaleDateString()} at{" "}
								{modifiedDate.toLocaleTimeString()}
							</time>
						</div>
					</div>
				</div>
				<div className="mt-6 pt-6 border-t border-gray-100">
					<Link
						href={pagePaths.appPage + "/" + project.id}
						onClick={handleEditArticleBtn}
						className="flex items-center justify-center gap-2 w-full bg-action hover:bg-action/90 text-white py-3 px-4 rounded-lg transition-all duration-200 hover:shadow-md group/btn"
					>
						<EditIcon className="w-4 h-4 transition-transform duration-200 group-hover/btn:-translate-y-0.5" />
						<span className="font-medium">Open Project</span>
					</Link>
				</div>
			</div>
		</div>
	);
}
