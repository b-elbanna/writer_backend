import React from "react";
// import * as Dialog from "@radix-ui/react-dialog";
import { Plus } from "lucide-react";
import { CustomButton } from "../forms/formFiels/customButton";

import CreateProjectForm from "../forms/createProjectForm/createProjectForm";
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
				<CustomButton
					onClickFunc={() => {
						// setOpen(true);
						console.log("show popup");
					}}
					children={
						<>
							<Plus size={20} />
							New Project
						</>
					}
					className=" !flex gap-1 p-1  text-sm  "
				/>
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
