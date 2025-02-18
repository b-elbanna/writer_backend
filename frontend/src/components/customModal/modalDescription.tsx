export default function CustomModalDescription({
	description,
}: {
	description: string;
}) {
	return (
		<div className="text-mygray text-xs -mt-5 capitalize">{description}</div>
	);
}
