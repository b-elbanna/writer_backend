import { CreateProjectFormDataInterface } from "./createProjectForm";

let onChangeTimer: string | number | NodeJS.Timeout | undefined;
let dataSent = false;
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
	if (values?.title?.length > 30) {
		errors.title = " |maximum  30 characters";
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
	if (values?.descriptions?.length < 3 && checkboxVisibility) {
		errors.descriptions = " minimum 3 choices";
	}

	if (!values?.lang) {
		errors.lang = " |required";
	}

	// if (values?.title && !errors?.title && !dataSent) {
	//   onChangeTimer = setTimeout(
	//     async () => {
	//   }
	// , 1000);
	// }

	return errors;
}
