import PaperSearchBody from "./paperSearchBody";
import PaperSearchInput from "./paperSearchInput";

export default function PaperSearch() {
	return (
		<div className="h-full overflow-hidden flex flex-col">
			<PaperSearchInput />
			<div className="flex-1 overflow-y-auto">
				<PaperSearchBody />
			</div>
		</div>
	);
}
