import { clientApi } from "@/baseApis/axiosBase";

interface Values {
	text_source: string;
	url?: string;
	name: string;
	qaBoxId: string;
	type: "text" | "wiki" | "pdf" | "audio" | "video" | "youtube";
}

export default function postCreateQABoxResourceAction(values: Values) {
	return clientApi.post(`/qa/qa-box/${values.qaBoxId}/resources`, {
		text_source: values.text_source,
		url: values.url,
		name: values.name,
		type: values.type,
	});
}
