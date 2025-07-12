import { Values } from "./signupForm";

function validateSignupForm(values: Values) {
	const errors: any = {};
	const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	const passRegex = /^(?=.*\d)(?=.*[a-z]).{8,20}$/;
	const api_key_regex = /^AIzaSy[A-Za-z0-9_-]{33}$/;

	if (values.first_name) {
		if (values.first_name.length > 30) {
			errors.first_name = " maximum  30 characters";
		}
	} else errors.first_name = " is required";
	if (values.last_name) {
		if (values.last_name.length > 30) {
			errors.last_name = " maximum  30 characters";
		}
	} else errors.last_name = " is required";
	if (values.email) {
		if (values.email.length < 31) {
			if (!emailRegex.test(values.email)) {
				errors.email = " not valid";
			}
		} else {
			errors.email = " maximum  30 characters";
		}
	} else errors.email = " is required";

	if (values.password) {
		if (values.password.length > 30) {
			errors.password = " maximum  30 characters";
		} else {
			if (values.password.length >= 8) {
				if (values.confirmPassword) {
					if (values.password !== values.confirmPassword) {
						errors.confirmPassword = " dosen't match";
					}
				} else errors.confirmPassword = " required";
				if (!passRegex.test(values.password)) {
					errors.password = " missing letter or number";
				}
			}
		}
	} else errors.password = " is required";

	if (values.google_api_key) {
		if (
			values.google_api_key.length < 39 ||
			!api_key_regex.test(values.google_api_key)
		) {
			console.log(values.google_api_key);
			errors.google_api_key = "not valid api key";
		}
	} else errors.google_api_key = " is required";

	return errors;
}

export { validateSignupForm };
