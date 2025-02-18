import postCreateDescriptionAction from "@/endpointActions/postCreateDescriptionAction";
import { CreateProjectFormDataInterface } from "./createProjectForm";
import React from "react";
import postCreateOutlineAction from "@/endpointActions/postCreateOutlineAction";
import postCreateProjectAction from "@/endpointActions/postCreateProjectAction";

let onChangeTimer: string | number | NodeJS.Timeout | undefined;
let dataSent = false;

export async function onSubmitCreateArticleFrom(
	values: CreateProjectFormDataInterface,
	checkboxVisibility: boolean,
	setCheckboxVisibility: React.Dispatch<React.SetStateAction<boolean>>,
	setDescriptionLoader: React.Dispatch<React.SetStateAction<boolean>>,
	setDescriptionsData: React.Dispatch<React.SetStateAction<string[]>>,
	onSubmitRedirect: (projectId: string) => void
) {
	if (!checkboxVisibility) {
		// 1. on first submit create descriptions
		setDescriptionLoader(true);
		await postCreateDescriptionAction({
			title: `  ${values.targeted_field}  ${values.written_content} title is  '${values.title}'`,
		}).then((res) => {
			const descriptions = res.data.descriptions;
			console.log(descriptions);
			setCheckboxVisibility(true);
			setDescriptionsData(descriptions);
			setDescriptionLoader(false);
		});
	} else {
		// 2. on second submit generate article (with outLine)
		console.log("creating outline");
		await postCreateOutlineAction({
			title: values.title,
			discription: values?.descriptions.join(","),
		}).then(async (res) => {
			// create project
			console.log("creating project");
			const creatRes = await postCreateProjectAction({
				title: values.title,
				description: values?.descriptions.join(","),
				name: values.name,
				lang: values.lang,
				outline: res.data?.outline,
			});
			const projectId = (creatRes.data as ProjectInterface).id;
			onSubmitRedirect(projectId);
		});
	}
}

export function validateCreateArticleForm(
	values: CreateProjectFormDataInterface,
	checkboxVisibility: boolean,
	userArticles: ProjectInterface[]
) {
	const errors: any = {};
	console.log("validateCreateArticleForm");
	if (onChangeTimer) {
		clearTimeout(onChangeTimer);
	}
	if (values?.title?.length > 200) {
		errors.title = " |maximum  200 characters";
	}
	if (values?.title?.length < 3) {
		errors.title = " |minimum  3 characters";
	}
	if (values?.name?.length < 3) {
		errors.name = " |minimum  3 characters";
	}
	for (let userArticle of userArticles) {
		if (values?.name === userArticle?.name) {
			errors.name = " |must be unique";
		}
	}
	if (!values?.title) {
		errors.title = " | required";
	}
	if (!values?.name) {
		errors.name = " | required";
	}
	if (!values?.descriptions?.length && checkboxVisibility) {
		errors.descriptions = " required";
	}

	if (!values?.lang) {
		errors.lang = " |required";
	}

	if (
		!errors?.title &&
		!errors?.name &&
		values?.title &&
		values?.name &&
		values?.lang
	) {
		// create description if data are valid
		onChangeTimer = setTimeout(async () => {}, 1000);
	}

	return errors;
}
