"use client";

import useRefreshTokenFetcher from "@/swrDataFetcher/refreshTokenFetcher";
import useUserDataFetcher from "@/swrDataFetcher/userDataFetcher";
import pagePaths from "@/urlPaths/pagePaths";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useRefreshTokenOnError from "./useRefreshTokenOnError";

const redirectAuthenticated = (UnauthPage: React.ComponentType<any>) => {
	return (props: any) => {
		const { refreshData, isLoading, isError ,mutate} = useRefreshTokenFetcher();
		const {
			user,
			isLoading: userLoading,
			isError: userError,
		} = useUserDataFetcher();
		const router = useRouter();
		useRefreshTokenOnError();
		useEffect(() => {
			// If the user is not authenticated, redirect to the login page
			// if (!refreshData) {
			// 	mutate();
			// }
			if (refreshData) {
				console.log(refreshData)
				// if (!isError && !userError && !userLoading && !isLoading) {
				router.push(pagePaths.projectsPage);
			}
		});

		// if (!isError && !userError && !userLoading && !isLoading)
		if (refreshData) return <div>Redirecting to profile page...</div>;
		if (isLoading) return <div>checking for authentication ...</div>;
		if (isError) {
			return <UnauthPage {...props} />;
			// Display a message or loading indicator while redirecting
		}

		// If the user is authenticated, render the WrappedComponent
		// Otherwise, render null while the redirection is in progress
	};
};

export default redirectAuthenticated;
