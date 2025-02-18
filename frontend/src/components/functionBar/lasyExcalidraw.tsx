import Loading from "@/app/loading";
import { useAppSelector } from "@/rtk/store";
import dynamic from "next/dynamic";
let timer: string | number | NodeJS.Timeout | undefined;
const Excalidraw = dynamic(
	async () => (await import("@excalidraw/excalidraw")).Excalidraw,
	{
		ssr: false,
		loading: () => <Loading />,
	}
);
export default function CustomExcalidraw() {
	const currentUserProject = useAppSelector(
		(state) => state.currentUserProject
	);
	return (
		<Excalidraw
			onChange={(elements, state, files) => {
				if (timer) clearTimeout(timer);
				timer = setTimeout(() => {
					if (currentUserProject.value.id) console.log(elements);
				}, 2000);
			}}
		/>
	);
}
