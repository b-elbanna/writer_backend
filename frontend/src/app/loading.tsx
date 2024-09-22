import SmileFaceLoader from "@/loaders/smileFace/smileFace";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return <div className="h-screen w-full flex  items-center justify-center">
	<SmileFaceLoader />
  </div>
}