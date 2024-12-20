import { clientApi } from "@/baseApis/axiosBase";

interface Values {
	name: string;
	projectId?: string;
}

export default function postCreateQABoxAction(values: Values) {
	let payload: {
		name: string;
		project?: string;
	} = { name: values.name };
	if (values.projectId) payload.project = values.projectId;
	return clientApi.post("qa/qa-boxes", {
		name: values.name,
	});
}
