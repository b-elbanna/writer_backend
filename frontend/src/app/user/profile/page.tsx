"use client";
import authProtection from "@/auth/authProtection";
import { clientApi } from "@/baseApis/axiosBase";
import postLogoutAction from "@/endpointActions/postLogoutAction";
import useRefreshTokenPostFetcher from "@/swrDataFetcher/refreshTokenFetcher";
import useUserDataFetcher from "@/swrDataFetcher/userDataFetcher";
import pagePaths from "@/urlPaths/pagePaths";
import Link from "next/link";

function ProfilePage() {
	let {
		user,
		isLoading,
		isError,
		mutate: mutateUserData,
	} = useUserDataFetcher();
	let { mutate } = useRefreshTokenPostFetcher();
	if (isLoading) return <div>Loading user data...</div>;
	if (isError) return <div>Failed to load</div>;
	return (
		<div>
			<div className="text-3xl p-4 text-center">hello {user?.username}</div>
			<div className="flex p-4 items-center gap-4 justify-center">
				<div>
					<button
						type="button"
						onClick={() => {
							postLogoutAction().then(() => {
								mutate(undefined);
								mutateUserData(undefined);
							});
						}}
						className="p-2 rounded bg-red-500 text-white"
					>
						logout
					</button>
				</div>
				<div>
					<Link href={pagePaths.projectsPage}>
						<button
							type="button"
							onClick={() => {
								console.log("go to projects page");
							}}
							className="p-2 rounded bg-active text-white"
						>
							Projects
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
}

export default authProtection(ProfilePage);
