"use client";

import redirectAuthenticated from "@/auth/redirectAuthenticated";
import LoginForm from "@/components/forms/loginForm/loginForm";
import MainLogo from "@/components/mainLogo";
import Image from "next/image";

function LoginPage() {
	return (
		<main>
			<div className="grid md:grid-cols-2  w-screen h-screen">
				<div className="flex flex-col justify-center">
					<div className="relative p-5 md:px-10">
						<h1 className=" absolute text-primary text-5xl font-bold -top-12">
							SignIn Now
						</h1>
						<LoginForm />
					</div>
				</div>
				<div className="bg-primary  flex flex-col justify-evenly items-center text-main">
					<MainLogo dark={true} />
					<div className=" hidden md:flex flex-col items-center ">
						<div
							style={{
								textShadow: "0px 0px 0px var(--base-color)",
							}}
							className=" hidden md:block text-6xl text-center px-4 text-primary font-bold -mb-8 "
						>
							Welcome back
						</div>
						<Image
							src={"/illustrations/Task-bro (1).svg"}
							alt="illustration"
							width={400}
							height={400}
						/>
					</div>
				</div>
			</div>
		</main>
	);
}

export default redirectAuthenticated(LoginPage);
