"use client";

import authProtection from "@/auth/authProtection";
import LogoHeader from "@/components/logoHeader";
import ProjectCreationSection from "@/components/projectCreationSection/projectCreationSection";
import UserDataHeader from "@/components/userDataHeader";

function CreateProjectPage() {
	return (
		<main className=" w-full min-h-screen bg-main ">
			<LogoHeader />
			<UserDataHeader />
			<ProjectCreationSection />
		</main>
	);
}

export default authProtection(CreateProjectPage);
