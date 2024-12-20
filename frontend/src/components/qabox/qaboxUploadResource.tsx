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
			<div className="flex flex-wrap justify-center gap-1 p-1">
				{qaBox.resources.map((resource: any) => {
					// console.log(qaBox);
					return (
						<div className="px-1" key={resource.id}>
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
