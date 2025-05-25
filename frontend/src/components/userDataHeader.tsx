import useUserDataFetcher from "@/swrDataFetcher/userDataFetcher";

export default function UserDataHeader() {
	const { user } = useUserDataFetcher();

	return (
		<section className="bg-gradient-to-b from-primary to-primary/95 p-6 py-12">
			<div className="max-w-7xl mx-auto text-main">
				<div className="cards-box grid sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full mx-auto">
					{/* Username Card */}
					<div className="group bg-main/5 backdrop-blur-md border border-action/10 rounded-lg p-4 transition-all duration-300 hover:bg-main/10 hover:scale-[1.02] hover:shadow-lg">
						<div className="text-sm font-medium text-active/80 mb-1">
							Username
						</div>
						<div className="text-xl font-semibold tracking-wide truncate group-hover:text-action transition-colors">
							{user?.username || "---"}
						</div>
					</div>

					{/* Email Card */}
					<div className="group bg-main/5 backdrop-blur-md border border-action/10 rounded-lg p-4 transition-all duration-300 hover:bg-main/10 hover:scale-[1.02] hover:shadow-lg">
						<div className="text-sm font-medium text-active/80 mb-1">Email</div>
						<div className="text-xl font-semibold tracking-wide truncate group-hover:text-action transition-colors">
							{user?.email || "---"}
						</div>
					</div>

					{/* Credits Card */}
					<div className="group bg-main/5 backdrop-blur-md border border-action/10 rounded-lg p-4 transition-all duration-300 hover:bg-main/10 hover:scale-[1.02] hover:shadow-lg">
						<div className="text-sm font-medium text-active/80 mb-1">
							Credits
						</div>
						<div className="text-xl font-semibold tracking-wide truncate group-hover:text-action transition-colors">
							{user?.user_credits || "0"}
						</div>
					</div>

					{/* Full Name Card - Only shown if first_name exists */}
					{user?.first_name && (
						<div className="group bg-main/5 backdrop-blur-md border border-action/10 rounded-lg p-4 transition-all duration-300 hover:bg-main/10 hover:scale-[1.02] hover:shadow-lg">
							<div className="text-sm font-medium text-active/80 mb-1">
								Full Name
							</div>
							<div className="text-xl font-semibold tracking-wide truncate group-hover:text-action transition-colors">
								{`${user.first_name} ${user.last_name || ""}`}
							</div>
						</div>
					)}
				</div>
			</div>
		</section>
	);
}
