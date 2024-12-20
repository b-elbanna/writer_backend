import { clientApi } from "@/baseApis/axiosBase";

interface Values {
	text_source: string;
	url?: string;
	name: string;
	type: "text" | "wiki" | "pdf" | "audio" | "video" | "youtube";
}

export default function postCreateResourceAction(values: Values) {
	return clientApi.post("/qa/resources", values);
}
