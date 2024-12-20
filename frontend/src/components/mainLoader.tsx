import { Loader } from "lucide-react";

export default function MainLoader({ className }: { className?: string }) {
	return (
		<div
			className={`${className}  w-full h-full flex items-center justify-center `}
		>
			<Loader size={100} className="stroke-primary animate-spin" />;
		</div>
	);
}
