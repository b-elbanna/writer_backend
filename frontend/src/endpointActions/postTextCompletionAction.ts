import { clientApi } from "@/baseApis/axiosBase";
export interface PostTextCompletionActionInterface {
	original_text: string;
	project: string;
}
export default function postTextCompletionAction(
	values: PostTextCompletionActionInterface
) {
	return clientApi.post("/writing/tools/completion", values);
}
