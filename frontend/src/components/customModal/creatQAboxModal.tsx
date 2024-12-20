import { Plus } from "lucide-react";
import { CustomButton } from "../forms/formFiels/customButton";
import CustomModal from "./customModal";
import CreateQABoxForm from "../forms/createQABoxForm/createQABoxForm";

export default function CreateQAboxModal() {
	return (
		<CustomModal
			title="Create New QA Box"
			description="Enter QA Box name"
			modalPopUpContent={<CreateQABoxForm />}
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
