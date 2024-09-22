import { clientApi } from "@/baseApis/axiosBase";

export default function postLogoutAction() {
	return clientApi.post("/auth/logout")
}