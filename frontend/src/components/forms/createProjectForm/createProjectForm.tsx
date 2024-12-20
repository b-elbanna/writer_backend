"use client";

import { Form } from "react-final-form";
import { validateCreateArticleForm } from "./utils";
import { useRef, useState } from "react";
import postCreateDescriptionAction from "@/endpointActions/postCreateDescriptionAction";
import postCreateOutlineAction from "@/endpointActions/postCreateOutlineAction";
import SmileFaceLoader from "@/loaders/smileFace/smileFace";
import TextInput from "../formFiels/textInputField";
import FormButton from "../formFiels/formButton";
import { CheckBoxContainer, CheckboxInput } from "../formFiels/checkBoxInput";
import useUserProjectsFetcher from "@/swrDataFetcher/userProjectsFetcher";
import { redirect, useRouter } from "next/navigation";
import SelectionInput from "../formFiels/selectionInput";
import { useAppDispatch, useAppSelector } from "@/rtk/store";
import { createUserProject } from "@/rtk/slices/currentUserProject";
import pagePaths from "@/urlPaths/pagePaths";

export interface CreateProjectFormDataInterface {
	title: string;
	name: string;
	lang?: string;
	descriptions: string[];
	outline: string[];
}
export default function CreateProjectForm() {
	const { projects } = useUserProjectsFetcher();
	const router = useRouter();
	const appDispatch = useAppDispatch();
	const [descriptionsData, setDescriptionsData] = useState([]);
	const [checkboxVisibility, setCheckboxVisibility] = useState(false);
	const [descriptionLoader, setDescriptionLoader] = useState(false);
	const createdProject = useAppSelector((state) => state.currentUserProject);
	const currentProject = useRef<CreateProjectFormDataInterface>({
		title: "",
		lang: "en",
		name: "",
		descriptions: [],
		outline: [],
	});

	const onSubmitCreateArticle = async (
		values: CreateProjectFormDataInterface
	) => {
		if (values.title) {
			if (!checkboxVisibility) {
				// 1. on first submit create descriptions
				setDescriptionLoader(true);
				await postCreateDescriptionAction({
					title: values.title,
				})
					.then((res) => {
						setCheckboxVisibility(true);
						setDescriptionsData(res.data?.description);
						setDescriptionLoader(false);
					})
					.catch((err) => {
						console.log(err);
						// console.log(err?.response);
						// console.log(err?.response?.status);
						setDescriptionLoader(false);
					});
			} else {
				// 2. on second submit create article outLine
				setDescriptionLoader(true);
				await postCreateOutlineAction({
					title: values.title,
					discription: values?.descriptions.join(","),
				}).then(async (res) => {
					await appDispatch(
						createUserProject({
							project: {
								title: values.title,
								description: values?.descriptions.join(","),
								name: values.name,
								lang: values.lang,
								outline: res.data?.outline,
							},
						})
					).then((res) => {
						console.log(res);
						router.push(
							pagePaths.appPage + "/" + (res.payload as ProjectInterface).id
						);
					});
				});

				// setDescriptionLoader(false);
			}
		}
	};

	return (
		<Form
			onSubmit={onSubmitCreateArticle}
			validate={(values) => {
				currentProject.current = values;
				return validateCreateArticleForm(values, checkboxVisibility, projects);
			}}
			initialValues={{
				lang: currentProject.current.lang,
				title: currentProject.current.title,
				name: currentProject.current.name,
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
						{(submitting || descriptionLoader) && (
							<div className="w-full flex -top-5  h-full justify-center items-center  backdrop-blur-sm  z-10 absolute ">
								<SmileFaceLoader />
							</div>
						)}
						{!checkboxVisibility ? (
							<>
								<SelectionInput
									name="lang"
									label="Language"
									options={
										<>
											<option value="en">English</option>
											<option value="ar">Arabic</option>
										</>
									}
								/>
								<TextInput label={"Name"} name="name" values={values} />
								<TextInput label={"Title"} name="title" values={values} />
							</>
						) : (
							<CheckBoxContainer label="Chose descriptions that match your target: ">
								<>
									{errors?.descriptions && (
										<p className="text-red-500 py-2">|{errors.descriptions}</p>
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

						{/* {values} */}

						<div className="buttons flex justify-end mt-10">
							<div className="w-full sm:w-auto">
								<FormButton
									className="!px-1 !py-0"
									label={submitSucceeded ? "Create" : "Next"}
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
