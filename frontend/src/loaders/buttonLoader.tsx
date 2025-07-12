import { Loader } from "lucide-react";

export default function ButtonLoader() {
	return (
		<>
			<Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
			<span>Processing...</span>
		</>
	);
}
