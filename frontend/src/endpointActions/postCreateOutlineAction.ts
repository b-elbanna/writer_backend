import { clientApi } from "@/baseApis/axiosBase";
export interface CreateOutlineFormDataInterface {
	title: string;
	description: string;
}
export default function postCreateOutlineAction(
	values: CreateOutlineFormDataInterface
) {
	return clientApi.post("/writing/tools/article-outline", values);
}
