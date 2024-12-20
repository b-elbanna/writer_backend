import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useRefreshTokenFetcher from "@/swrDataFetcher/refreshTokenFetcher";
import useRefreshTokenOnError from "./useRefreshTokenOnError";
import pagePaths from "@/urlPaths/pagePaths";

const ssrAuthProtection = (ProtectedPage: React.ComponentType<any>) => {
	return (props: any) => {
		useRefreshTokenOnError();
		const { refreshData, isLoading, isError } = useRefreshTokenFetcher();
		const router = useRouter();
		useEffect(() => {
			// If the user is not authenticated, redirect to the login page
			if (!refreshData && !isLoading) {
				router.push(pagePaths.loginPage);
			}
		}, [refreshData, router, isLoading]);

		if (isError) return <div>Redirecting to login page...</div>;
		if (isLoading) {
			if (!refreshData) {
				return <div>checking for authentication ...</div>;
			}
			// Display a message or loading indicator while redirecting
		}
		return <ProtectedPage {...props} />;

		// If the user is authenticated, render the WrappedComponent
		// Otherwise, render null while the redirection is in progress
	};
};

export default ssrAuthProtection;
