import { clientApi } from "@/baseApis/axiosBase";
export interface LoginFormDataInterface {
	email: string;
	password: string;
}

export default function postLoginAction(values: LoginFormDataInterface) {
	return clientApi.post("/auth/login", values);
}
