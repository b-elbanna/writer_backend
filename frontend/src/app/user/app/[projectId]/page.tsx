"use client";
import authProtection from "@/auth/authProtection";
import { useAppDispatch, useAppSelector } from "@/rtk/store";
import { useEffect } from "react";
import { getCurrentUserProject } from "@/rtk/slices/currentUserProject";
import Loading from "@/app/loading";
import { uuidRegex } from "@/regex/uuid";
import { notFound } from "next/navigation";
import MainEditor from "@/components/editor/mainEditor";
import { getCurrentUserChatbox } from "@/rtk/slices/currentUserChat";
import FuctionBar from "./mainPage/fuctionBar";

function ProjectPage({ params }: { params: any }) {
	const { projectId } = params;
	const currentProject = useAppSelector((state) => state.currentUserProject);
	const currentChat = useAppSelector((state) => state.currentUserChatbox);
	const appDispatch = useAppDispatch();
	useEffect(() => {
		if (projectId) {
			// if came from project page and an project already loaded
			if (currentProject.value?.id) {
				if (currentProject.value?.id === projectId) {
					// if the project already loaded and the chatbox is empty
					if (currentChat.status === "init")
						appDispatch(
							getCurrentUserChatbox({
								chatboxId: currentProject.value.chatbox,
							})
						);
				}
			}
			// if came from direct link
			else {
				console.log("getting project", currentProject.value);
				appDispatch(getCurrentUserProject({ projectId })).then((res) => {
					console.log("getting payload", res);
					(res.payload as ProjectInterface)?.chatbox &&
						appDispatch(
							getCurrentUserChatbox({
								chatboxId: (res.payload as ProjectInterface).chatbox,
							})
						);
				});
			}
		}
	}, []);

	if (!uuidRegex.test(projectId)) return notFound();
	if (currentProject.status === "rejected") {
		return (
			<div className="text-customred font-semibold uppercase text-2xl h-screen flex items-center justify-center">
				<div>connection error happend</div>
			</div>
		);
	}
	if (
		currentProject.status === "init" ||
		currentProject.status === "pending" ||
		currentChat.status === "init" ||
		currentChat.status === "pending"
	)
		return <Loading />;

	return (
		<div className=" w-full overflow-hidden h-screen ">
			<main className=" w-full h-full overflow-hidden relative    ">
				<MainEditor className="overflow-hidden " />
				<FuctionBar />
			</main>
		</div>
	);
}
export default authProtection(ProjectPage);
