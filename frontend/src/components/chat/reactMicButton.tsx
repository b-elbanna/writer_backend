// https://www.npmjs.com/package/react-media-recorder
import { baseUrl } from "@/baseApis/base";
import {
	CheckCircle,
	LoaderCircleIcon,
	MicIcon,
	PlayCircleIcon,
} from "lucide-react";
import { useState } from "react";
import { ReactMediaRecorder } from "react-media-recorder";

export const RecordView = ({
	inputRef,
	setPlaceholder,
}: {
	inputRef: React.RefObject<HTMLDivElement>;
	setPlaceholder: React.Dispatch<React.SetStateAction<string>>;
}) => {
	const [sendingStatus, setSendingStatus] = useState<
		"init" | "sending" | "sent"
	>("init");
	return (
		<div>
			<ReactMediaRecorder
				onStop={async (blobUrl, Blob) => {
					setSendingStatus("sending");
					setPlaceholder("transcripting...");
					const formData = new FormData();
					formData.append("file", Blob);
					fetch(baseUrl + "/api/v1/chat/voice", {
						method: "POST",
						body: formData,
						credentials: "include",
					})
						.then((response) => response.json())
						.then((data: { content: string; size: number }) => {
							console.log(data);
							inputRef.current && (inputRef.current.textContent = data.content);
							setSendingStatus("sent");
							setPlaceholder("");
							setTimeout(() => {
								setSendingStatus("init");
							}, 500);
						})
						.catch((error) => console.error(error));
				}}
				blobPropertyBag={{ type: "audio/webm" }}
				render={({ status, startRecording, stopRecording, mediaBlobUrl }) => (
					<div className="px-2">
						<button
							disabled={sendingStatus !== "init"}
							className="p-1 flex items-center justify-center"
							onClick={() => {
								if (status === "recording") {
									stopRecording();
								} else {
									setPlaceholder("recording...");
									startRecording();
								}
							}}
						>
							<MicButtonIcon sendingStatus={sendingStatus} status={status} />
						</button>
						{/* <p className="text-sm text-mygray">{status}</p> */}
					</div>
				)}
			/>
		</div>
	);
};

const MicButtonIcon = ({
	sendingStatus,
	status,
}: {
	sendingStatus: string;
	status: string;
}) => {
	if (status === "recording")
		return <PlayCircleIcon className="animate-pulse stroke-active" size={25} />;
	else {
		if (sendingStatus === "init") {
			return <MicIcon size={25} className={`stroke-active `} />;
		}
		if (sendingStatus === "sending") {
			return (
				<LoaderCircleIcon className="animate-spin stroke-mygray" size={25} />
			);
		}
		if (sendingStatus === "sent") {
			return <CheckCircle size={25} className={`stroke-green-300 `} />;
		}
	}
};
