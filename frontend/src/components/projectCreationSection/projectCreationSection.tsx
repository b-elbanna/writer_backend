import MainTitle from "../mainTitle";
import ProjectCreationForms from "./projectCreationForms";

export default function ProjectCreationSection() {
	return (
		<section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
			<MainTitle title="Create" />
			<ProjectCreationForms />
		</section>
	);
}
