import postSignupAction from "@/endpointActions/postSignupAction";
import { SignupFormDataInterface } from "@/endpointActions/postSignupAction";
import { FORM_ERROR } from "final-form";
import { useCallback } from "react";

export function useOnSubmitSignup() {
	const onSubmitSignup = useCallback(
		(values: SignupFormDataInterface) =>
			postSignupAction({
				...values,
			}).catch((error) => {
				if (error.response) {
					if (error.response?.status === 400) {
						let res = error.response?.data;
						let emailError = res?.email;
						let passwordError = res?.password;
						let firstNameError = res?.first_name;
						let lastNameError = res?.last_name;
						let non_field_errors = res?.non_field_errors;

						return {
							[FORM_ERROR]:
								firstNameError ||
								lastNameError ||
								passwordError ||
								emailError ||
								non_field_errors ||
								"Unable to sign in with provided credentials.",
						};
					} else if (error.response?.status >= 500) {
						// server error
						return { [FORM_ERROR]: error.message };
					}
				} else {
					// connection error
					return { [FORM_ERROR]: error.message };
				}
			}),
		[]
	);
	return { onSubmitSignup };
}
