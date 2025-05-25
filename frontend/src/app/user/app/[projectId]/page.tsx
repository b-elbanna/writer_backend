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
import FuctionBar from "../../../../components/functionBar/fuctionBar";
import { useScrollLock, useWindowSize } from "usehooks-ts";
import WritingToolsBar from "@/components/functionBar/writtingToolsBar/writtingToolsBar";

function ProjectPage({ params }: { params: any }) {
	const { projectId } = params;
	const windowSize = useWindowSize();
	const appDispatch = useAppDispatch();
	const currentProject = useAppSelector((state) => state.currentUserProject);
	const currentChat = useAppSelector((state) => state.currentUserChatbox);
	useScrollLock();

	useEffect(() => {
		if (projectId) {
			// if came from project page and a project already loaded
			if (currentProject.value?.id === projectId) {
				// if the project already loaded and the chatbox is empty
				if (currentChat.status === "init")
					appDispatch(
						getCurrentUserChatbox({
							chatboxId: currentProject.value.chatbox,
						})
					);
			}
			// if came from direct link
			else {
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
	}, [projectId]);

	if (!uuidRegex.test(projectId)) return notFound();
	if (currentProject.status === "rejected") {
		return (
			<div className="h-screen flex items-center justify-center bg-gray-50">
				<div className="text-customred font-semibold text-2xl p-8 bg-white rounded-lg shadow-lg border border-red-100 animate-fade-in">
					<div className="flex items-center gap-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
							/>
						</svg>
						<span>Connection error occurred</span>
					</div>
				</div>
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
		<div
			style={{ height: windowSize.height }}
			className="relative w-full bg-gray-50"
		>
			<main className="w-full h-full flex flex-col">
				<div className="flex-1 overflow-hidden relative">
					<MainEditor className="overflow-hidden shadow-xl" />
				</div>
				<FuctionBar />
			</main>
		</div>
	);
}

export default authProtection(ProjectPage);
