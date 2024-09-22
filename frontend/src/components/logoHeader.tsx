import Link from "next/link";

export default function LogoHeader({ className }: { className?: string }) {
	return (
		<header
			className={`px-7 sm:px-8 py-2   bg-main flex items-center 
       justify-center
       ${className}
      `}
		>
			<Link href={"/"} className={` text-[32px]  tracking-tighter italic`}>
				<span className="text-action tracking-tighter italic">AI</span>Writer
			</Link>
		</header>
	);
}
