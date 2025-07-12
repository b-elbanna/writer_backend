import { clientApi } from "@/baseApis/axiosBase";

interface Values {
	title: string;
	name: string;
	lang?: string;
	description?: string;
	outline: string[];
	article_text?: string;
}

export default async function postCreateProjectAction(project: Values) {
	const response = await clientApi.post(`/writing/projects`, project);

	return response;
}
