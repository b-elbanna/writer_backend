import { clientApi } from "@/baseApis/axiosBase";
export interface SignupFormDataInterface {
	email: string;
	password: string;
	first_name: string;
	last_name: string;
	google_api_key: string;
}

export default function postSignupAction(values: SignupFormDataInterface) {
	console.log(values);
	return clientApi.post("/auth/registration/signup", values);
}
