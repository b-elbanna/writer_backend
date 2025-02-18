import useCurrentQaBoxFetcher from "@/swrDataFetcher/currentQaBoxFetcher";
import SingleResourceUploader from "./uploadResourceFileField";
import MainLoader from "../mainLoader";
import ConnectionErrorMessage from "../connectionErrorMessage";

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
		<div className={`${className} `}>
			<div className="flex flex-wrap gap-1 p-1">
				{qaBox.resources.map((resource) => {
					// console.log(qaBox);
					return (
						<div
							className="p-1 px-2 font-semibold text-main bg-primary rounded "
							key={resource.id}
						>
							{resource.type}| {resource.name}
						</div>
					);
				})}
			</div>
			<div className="">
				<SingleResourceUploader qaBoxId={qaBoxId} />
			</div>
		</div>
	);
}
