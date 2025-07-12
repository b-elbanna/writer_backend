"use client";

import authProtection from "@/auth/authProtection";
import MainTitle from "@/components/mainTitle";
import useUserProjectsFetcher from "@/swrDataFetcher/userProjectsFetcher";
import { ProjectsBox } from "./projects";
import CreateProjectModal from "@/components/customModal/createProjectModal";
import LogoHeader from "@/components/logoHeader";
import UserDataHeader from "@/components/userDataHeader";

import pagePaths from "@/urlPaths/pagePaths";
import { Plus } from "lucide-react";
import { CustomButton } from "@/components/forms/formFiels/customButton";
import { useRouter } from "next/navigation";

function ProjectsPage() {
	const { projects, isLoading } = useUserProjectsFetcher();
	const router = useRouter();
	return (
		<main className="min-h-screen relative bg-gradient-to-br from-white via-white to-main/10">
			<LogoHeader />
			<UserDataHeader />
			<section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
				<div className="flex flex-col sm:flex-row justify-between gap-6 sm:items-center mb-12">
					<div className="space-y-1">
						<MainTitle title="Projects" />
						<p className="text-gray-600 text-sm sm:text-base">
							Manage and organize your writing projects
						</p>
					</div>
					{/* <CreateProjectModal /> */}
					{/* <Link href={pagePaths.projectCreatePage}>
						<button className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl active:shadow-md">
							<Plus className="w-5 h-5 animate-pulse" />
							<span className="font-medium">New Project</span>
						</button>

					</Link> */}
					<CustomButton
						dark
						onClickFunc={() => router.push(pagePaths.projectCreatePage)}
					>
						<Plus className="w-5 h-5 animate-pulse" />
						<span className="font-medium">New Project</span>
					</CustomButton>
				</div>

				<div className="relative">
					<div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-purple-400/30 [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] -z-10" />

					<div className="w-full backdrop-blur-3xl bg-white/50 rounded-2xl p-6 shadow-xl ring-1 ring-gray-900/10">
						{isLoading ? (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{[1, 2, 3].map((n) => (
									<div
										key={n}
										className="group relative bg-white rounded-xl shadow-sm ring-1 ring-gray-900/5 p-6 transition duration-200 hover:shadow-md"
									>
										<div className="h-8 bg-gray-100 rounded-lg mb-4 animate-pulse" />
										<div className="h-6 bg-gray-100 rounded-lg w-3/4 mb-8 animate-pulse" />
										<div className="space-y-3">
											<div className="h-4 bg-gray-100 rounded-lg animate-pulse" />
											<div className="h-4 bg-gray-100 rounded-lg w-5/6 animate-pulse" />
										</div>
										{/* Subtle gradient overlay */}
										<div className="absolute inset-0 rounded-xl bg-gradient-to-t from-gray-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
									</div>
								))}
							</div>
						) : projects?.length === 0 ? (
							<div className="text-center py-12">
								<div className="mx-auto h-12 w-12 text-gray-400 mb-4">
									<svg
										className="h-full w-full"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										aria-hidden="true"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
										/>
									</svg>
								</div>

								<h3 className="text-sm font-semibold text-gray-900 mb-1">
									No projects yet
								</h3>
								<p className="text-sm text-gray-500 mb-6">
									Get started by creating your first project
								</p>
							</div>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								<ProjectsBox projects={projects} />
							</div>
						)}
					</div>
				</div>
			</section>
		</main>
	);
}

export default authProtection(ProjectsPage);
