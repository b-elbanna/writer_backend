import React from "react";
import { Dialog, DialogContent, DialogDescription } from "../plate-ui/dialog";
import { DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";

export default function CustomModal({
	customButton,
	modalPopUpContent,
	title,
	description,
}: {
	title: React.ReactNode;
	description: React.ReactNode;
	customButton: React.ReactNode;
	modalPopUpContent: React.ReactNode;
}) {
	const [open, setOpen] = React.useState(false);
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<span>{customButton}</span>
			</DialogTrigger>

			<DialogContent
				className="md:min-w-[600px] lg:min-w-[800px] xl:min-w-[1024px] bg-gradient-to-b from-white to-gray-50"
				onPointerDownOutside={(e) => e.preventDefault()}
			>
				<div className="relative">
					{/* Close button */}

					{/* Header */}
					<div className="mb-8 text-center sm:text-left">
						<DialogTitle className="mb-2">{title}</DialogTitle>
						<DialogDescription className="text-gray-500">
							{description}
						</DialogDescription>
					</div>

					{/* Content */}
					<div className="max-h-[80vh] overflow-y-auto px-1 py-4">
						{modalPopUpContent}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
