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
			{projects.map((project: ProjectInterface) => (
				<ProjectBox key={project.id} project={project} />
			))}
		</>
	);
}
export function ProjectBox({ project }: { project: ProjectInterface }) {
	const router = useRouter();
	const appDispatch = useAppDispatch();
	const handleDeleteArticleBtn = async (
		event: React.MouseEvent<HTMLElement>
	) => {
		event.preventDefault();
	};
	const handleEditArticleBtn = (event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault();
		appDispatch(getCurrentUserProject({ projectId: project.id })).then(() => {
			router.push(pagePaths.projectPage + "/" + project.id);
		});
	};
	return (
		<div className="shadow">
			<div
				key={project.id}
				className="h-full bg-white text-primary flex flex-col justify-end overflow-hidden rounded  pb-0 px-6 mx-auto   dark:shadow-black  dark:bg-dark-secondary dark:text-primary   dark:border-slate-700"
			>
				<h2 className=" py-5 text-center text-primary  capitalize font-bold  text-2xl ">
					{project.name}
				</h2>
				<h3 className=" py-2 text-center   capitalize font-semibold  text-xl ">
					{project.title}
				</h3>

				<div className="">
					<div className="flex justify-between  dark:text-gray-400 pb-2  ">
						<div className="">
							<p className=" font-semibold capitalize">used credits</p>
							<p className="text-gray-500 text-center">
								{project.used_credits}
							</p>
						</div>
						<div className="">
							<p className=" font-semibold capitalize">Language</p>
							<p className="text-center text-gray-500">
								{project.lang || "  . . . . ."}
							</p>
						</div>
					</div>
					<div className="flex  gap-2   text-xs dark:text-gray-400 pb-2  ">
						<div className="flex gap-1">
							<p className=" font-semibold capitalize">Created:</p>
							<p className="text-gray-500">
								{project.id !== "error"
									? dateObjFromIsoStr(project.created_at).toDateString()
									: " ... ... ..."}
							</p>
						</div>
						<div className="flex gap-1">
							<span className="font-semibold"> at </span>
							<p className="text-gray-500">
								{project.id !== "error"
									? dateObjFromIsoStr(project.created_at).toLocaleTimeString()
									: " .. : ... : ..."}
							</p>
						</div>
					</div>
					<div className="flex  gap-2   text-xs dark:text-gray-400 pb-2  ">
						<div className="flex gap-1">
							<p className=" font-semibold capitalize">modified:</p>
							<p className="text-gray-500">
								{project.id !== "error"
									? dateObjFromIsoStr(project.modified_at).toDateString()
									: " ... ... ..."}
							</p>
						</div>
						<div className="flex gap-1">
							<span className="font-semibold"> at </span>
							<p className="text-gray-500">
								{project.id !== "error"
									? dateObjFromIsoStr(project.modified_at).toLocaleTimeString()
									: " .. : ... : ..."}
							</p>
						</div>
					</div>
				</div>
				<div className=" flex justify-center gap-4 items-center mt-1   border-t  borderlack py-3">
					<button datatype="link">
						<Link
							className=" flex group gap-2 px-2 !bg-primary shadow text-main hover:!text-action active:!text-action !rounded !outline-none   py-1"
							href={pagePaths.appPage + "/" + project.id}
						>
							<EditIcon className=" stroke-main group-active:stroke-action group-hover:stroke-action  " />
							Edit
						</Link>
					</button>
				</div>
			</div>
		</div>
	);
}
