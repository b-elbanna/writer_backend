"use client";

import { Form } from "react-final-form";
import { onSubmitCreateArticleFrom, validateCreateArticleForm } from "./utils";
import { useRef, useState } from "react";
import SmileFaceLoader from "@/loaders/smileFace/smileFace";
import TextInput from "../formFiels/textInputField";
import FormButton from "../formFiels/formButton";
import { CheckBoxContainer, CheckboxInput } from "../formFiels/checkBoxInput";
import useUserProjectsFetcher from "@/swrDataFetcher/userProjectsFetcher";
import { useRouter } from "next/navigation";
import pagePaths from "@/urlPaths/pagePaths";
import { RadioInput } from "../formFiels/radioInputField";
import {
	TypesOfWrittenContent,
	FeildsOfWrittenContent,
} from "./writtenContent";
import useMyEditor from "@/components/editor/editorBuilder";
export interface CreateProjectFormDataInterface {
	title: string;
	name: string;
	lang?: string;
	written_content: string;
	targeted_field: string;
	descriptions: string[];
	outline: string[];
}

export default function CreateProjectForm() {
	const { projects } = useUserProjectsFetcher();
	const router = useRouter();
	const [descriptionsData, setDescriptionsData] = useState<string[]>([]);
	const [checkboxVisibility, setCheckboxVisibility] = useState(false);
	const [descriptionLoader, setDescriptionLoader] = useState(false);
	const theEditor = useMyEditor();
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
					theEditor,
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
								labels={FeildsOfWrittenContent}
								optionValues={FeildsOfWrittenContent}
								values={values}
								name="targeted_field"
							/>
						</div>

						{checkboxVisibility && (
							<>
								<CheckBoxContainer label="Chose descriptions that match your target: ">
									<>
										{errors?.descriptions && (
											<p className="text-red-500 py-2">
												|{errors?.descriptions}
											</p>
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
							</>
						)}
						{descriptionLoader && (
							<div className="w-full flex my-7 justify-center items-center">
								<SmileFaceLoader />
							</div>
						)}
						<div className="buttons flex justify-end mt-10">
							<div className="w-full sm:w-auto">
								<FormButton
									label={submitSucceeded ? "Create" : "Submit"}
									submitting={submitting}
								/>
							</div>
						</div>
						{/* {values} */}
					</form>
				);
			}}
		/>
	);
}
