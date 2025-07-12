"use client";

import redirectAuthenticated from "@/auth/redirectAuthenticated";
import LoginForm from "@/components/forms/loginForm/loginForm";
import MainLogo from "@/components/mainLogo";
import Image from "next/image";

function LoginPage() {
	return (
		<main className="min-h-screen bg-gradient-to-br from-primary/5 to-action/5 md:bg-none overflow-x-hidden">
			<div className="grid md:grid-cols-2 min-h-screen">
				{/* Mobile Logo - only shown on small screens */}
				<div className="flex md:hidden justify-center items-center pt-8 pb-4">
					<MainLogo />
				</div>

				<div className="flex flex-col justify-center bg-white/90 backdrop-blur-xl shadow-lg md:shadow-none md:bg-white">
					<div className="relative w-full max-w-[420px] mx-auto px-6 py-8 md:p-10 lg:p-16">
						<h1 className="text-primary text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
							Welcome Back
							<div className="h-1 w-16 md:w-20 bg-action mt-2 rounded-full"></div>
						</h1>
						<LoginForm />
					</div>
				</div>

				<div className="hidden md:flex bg-gradient-to-br from-primary to-action text-main flex-col justify-center items-center px-8">
					<MainLogo dark={true} />
					<div className="flex flex-col items-center mt-8">
						<h2 className="text-4xl text-center font-light mb-8 text-white/95">
							Glad to see you again
						</h2>
						<div className="relative group">
							<div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
							<Image
								src="/illustrations/Task-bro (1).svg"
								alt="illustration"
								width={400}
								height={400}
								className="transform hover:scale-105 transition-transform duration-500 max-w-[90%] h-auto rounded-2xl"
								priority
							/>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}

// export default redirectAuthenticated(LoginPage);

export default LoginPage;
