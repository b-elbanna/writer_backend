import { QABoxAnswerInterface } from "@/endpointActions/postCreateAnswerBoxAction";
import QABoxResult from "../qabox/qaboxResult";

export function Qabox({ qaResults }: { qaResults: QABoxAnswerInterface[] }) {
	return (
		<div
			className={`${
				qaResults.length ? "h-[300px]" : "h-0"
			} overflow-y-auto w-full overflow-x-hidden transition-all duration-500 ease-in-out border-t backdrop-blur-md bg-white/50 shadow-lg border-gray-100`}
		>
			<div className="max-w-3xl mx-auto p-4 py-10 mb-12">
				{qaResults.map(
					(qaResult, i) =>
						i < 4 && <QABoxResult key={qaResult[1]} qaBoxResult={qaResult} />
				)}
			</div>
		</div>
	);
}
