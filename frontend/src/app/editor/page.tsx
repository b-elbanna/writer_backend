import MainEditor from "@/components/editor/mainEditor";

export default function EditorPage() {
	return (
		<main className=" w-full h-screen overflow-hidden p-10  ">
			<MainEditor className="overflow-hidden rounded border-4 border-primary" />
		</main>
	);
}
