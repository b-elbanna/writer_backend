"use client";
import { CustomButton } from "@/components/forms/formFiels/customButton";
import MainLogo from "@/components/mainLogo";
import pagePaths from "@/urlPaths/pagePaths";
import { useRouter } from "next/navigation";

export default function HeroSection() {
	const router = useRouter();
	return (
		<main style={{ minHeight: "100vh" }} className="  dark:bg-dark-primary">
			{/* <Navbar className="w-full border-b  fixed" /> */}
			<section className="relative h-screen pt-14 flex items-center justify-center">
				<div className="py-10 flex  justify-center items-center gap-3  p-5 sm:px-20 ">
					<div className=" flex flex-col items-center w-fit sm:px-5 -mt-20  py-10 mx-auto">
						<MainLogo />
						<div className="main-text text-center ">
							<p
								style={{
									fontSize: "calc(3vw + 20px)",
								}}
								className=" max-w-3xl  font-[350] sm:font-light"
							>
								Enrich your creativity and productivity
							</p>
							<span className="sm:text-xl text-center font-normal text-sm text-gray-400">
								just start a new project.
							</span>
						</div>
						<CustomButton
							onClickFunc={() => router.push(pagePaths.projectsPage)}
							children="GO Now"
							className="mt-12 "
						/>
					</div>
				</div>
				<div className="absolute -z-10 bottom-0  left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
			</section>
		</main>
	);
}
