export default function CustomModalDescription({
	description,
}: {
	description: string;
}) {
	return (
		<div className="text-base text-gray-600 max-w-prose">{description}</div>
	);
}
