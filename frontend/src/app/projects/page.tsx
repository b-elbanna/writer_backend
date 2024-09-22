"use client";

import authProtection from "@/auth/authProtection";
import MainTitle from "@/components/mainTitle";
import useUserDataFetcher from "@/swrDataFetcher/userDataFetcher";
import useUserProjectsFetcher from "@/swrDataFetcher/userProjectsFetcher";
import { ProjectsBox } from "./projects";
import CustomModal from "@/components/customModal";
import LogoHeader from "@/components/logoHeader";

function ProjectsPage() {
	const { projects, isLoading } = useUserProjectsFetcher();
	const { user } = useUserDataFetcher();
	return (
		<main style={{ minHeight: "100vh" }} className="relative bg-main   ">
			<LogoHeader />
			<section className="bg-primary p-3 py-10">
				<div className="    text-main ">
					<div className="cards-box flex  flex-wrap gap-5 justify-center  w-fit mx-auto rounded bg-primary ">
						<div className="flex  items-end overflow-hidden rounded  gap-2 px-6   ">
							<div className="text-sm  capitalize text-active">Username</div>
							<div className="sm:text-xl    ">{user?.username}</div>
						</div>
						<div className="flex flex-wrap items-end overflow-hidden rounded  gap-2 px-6   ">
							<div className="text-sm  capitalize text-active">Email</div>
							<div className="sm:text-xl    ">{user?.email}</div>
						</div>
						<div className="flex flex-wrap items-end overflow-hidden rounded  gap-2 px-6   ">
							<div className="text-sm  capitalize text-active">Credits</div>
							<div className="sm:text-xl    ">{user?.user_credits}</div>
						</div>
						{user?.first_name && (
							<div className="flex flex-wrap items-end overflow-hidden rounded  gap-2 px-6   ">
								<div className="text-sm  capitalize text-active">Email</div>
								<div className="sm:text-xl    ">
									{user?.first_name} {user.last_name}
								</div>
							</div>
						)}
					</div>
				</div>
			</section>
			<section className="my-20 max-w-5xl mx-auto   ">
				<div className="flex justify-between gap-12 container px-4 items-end  mx-auto mb-10">
					<MainTitle title="Projects" />
					<CustomModal />
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
