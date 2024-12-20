import React from "react";
// import * as Dialog from "@radix-ui/react-dialog";
import { Plus } from "lucide-react";
import { CustomButton } from "../forms/formFiels/customButton";

import CreateProjectForm from "../forms/createProjectForm/createProjectForm";
import CustomModal from "./customModal";

export default function CreateProjectModal() {
	return (
		<CustomModal
			title="Create Project"
			description="Enter your project details"
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
							Create
						</>
					}
					className=" !flex gap-1 p-1  text-sm  "
				/>
			}
		/>
	);
}
