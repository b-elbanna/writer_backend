"use client";

import useRefreshTokenFetcher from "@/swrDataFetcher/refreshTokenFetcher";
import useUserDataFetcher from "@/swrDataFetcher/userDataFetcher";
import pagePaths from "@/urlPaths/pagePaths";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const redirectAuthenticated = (UnauthPage: React.ComponentType<any>) => {
	return (props: any) => {
		const { refreshData, isLoading, isError } = useRefreshTokenFetcher();
		const {
			user,
			isLoading: userLoading,
			isError: userError,
		} = useUserDataFetcher();
		const router = useRouter();

		useEffect(() => {
			// If the user is not authenticated, redirect to the login page
			if (!isError && !userError && !userLoading && !isLoading) {
				router.push(pagePaths.projectsPage);
			}
		}, [refreshData, router, isLoading, userLoading]);

		if (!isError && !userError && !userLoading && !isLoading)
			return <div>Redirecting to profile page...</div>;
		else {
			return <UnauthPage {...props} />;
			// Display a message or loading indicator while redirecting
		}

		// If the user is authenticated, render the WrappedComponent
		// Otherwise, render null while the redirection is in progress
	};
};

export default redirectAuthenticated;
