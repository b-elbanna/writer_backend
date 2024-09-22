import postLoginAction, {
	LoginFormDataInterface,
} from "@/endpointActions/postLoginAction";
function validateLoginForm(values: LoginFormDataInterface) {
	const errors: any = {};
	const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	const passRegex = /^(?=.*\d)(?=.*[a-z]).{8,20}$/;

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
		if (values.password.length < 31) {
			if (values.password.length < 8) {
				errors.password = " minimum 8 characters ";
			}
		} else {
			errors.password = " maximum  30 characters";
		}
	} else errors.password = " is required";

	return errors;
}
const getUserLogin = (values: LoginFormDataInterface) => {
	return postLoginAction(values);
};
export { validateLoginForm, getUserLogin };
