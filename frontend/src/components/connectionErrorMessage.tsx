export default function ConnectionErrorMessage({
	className,
}: {
	className?: string;
}) {
	return (
		<div
			className={`${className}text-customred bg-main font-semibold uppercase text-2xl h-full flex items-center justify-center`}
		>
			<div>connection error happend</div>
		</div>
	);
}
