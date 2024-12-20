import { ReactElement } from "react";

export default function SearchToolPlaceholder({
	label,
	icon,
	description,
}: {
	label: string | ReactElement;
	icon: ReactElement;
	description?: string | ReactElement;
}) {
	return (
		<div className="w-full h-full  flex relative items-center dark:bg-dark-primary dark:text-dark">
			<div className="absolute right-0 bottom-0">{icon && icon}</div>

			<h2 className="text-center sm:text-6xl text-4xl sm:!leading-[80px] !leading-[60px]  tracking-wide mb-12 p-5 font-extrabold text-primary mx-auto max-w-2xl  ">
				{description
					? description
					: "Discover the Power of AI: Instantly Generate Content from Titles!"}
			</h2>
		</div>
	);
}
