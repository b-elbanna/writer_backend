// import SmileFaceLoader from "@/loaders/smileFace/smileFace";
import MainLoader from "@/components/mainLoader";

export default function Loading() {
	// You can add any UI inside Loading, including a Skeleton.
	return (
		<div className="h-screen bg-main w-full flex  items-center justify-center">
			<MainLoader />
		</div>
	);
}
