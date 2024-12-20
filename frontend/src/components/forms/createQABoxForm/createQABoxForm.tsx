import postCreateQABoxAction from "@/endpointActions/postCreateQABoxAction";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

export default function CreateQABoxForm() {
	const [IsInputLoading, setInputLoading] = useState(false);
	const router = useRouter();
	return (
		<div className="flex gap-2">
			<input
				disabled={IsInputLoading}
				onKeyDown={(e) => {
					if (e.key == "Enter") {
						e.preventDefault();
						const v = e.currentTarget.value;
						e.currentTarget.value = "";
						setInputLoading(true);
						postCreateQABoxAction({
							name: v,
						}).then(async (res) => {
							let data: QABoxInterface = res.data;
							router.push(`/qa-box/${data.id}`);
						});
					}
				}}
				type="text"
				placeholder="Enter your box name"
				className="outline-none"
			/>
			{IsInputLoading && (
				<div className="inline-block ">
					<Loader className="animate-spin" />
				</div>
			)}
		</div>
	);
}
