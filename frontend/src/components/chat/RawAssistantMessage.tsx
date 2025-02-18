import { BotIcon } from "lucide-react";
import { ChatMessageInterface } from "./AssistantMessage";

export default function RawAssistantMessage({
	message,
}: {
	message: ChatMessageInterface;
}) {
	return (
		<div className="relative shadow-xl w-fit max-w-[90%] my-8 px-4 py-2 border-primary border-4 bg-main  rounded-[0_8px_8px] group">
			<div className=" pb-1 w-fit left-0 top-[-1px] -translate-y-full absolute  rounded-full ">
				<BotIcon size={30} strokeWidth={2} className="   dark:fill-white " />
			</div>
			<div className="whitespace-pre-line overflow-x-auto">
				{message.content}
				{message.finish_reason}
			</div>
			{/* <Button onKeyDown={(e) => { preventScrolling(e) }} variant="outlined" className="!ml-auto !block transition-opacity !duration-100 opacity-0 group-hover:opacity-100" onClick={handelCopyText}>copyText</Button> */}
			<div className="flex gap-3 pt-2 justify-between">
				<p className="text-mygray text-sm ">
					{message.created_at && new Date(message.created_at).toLocaleString()}
				</p>
			</div>
		</div>
	);
}
