import { clientApi } from "@/baseApis/axiosBase";
import React, { useState, useRef, useCallback } from "react";

export const MicRecordButton = () => {
	const [recordingStatus, setRecordingStatus] = useState<
		"inactive" | "recording"
	>("inactive");
	const [permission, setPermission] = useState(false);
	const localAudioChunks = useRef<Blob[]>([]);
	const mediaRecorder = useRef<MediaRecorder | null>(null);
	const stream = useRef<MediaStream | null>(null);
	const mimeType = "audio/webm"; // or any other MIME type you need

	const handleRecord = useCallback(async () => {
		if (recordingStatus === "recording") {
			stopRecording();
		} else {
			if (!permission) {
				await getMicrophonePermission();
			}
			if (mediaRecorder.current) {
				mediaRecorder.current.start();
				setRecordingStatus("recording");
			}
		}
	}, [recordingStatus]);

	const getMicrophonePermission = useCallback(async () => {
		if ("MediaRecorder" in window) {
			try {
				stream.current = await navigator.mediaDevices.getUserMedia({
					audio: true,
					video: false,
				});
				mediaRecorder.current = new MediaRecorder(stream.current, {
					mimeType: mimeType,
				});

				mediaRecorder.current.ondataavailable = (event) => {
					if (event.data.size > 0) {
						localAudioChunks.current.push(event.data);
					}
				};

				mediaRecorder.current.onstop = async () => {
					const audioBlob = new Blob(localAudioChunks.current, {
						type: mimeType,
					});
					const url = URL.createObjectURL(audioBlob);
					const formData = new FormData();
					formData.append("file", audioBlob);
					const response = await clientApi.post("/chat/voice", formData);
					const data = response.data;
					console.log(response);
					// Do something with the response data
					localAudioChunks.current = [];
					stream.current?.getTracks().forEach((track) => track.stop());
					stream.current = null;
				};
			} catch (err) {
				console.log("error", err);
			}
		} else {
			console.log(
				"error",
				"The MediaRecorder API is not supported in your browser."
			);
		}
	}, [recordingStatus]);

	const stopRecording = () => {
		if (mediaRecorder.current && recordingStatus === "recording") {
			mediaRecorder.current.stop();
			setRecordingStatus("inactive");
		}
	};

	return (
		<button onClick={handleRecord}>
			{recordingStatus === "recording" ? "Stop Recording" : "Start Recording"}
		</button>
	);
};
