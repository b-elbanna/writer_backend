import useCurrentQaBoxFetcher from "@/swrDataFetcher/currentQaBoxFetcher";
import SingleResourceUploader from "./uploadResourceFileField";
import MainLoader from "../mainLoader";
import ConnectionErrorMessage from "../connectionErrorMessage";
import { BookOpen } from "lucide-react";

export default function QABoxUploadResource({
	qaBoxId,
	className,
}: {
	className?: string;
	qaBoxId: string;
}) {
	const { qaBox, isLoading, isError } = useCurrentQaBoxFetcher(qaBoxId);

	if (isLoading) return <MainLoader />;
	if (isError) return <ConnectionErrorMessage />;

	return (
		<div className={`${className} p-6 space-y-6`}>
			<div className="space-y-4">
				<h3 className="text-sm font-semibold text-primary">
					Knowledge Base Resources
				</h3>

				{qaBox.resources.length > 0 ? (
					<div className="flex flex-wrap gap-2">
						{qaBox.resources.map((resource) => (
							<div
								key={resource.id}
								className="flex items-center px-3 py-2 bg-action/5 hover:bg-action/10 
								text-primary rounded-lg text-sm font-medium gap-2 border 
								border-action/20 transition-colors"
							>
								<BookOpen size={16} className="text-action" />
								<div className="flex flex-col">
									<span className="line-clamp-1">{resource.name}</span>
									<span className="text-mygray text-xs">({resource.type})</span>
								</div>
							</div>
						))}
					</div>
				) : (
					<p className="text-sm text-mygray italic">No resources added yet</p>
				)}
			</div>

			<div className="border-t border-action/10 pt-6">
				<div className="bg-main rounded-lg">
					<SingleResourceUploader qaBoxId={qaBoxId} />
				</div>
			</div>
		</div>
	);
}
