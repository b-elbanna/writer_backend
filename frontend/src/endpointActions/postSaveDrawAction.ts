import { clientApi } from "@/baseApis/axiosBase";

export default function postSaveDrawAction(draw_id: string, elements: any[]) {
	return clientApi.patch(`writing/draw/${draw_id}`, { elements });
}
