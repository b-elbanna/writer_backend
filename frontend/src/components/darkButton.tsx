export default function DarkButton({
	children,
	...props
}: {
	children: React.ReactNode;
}) {
	return (
		<button
			{...props}
			className="inline-flex  font-semibold items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl active:shadow-md"
			type="button"
		>
			{children}
		</button>
	);
}
