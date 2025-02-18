"use client";

import Loading from "@/app/loading";
import authProtection from "@/auth/authProtection";
import CreateProjectForm from "@/components/forms/createProjectForm/createProjectForm";
import LogoHeader from "@/components/logoHeader";
import MainTitle from "@/components/mainTitle";
import UserDataHeader from "@/components/userDataHeader";
import useUserProjectsFetcher from "@/swrDataFetcher/userProjectsFetcher";

function CreateProjectPage() {
	const { projects, isLoading } = useUserProjectsFetcher();
	if (isLoading) return <Loading />;
	return (
		<main className=" w-full min-h-screen bg-main ">
			<LogoHeader />
			<UserDataHeader />
			<div className="container flex justify-center my-4 mx-auto">
				<MainTitle title="Create" />
			</div>
			<div className="container px-4 my-4 mx-auto">
				<CreateProjectForm />
			</div>
		</main>
	);
}

export default authProtection(CreateProjectPage);
