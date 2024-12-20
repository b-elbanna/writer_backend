import React, { KeyboardEvent } from "react";

interface ChatMessageInterface {
	message: {
		id?: string;
		role: "user" | "assistant" | "system";
		content: string;
		voice_message?: boolean;
		finish_reason?: "stop" | "length" | "content_filter" | null;
		created_at?: string;
	};
}
export default function UserMessage({ message }: ChatMessageInterface) {
	const pRef = React.useRef<HTMLParagraphElement>(null);

	return (
		<div className="relative shadow-xl w-fit max-w-[90%] ml-auto  bg-primary text-white my-8 py-2 px-4 rounded-[8px_0_8px_8px]  group dark:text-dark">
			<p
				ref={pRef}
				className="whitespace-pre-line overflow-x-auto dark:text-dark"
			>
				{message.content}
			</p>
			{/* <Button onKeyDown={e => { preventScrolling(e) }} variant="outlined" className="!ml-auto !block transition-opacity !duration-100 opacity-0 group-hover:opacity-100" onClick={handelCopyText}>copyText</Button> */}
			{/* <div className="flex gap-3 justify-end">
                <Tooltip title="Copy text">
                    <IconButton
                        onClick={() => {
                            handelCopyText();
                        }}
                        onKeyDown={preventScrolling}
                    >
                        <ContentCopyIcon
                            fontSize="small"
                            className="dark:fill-dark"
                        />
                    </IconButton>
                </Tooltip>
            </div> */}
		</div>
	);
}
