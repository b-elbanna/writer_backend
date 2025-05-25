import { clientApi } from "@/baseApis/axiosBase";
export interface SignupFormDataInterface {
	email: string;
	password: string;
	first_name: string;
	last_name: string;
}

export default function postSignupAction(values: SignupFormDataInterface) {
	return clientApi.post("/auth/registration/signup", values);
}
