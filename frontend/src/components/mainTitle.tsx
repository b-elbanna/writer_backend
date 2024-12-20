export default function MainTitle({
	title,
	sizeInPx,
	className,
}: {
	title: string;
	sizeInPx?: number;
	className?: string;
}) {
	return (
		<div className={`section-title ${className}`}>
			<h1
				style={{
					fontSize: `calc(0.5vw + ${sizeInPx ? sizeInPx.toString() : "35"}px)`,
				}}
				className={` font-semibold text-primary uppercase  `}
			>
				{title}
			</h1>
			<div className="  w-full h-2 -mt-2 bg-action"></div>
		</div>
	);
}
