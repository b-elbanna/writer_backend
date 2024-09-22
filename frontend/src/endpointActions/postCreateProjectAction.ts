import { clientApi } from "@/baseApis/axiosBase";
import { CreateProjectFormDataInterface } from "@/components/forms/createProjectForm/createProjectForm";

interface Values {
	title: string;
	name: string;
	lang?: string;
	description: string;
	outline: string[];
}

export default function postCreateProjectAction(values: Values) {
	return clientApi.post("/writing/projects", values);
}
