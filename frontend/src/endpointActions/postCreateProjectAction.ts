import { clientApi } from "@/baseApis/axiosBase";

interface Values {
	title: string;
	name: string;
	lang?: string;
	description?: string;
	outline: string[];
}

export default async function postCreateProjectAction(project: Values) {
	const response = await clientApi.post(`/writing/projects`, project);
	let newProject: ProjectInterface = response.data;
	await clientApi.post(`qa/qa-boxes`, {
		name: newProject.name,
		project: newProject.id,
	});
	return response;
}
