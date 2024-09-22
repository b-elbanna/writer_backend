"use client"

import useRefreshTokenFetcher from "@/swrDataFetcher/refreshTokenFetcher";
import useUser from "@/swrDataFetcher/userDataFetcher";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const redirectAuthenticated	 = (UnauthPage: React.ComponentType<any>) => {
  return (props: any) => {
    const { refreshData,isLoading } = useRefreshTokenFetcher();
    const router = useRouter();

    useEffect(() => {
      // If the user is not authenticated, redirect to the login page
      if (refreshData ) {
        router.push('/profile');
      }
    }, [refreshData, router,isLoading]);


	if (!refreshData ) {

		// if (isLoading) {
		// 	return <div>Loading...</div>;
		// }
		return <UnauthPage {...props} />;
      // Display a message or loading indicator while redirecting
	}
	return <div>Redirecting to profile page...</div>;
	

    // If the user is authenticated, render the WrappedComponent
    // Otherwise, render null while the redirection is in progress
  };
};

export default redirectAuthenticated;