import { clientApi } from "@/baseApis/axiosBase";
export interface CreateDiscriptionFormDataInterface {
	title: string;
	lang?: string;
}
export default function postCreateDescriptionAction(
	values: CreateDiscriptionFormDataInterface
) {
	return clientApi.post("/writing/tools/article-description", values);
}
