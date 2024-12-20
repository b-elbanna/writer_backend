"use client";
import authProtection from "@/auth/authProtection";
import ProjectNavbar from "@/components/projectNavbar/projectNavbar";
import ActiveToolPage from "../activeTool";
import { useAppDispatch, useAppSelector } from "@/rtk/store";
import { useEffect } from "react";
import { getCurrentUserProject } from "@/rtk/slices/currentUserProject";
import Loading from "@/app/loading";
import { uuidRegex } from "@/regex/uuid";
import { notFound } from "next/navigation";
import { getCurrentUserChatbox } from "@/rtk/slices/currentUserChat";

function ProjectPage({ params }: { params: any }) {
	const { projectId } = params;
	const currentProject = useAppSelector((state) => state.currentUserProject);
	const appDispatch = useAppDispatch();
	useEffect(() => {
		if (currentProject.value?.id !== projectId) {
			appDispatch(getCurrentUserProject({ projectId }));
		}
	}, []);
	useEffect(() => {
		if (currentProject.status === "fulfilled") {
			appDispatch(
				getCurrentUserChatbox({ chatboxId: currentProject.value.chatbox })
			);
		}
	}, [currentProject]);
	if (!uuidRegex.test(projectId)) return notFound();
	if (currentProject.status === "init" || currentProject.status === "pending")
		return <Loading />;
	return (
		<div className=" w-full overflow-hidden h-screen flex flex-col">
			<ProjectNavbar />
			<main className=" w-full flex-1  overflow-hidden     ">
				<ActiveToolPage />
			</main>
		</div>
	);
}
export default authProtection(ProjectPage);
