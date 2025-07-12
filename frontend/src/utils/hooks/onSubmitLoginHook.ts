"use client";
import postLoginAction, {
	LoginFormDataInterface,
} from "@/endpointActions/postLoginAction";
import { FORM_ERROR } from "final-form";
import { useCallback } from "react";


export function useOnSubmitLogin() {
	const onSubmitLogin = useCallback(
		async (values: LoginFormDataInterface) =>
			await postLoginAction(values).catch((error) => {
				if (error.response) {
					if (error.response?.status === 400) {
						// client error
						console.log(error.response?.data);
						let res = error.response?.data as { non_field_errors?: string };
						console.log(res?.non_field_errors);
						return {
							[FORM_ERROR]:
								res?.non_field_errors ||
								"Unable to log in with provided credentials.",
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
	return { onSubmitLogin };
}
