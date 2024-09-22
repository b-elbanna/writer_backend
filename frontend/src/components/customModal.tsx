import React from "react";
// import * as Dialog from "@radix-ui/react-dialog";
import { Plus } from "lucide-react";
import { CustomButton } from "./forms/formFiels/customButton";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
} from "./plate-ui/dialog";
import { DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import CreateProjectForm from "./forms/createProjectForm/createProjectForm";

export default function CustomModal() {
	const [open, setOpen] = React.useState(false);
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<span>
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
				</span>
			</DialogTrigger>

			<DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
				<DialogTitle>Create Article</DialogTitle>
				<DialogDescription>Enter your article details</DialogDescription>
				<CreateProjectForm />
			</DialogContent>
		</Dialog>
	);
}
