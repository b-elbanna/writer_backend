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
		<div className={`section-title relative ${className}`}>
			<h1
				style={{
					fontSize: `clamp(${
						sizeInPx ? sizeInPx * 0.8 : "28"
					}px, calc(0.5vw + ${sizeInPx ? sizeInPx : "35"}px), ${
						sizeInPx ? sizeInPx * 1.2 : "42"
					}px)`,
				}}
				className="font-semibold text-primary uppercase tracking-wide relative z-10 
					animate-in slide-in-from-left duration-300
					after:content-[''] after:absolute after:left-0 after:-bottom-1 
					after:w-[40px] after:h-[3px] after:bg-action"
			>
				{title}
			</h1>
			<div
				className="w-full h-2 mt-3 bg-gradient-to-r from-action/80 to-action 
				transform transition-all duration-300 hover:scale-x-105 origin-left"
			></div>
		</div>
	);
}
