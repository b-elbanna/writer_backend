import React from "react";
import { Plus } from "lucide-react";

import CreateProjectForm from "@/components/forms/createProjectForm/createProjectForm";
import CustomModal from "./customModal";
import CustomModalTitle from "./modalTitle";
import CustomModalDescription from "./modalDescription";

export default function CreateProjectModal() {
	return (
		<CustomModal
			title={<CreateProjectModalTitle />}
			description={<CreateProjectModalDescription />}
			modalPopUpContent={<CreateProjectForm />}
			customButton={
				<button className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl active:shadow-md">
					<Plus className="w-5 h-5 animate-pulse" />
					<span className="font-medium">New Project</span>
				</button>
			}
		/>
	);
}

function CreateProjectModalTitle() {
	return <CustomModalTitle title="New Project" />;
}
function CreateProjectModalDescription() {
	return <CustomModalDescription description="Create a new project" />;
}
