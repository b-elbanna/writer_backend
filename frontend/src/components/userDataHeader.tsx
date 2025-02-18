import useUserDataFetcher from "@/swrDataFetcher/userDataFetcher";
export default function UserDataHeader() {
	const { user } = useUserDataFetcher();

	return (
		<section className="bg-primary p-3 py-10">
			<div className="    text-main ">
				<div className="cards-box flex  flex-wrap gap-5 justify-center  w-fit mx-auto rounded bg-primary ">
					<div className="flex  items-end overflow-hidden rounded  gap-2 px-6   ">
						<div className="text-sm  capitalize text-active">Username</div>
						<div className="sm:text-xl    ">{user?.username}</div>
					</div>
					<div className="flex flex-wrap items-end overflow-hidden rounded  gap-2 px-6   ">
						<div className="text-sm  capitalize text-active">Email</div>
						<div className="sm:text-xl    ">{user?.email}</div>
					</div>
					<div className="flex flex-wrap items-end overflow-hidden rounded  gap-2 px-6   ">
						<div className="text-sm  capitalize text-active">Credits</div>
						<div className="sm:text-xl    ">{user?.user_credits}</div>
					</div>
					{user?.first_name && (
						<div className="flex flex-wrap items-end overflow-hidden rounded  gap-2 px-6   ">
							<div className="text-sm  capitalize text-active">Email</div>
							<div className="sm:text-xl    ">
								{user?.first_name} {user.last_name}
							</div>
						</div>
					)}
				</div>
			</div>
		</section>
	);
}
