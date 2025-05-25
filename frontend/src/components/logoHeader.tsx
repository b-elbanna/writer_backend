import pagePaths from "@/urlPaths/pagePaths";
import Link from "next/link";

export default function LogoHeader({ className }: { className?: string }) {
	return (
		<header
			className={`px-7 sm:px-8 py-4 bg-white/95 backdrop-blur-sm border-b border-action/10 sticky top-0 z-50 shadow-lg shadow-primary/5 ${className}`}
		>
			<div className="max-w-7xl mx-auto flex items-center justify-between">
				<Link
					href={pagePaths.homePage}
					className="group relative text-[32px] font-bold tracking-tight transition-all duration-300 hover:scale-105"
				>
					<span className="text-action relative inline-block transition-transform duration-300 group-hover:-translate-y-1">
						AI
					</span>
					<span className="relative inline-block bg-gradient-to-r from-primary to-action bg-clip-text text-transparent">
						Writer
					</span>
					<div className="absolute -bottom-1 left-0 w-0 h-[2px] bg-action transition-all duration-300 group-hover:w-full"></div>
				</Link>
			</div>
		</header>
	);
}
