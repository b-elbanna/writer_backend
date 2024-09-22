export default function MainLogo({ dark }: { dark?: boolean }) {
	return (
		<div
			className="logo py-4"
			style={{
				fontSize: "calc(2vw + 60px)",
			}}
		>
			<span className="text-active tracking-tighter italic"> AI</span>
			<span
				className={`${
					dark && "!text-main"
				} tracking-tighter italic text-primary `}
			>
				Writer
			</span>
		</div>
	);
}
