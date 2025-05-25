import Loading from "@/app/loading";
import { clientApi } from "@/baseApis/axiosBase";
import postSaveDrawAction from "@/endpointActions/postSaveDrawAction";
import { useAppSelector } from "@/rtk/store";
import dynamic from "next/dynamic";
import { useState } from "react";
let timer: string | number | NodeJS.Timeout | undefined;
const Excalidraw = dynamic(
	async () => {
		return (await import("@excalidraw/excalidraw")).Excalidraw;
	},
	{
		ssr: false,
		loading: () => <Loading />,
	}
);
export default function CustomExcalidraw() {
	const currentUserProject = useAppSelector(
		(state) => state.currentUserProject
	);
	const [drawId, setDrawId] = useState<string>();
	return (
		<Excalidraw
			initialData={clientApi
				.get(`/writing/project/${currentUserProject.value.id}/draws`)
				.then((res) => {
					let draws = res.data;
					console.log(draws);
					setDrawId(draws[0].id);
					return draws[0];
				})}
			onChange={(elements, state, files) => {
				if (timer) clearTimeout(timer);
				if (drawId && currentUserProject.value.id) {
					console.log(elements);
					timer = setTimeout(() => {
						postSaveDrawAction(drawId, [...elements]);
					}, 2000);
				}
			}}
			theme="light"
			gridModeEnabled={false}
			zenModeEnabled={true}
			viewModeEnabled={false}
			UIOptions={{
				canvasActions: {
					changeViewBackgroundColor: true,
					clearCanvas: true,
					loadScene: true,
					saveToActiveFile: true,
					saveAsImage: true,
				},

				// tool: {
				// 	image: true,
				// 	eraser: true,
				// 	diamond: true,
				// 	rectangle: true,
				// 	circle: true,
				// 	line: true,
				// 	arrow: true,
				// 	freedraw: true,
				// 	selection: true,
				// 	text: true,
				// },
			}}
		/>
	);
}
