import React from "react";
import { Dialog, DialogContent, DialogDescription } from "../plate-ui/dialog";
import { DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";

export default function CustomModal({
	customButton,
	modalPopUpContent,
	title,
	description,
}: {
	title: string;
	description: string;
	customButton: React.ReactNode;
	modalPopUpContent: React.ReactNode;
}) {
	const [open, setOpen] = React.useState(false);
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<span>{customButton}</span>
			</DialogTrigger>

			<DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
				<DialogTitle>{title}</DialogTitle>
				<DialogDescription>{description}</DialogDescription>
				{modalPopUpContent}
			</DialogContent>
		</Dialog>
	);
}
