"use client";

import { Form } from "react-final-form";
import React from "react";
import { getUserLogin, validateLoginForm } from "./utils";

import Link from "next/link";
import TextInput from "../formFiels/textInputField";
import { PasswordInput } from "../formFiels/passwordInput";
import FormButton from "../formFiels/formButton";
import { useRouter } from "next/navigation";
import { FORM_ERROR } from "final-form";
import { AxiosError, AxiosResponse } from "axios";
import SmileFaceLoader from "@/loaders/smileFace/smileFace";
import { LoginFormDataInterface } from "@/endpointActions/postLoginAction";

export default function LoginForm() {
	let router = useRouter();
	const onSubmitFunc = (values: LoginFormDataInterface) =>
		getUserLogin(values)
			.then((resAxios: AxiosResponse) => {
				if (resAxios.status === 200) {
					router.push("/profile");
				}
				// console.log(resAxios)
			})
			.catch((error: AxiosError) => {
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
			});

	return (
		<div className={` overflow-hidden`}>
			<Form
				onSubmit={onSubmitFunc}
				validate={(values) => validateLoginForm(values)}
				initialValues={{}}
				render={({
					handleSubmit, //
					form, // form.reset
					submitSucceeded, //
					submitting, // submitting status use it to disable button
					values, // form values
					pristine, // pristine status use it to disable reset button
					submitError, // errors returned from onSubmit
				}) => {
					return (
						<form
							onSubmit={handleSubmit}
							className="max-w-[600px] h-full relative "
						>
							{(submitting || submitSucceeded) && (
								<div className="w-full flex -top-5  h-[108%] justify-center items-center  backdrop-blur-sm  z-10 absolute ">
									<SmileFaceLoader />
								</div>
							)}
							<div className="mb-10">
								<TextInput label="Email" name="email" values={values} />

								<PasswordInput
									label="Password"
									name="password"
									values={values}
								/>

								<div className=" text-red-500">
									{/* submit errors */}
									{submitError}
								</div>
							</div>
							<div className="my-3">
								Don't have an account?{" "}
								<Link href={"signup"} className="text-secondary">
									Sign up
								</Link>
							</div>
							<div className="flex flex-wrap justify-between gap-5 buttons m-auto">
								<FormButton submitting={submitting} label=" LogIn " />
								{/* <GoogleButton className="" /> */}
							</div>
						</form>
					);
				}}
			/>
		</div>
	);
}
