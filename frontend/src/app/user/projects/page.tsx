"use client";

import authProtection from "@/auth/authProtection";
import MainTitle from "@/components/mainTitle";
import useUserProjectsFetcher from "@/swrDataFetcher/userProjectsFetcher";
import { ProjectsBox } from "./projects";
import CreateProjectModal from "@/components/customModal/createProjectModal";
import LogoHeader from "@/components/logoHeader";

import UserDataHeader from "@/components/userDataHeader";

function ProjectsPage() {
	const { projects, isLoading } = useUserProjectsFetcher();
	return (
		<main style={{ minHeight: "100vh" }} className="relative bg-main   ">
			<LogoHeader />
			<UserDataHeader />
			<section className="my-20 max-w-5xl mx-auto   ">
				<div className="flex justify-between gap-12 container px-4 items-end  mx-auto mb-10">
					<MainTitle title="Projects" />
					<CreateProjectModal />
				</div>
				<div className="container px-4 m-auto ">
					{isLoading ? (
						<div>Projects Loading ...</div>
					) : (
						<div className="py-4  m-auto grid grid-cols-auto-fill-max-300 lg:justify-start justify-center gap-8">
							<ProjectsBox projects={projects} />
						</div>
					)}
				</div>
			</section>
		</main>
	);
}

export default authProtection(ProjectsPage);
