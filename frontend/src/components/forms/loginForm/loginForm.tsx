"use client";

import { Form } from "react-final-form";
import React from "react";
import { validateLoginForm } from "./utils";

import Link from "next/link";
import TextInput from "../formFiels/textInputField";
import { PasswordInput } from "../formFiels/passwordInput";
import FormButton from "../formFiels/formButton";
import SmileFaceLoader from "@/loaders/smileFace/smileFace";
import { useOnSubmitLogin } from "@/utils/hooks/onSubmitLoginHook";
import { useRouter } from "next/navigation";
import pagePaths from "@/urlPaths/pagePaths";
import useRefreshTokenPostFetcher from "@/swrDataFetcher/refreshTokenFetcher";

export default function LoginForm() {
	const router = useRouter();
	const { mutate } = useRefreshTokenPostFetcher();
	const { onSubmitLogin } = useOnSubmitLogin();
	return (
		<div className="w-full">
			<Form
				onSubmit={(v) => {
					onSubmitLogin(v).then(() => {
						mutate();
						router.push(pagePaths.projectsPage);
					});
				}}
				validate={validateLoginForm}
				initialValues={{}}
				render={({
					handleSubmit,
					submitSucceeded,
					submitting,
					values,
					submitError,
				}) => {
					return submitting || submitSucceeded ? (
						<div className="w-full flex justify-center items-center py-12">
							<SmileFaceLoader className="transform scale-150" />
						</div>
					) : (
						<form onSubmit={handleSubmit} className="w-full space-y-6">
							<div className="space-y-6">
								<TextInput label="Email" name="email" values={values} />

								<PasswordInput
									label="Password"
									name="password"
									values={values}
								/>
							</div>
							{submitError && (
								<div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
									{submitError}
								</div>
							)}{" "}
							<div className="space-y-6">
								<FormButton
									label="Sign In"
									submitting={submitting}
									className="bg-action hover:bg-action/90 text-white shadow-md"
								/>

								<div className="relative">
									<div className="absolute inset-0 flex items-center">
										<div className="w-full border-t border-gray-300"></div>
									</div>
									<div className="relative flex justify-center text-sm">
										<span className="px-2 bg-white text-gray-500">
											Or continue with
										</span>
									</div>
								</div>

								<div className="grid grid-cols-1 gap-3">
									<button
										type="button"
										className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition duration-200 hover:shadow-md"
									>
										<svg viewBox="0 0 48 48" className="w-5 h-5">
											<path
												fill="#FFC107"
												d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
											/>
											<path
												fill="#FF3D00"
												d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
											/>
											<path
												fill="#4CAF50"
												d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
											/>
											<path
												fill="#1976D2"
												d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
											/>
										</svg>
										Sign in with Google
									</button>
								</div>

								<div className="flex justify-center gap-2 text-sm text-gray-600">
									<span>Don't have an account?</span>
									<Link
										href="/signup"
										className="font-medium text-action hover:text-action/80 transition-colors"
									>
										Sign up
									</Link>
								</div>
							</div>
						</form>
					);
				}}
			/>
		</div>
	);
}
