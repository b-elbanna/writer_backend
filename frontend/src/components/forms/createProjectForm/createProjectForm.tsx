"use client";

import { Form } from "react-final-form";
import { onSubmitCreateArticleFrom, validateCreateArticleForm } from "./utils";
import { useRef, useState } from "react";
import postCreateDescriptionAction from "@/endpointActions/postCreateDescriptionAction";
import postCreateOutlineAction from "@/endpointActions/postCreateOutlineAction";
import SmileFaceLoader from "@/loaders/smileFace/smileFace";
import TextInput from "../formFiels/textInputField";
import FormButton from "../formFiels/formButton";
import { CheckBoxContainer, CheckboxInput } from "../formFiels/checkBoxInput";
import useUserProjectsFetcher from "@/swrDataFetcher/userProjectsFetcher";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/rtk/store";
import { createUserProject } from "@/rtk/slices/currentUserProject";
import pagePaths from "@/urlPaths/pagePaths";
import { RadioInput } from "../formFiels/radioInputField";
import { values } from "pdf-lib";
import { set } from "zod";

export interface CreateProjectFormDataInterface {
	title: string;
	name: string;
	lang?: string;
	written_content: string;
	targeted_field: string;
	descriptions: string[];
	outline: string[];
}

const TypesOfWrittenContent = [
	{
		type: "blogposts",
		name: "Blog Posts",
		description:
			"Share your thoughts, experiences, or expertise on various topics with a personal touch.",
		planning_and_workflow: [
			"Identify your target audience.",
			"Choose a relevant and engaging topic.",
			"Conduct research to support your post.",
			"Create an outline with key points.",
			"Write a catchy introduction.",
			"Develop the body with detailed insights.",
			"Write a conclusion that summarizes the post.",
			"Edit for clarity and grammar.",
			"Incorporate images or graphics.",
			"Optimize for SEO with keywords.",
			"Format for readability with headings and bullet points.",
			"Publish on your blog platform.",
			"Promote via social media and email.",
		],
	},
	{
		type: "article",
		name: "Article",
		description:
			"Provide in-depth analysis or information on specific subjects, often for online magazines or news outlets.",
		planning_and_workflow: [
			"Define your target readership.",
			"Select a current or significant topic.",
			"Gather comprehensive research and sources.",
			"Draft a detailed outline with sections.",
			"Write an engaging and informative introduction.",
			"Develop each section with thorough analysis.",
			"Conclude with a strong, summarizing statement.",
			"Fact-check and edit for accuracy and style.",
			"Incorporate quotes, data, and images as needed.",
			"Format according to publication guidelines.",
			"Submit to the desired publication or platform.",
		],
	},
	{
		type: "script",
		name: "Script",
		description:
			"Write for screen or stage, creating dialogue and action for films, TV shows, or theater productions.",
		planning_and_workflow: [
			"Develop a compelling concept and characters.",
			"Outline the script with scenes and key events.",
			"Write the script using proper format and structure.",
			"Focus on creating natural and engaging dialogue.",
			"Revise for pacing, clarity, and character development.",
			"Seek feedback from collaborators or script consultants.",
			"Submit to production companies or film festivals.",
		],
	},
	{
		type: "shortstory",
		name: "Short Story",
		description:
			"Craft engaging narratives that are brief but impactful, perfect for capturing readers' attention quickly.",
		planning_and_workflow: [
			"Develop a unique concept and main characters.",
			"Outline the plot with key events.",
			"Write a compelling opening to draw readers in.",
			"Develop the middle with tension and conflict.",
			"Conclude with a memorable or impactful ending.",
			"Edit for pacing, clarity, and character development.",
			"Seek feedback from beta readers.",
			"Submit to literary magazines or publish online.",
		],
	},
	{
		type: "novel",
		name: "Novel",
		description:
			"Develop intricate plots and characters over a longer format, allowing for deep storytelling.",
		planning_and_workflow: [
			"Create a detailed plot outline and character profiles.",
			"Set a writing schedule with specific goals.",
			"Write the first draft, focusing on getting the story down.",
			"Edit and revise for plot consistency and depth.",
			"Seek feedback from beta readers or writing groups.",
			"Revise based on feedback and edit for quality.",
			"Consider professional editing services.",
			"Publish traditionally or self-publish.",
		],
	},

	{
		type: "ebook",
		name: "E-book",
		description:
			"Provide comprehensive content on a particular subject, available in digital format for readers to download and enjoy.",
		planning_and_workflow: [
			"Identify the target audience and purpose.",
			"Outline chapters and sections in detail.",
			"Write the content systematically, chapter by chapter.",
			"Edit for content quality and readability.",
			"Design the e-book layout and cover.",
			"Format for various e-book platforms.",
			"Publish on e-book marketplaces and promote.",
		],
	},

	{
		type: "documentation",
		name: "Documentation",
		description:
			"Create manuals, guides, and documentation to explain complex information clearly and concisely.",
		planning_and_workflow: [
			"Understand the subject matter and audience needs.",
			"Outline the document structure.",
			"Write with clear and precise language.",
			"Include diagrams or illustrations as needed.",
			"Edit for accuracy and usability.",
			"Publish and update regularly based on feedback.",
		],
	},
];
const FielsOfWrittenContent = [
	"scientific",
	"IT",
	"health",
	"business",
	"personal",
];
export default function CreateProjectForm() {
	const { projects } = useUserProjectsFetcher();
	const router = useRouter();
	const appDispatch = useAppDispatch();
	const [descriptionsData, setDescriptionsData] = useState<string[]>([]);
	const [checkboxVisibility, setCheckboxVisibility] = useState(false);
	const [descriptionLoader, setDescriptionLoader] = useState(false);
	const createdProject = useAppSelector((state) => state.currentUserProject);
	const currentProject = useRef<CreateProjectFormDataInterface>({
		title: "",
		lang: "en",
		name: "",
		descriptions: [],
		outline: [],
		written_content: "article",
		targeted_field: "scientific",
	});

	return (
		<Form
			onSubmit={async (values: CreateProjectFormDataInterface) =>
				await onSubmitCreateArticleFrom(
					values,
					checkboxVisibility,
					setCheckboxVisibility,
					setDescriptionLoader,
					setDescriptionsData,
					(projectId) => router.push(pagePaths.appPage + "/" + projectId)
				)
			}
			validate={(values) => {
				currentProject.current = values;
				return validateCreateArticleForm(values, checkboxVisibility, projects);
			}}
			initialValues={{
				lang: currentProject.current.lang,
				title: currentProject.current.title,
				name: currentProject.current.name,
				written_content: currentProject.current.written_content,
				targeted_field: currentProject.current.targeted_field,
				descriptions: descriptionsData,
			}}
			render={({
				handleSubmit, //
				form, // form.reset
				submitSucceeded, //
				submitting, // submitting status use it to disable button
				values, // form values
				pristine, // pristine status use it to disable reset button
				submitError, // errors returned from onSubmit
				errors,
			}) => {
				return (
					<form onSubmit={handleSubmit} className="mt-5 h-full relative ">
						{submitting && checkboxVisibility && (
							<div className="w-full flex -top-5  h-full justify-center items-center  backdrop-blur-sm  z-10 absolute ">
								<SmileFaceLoader />
							</div>
						)}
						<div className=" flex flex-wrap items-end justify-center gap-5">
							<TextInput label={"Name"} name="name" values={values} />
							<TextInput label={"Title"} name="title" values={values} />

							<RadioInput
								labels={["English", "Arabic"]}
								optionValues={["en", "ar"]}
								values={values}
								name="lang"
							/>
							<RadioInput
								labels={TypesOfWrittenContent.slice(0, 3).map(
									(type) => type.name
								)}
								optionValues={TypesOfWrittenContent.slice(0, 3).map(
									(type) => type.type
								)}
								values={values}
								name="written_content"
							/>
							<RadioInput
								labels={FielsOfWrittenContent}
								optionValues={FielsOfWrittenContent}
								values={values}
								name="targeted_field"
							/>
						</div>

						{checkboxVisibility && (
							<CheckBoxContainer label="Chose descriptions that match your target: ">
								<>
									{errors?.descriptions && (
										<p className="text-red-500 py-2">|{errors?.descriptions}</p>
									)}
									{descriptionsData?.map((description, i) => {
										// console.log(description);
										return (
											<CheckboxInput
												key={i}
												optionValue={description}
												label={description}
												name="descriptions"
												values={values}
											/>
										);
									})}
								</>
							</CheckBoxContainer>
						)}
						{descriptionLoader && (
							<div className="w-full flex my-7 justify-center items-center">
								<SmileFaceLoader />
							</div>
						)}

						{/* {values} */}

						<div className="buttons flex justify-end mt-10">
							<div className="w-full sm:w-auto">
								<FormButton
									label={submitSucceeded ? "Create" : "Submit"}
									submitting={submitting}
								/>
							</div>
						</div>
					</form>
				);
			}}
		/>
	);
}
