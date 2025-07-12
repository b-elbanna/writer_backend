import { createContext, useState } from "react";
import CreateDescriptionForm from "../forms/createDescriptionForm/createDescriptionForm";
import CreateOutlineForm from "../forms/createOutlineForm/createOutlineForm";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CustomButton } from "../forms/formFiels/customButton";
import postCreateProjectAction from "@/endpointActions/postCreateProjectAction";
import { useRouter } from "next/navigation";
import pagePaths from "@/urlPaths/pagePaths";

export interface CreateProjectDataInterface {
	title?: string;
	name?: string;
	lang?: string;
	article_text?: string;
	written_content: string;
	targeted_field: string;
	descriptions: string[];
	outline: string[];
	markdownOutline?: string;
}
export const ProjectDataContext = createContext<{
	projectData: CreateProjectDataInterface;
	setProjectData: React.Dispatch<
		React.SetStateAction<CreateProjectDataInterface>
	>;
}>(null!);
export default function ProjectCreationForms() {
	const router = useRouter();
	const [projectData, setProjectData] = useState<CreateProjectDataInterface>({
		lang: "en",
		descriptions: [],
		outline: [],
		written_content: "article",
		targeted_field: "scientific",
	});
	return (
		<ProjectDataContext.Provider value={{ projectData, setProjectData }}>
			<CreateDescriptionForm />
			{projectData?.descriptions?.length > 0 && projectData?.title && (
				<CreateOutlineForm />
			)}
			{projectData?.markdownOutline && (
				<div
					dir={projectData.lang === "en" ? "ltr" : "rtl"}
					style={{ maxHeight: "50vh" }}
					className="sm:p-10  py-10 px-3 border-t overflow-y-auto"
				>
					<div className="  bg-white py-10  sm:px-12 px-8 shadow-[0_0_30px_rgba(169,33,53,0.2)] ">
						<Markdown className={"prose"} remarkPlugins={[remarkGfm]}>
							{projectData?.markdownOutline}
						</Markdown>
					</div>
				</div>
			)}
			{projectData.title && projectData.name && (
				<div className=" flex justify-center my-10">
					<CustomButton
						dark
						onClickFunc={async () =>
							projectData.title &&
							projectData.name &&
							(await postCreateProjectAction({
								title: projectData.title,
								description: projectData?.descriptions.join(","),
								name: projectData.name,
								lang: projectData.lang,
								outline: projectData.outline,
								article_text: projectData.article_text,
							})
								.then((creatRes) => {
									const projectId = (creatRes.data as ProjectInterface).id;
									router.push(pagePaths.appPage + "/" + projectId);
								})
								.catch((err) => {
									console.log(err);
								}))
						}
					>
						Create Project
					</CustomButton>
				</div>
			)}
		</ProjectDataContext.Provider>
	);
}
