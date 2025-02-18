import type { FileRouter } from "uploadthing/next";

import { createRouteHandler, createUploadthing } from "uploadthing/next";

const f = createUploadthing();

const ourFileRouter = {
	editorUploader: f(["image", "text", "blob", "pdf", "video", "audio"])
		.middleware(() => {
			return {};
		})
		.onUploadComplete(({ file }) => {
			return { file: JSON.stringify(file) }; // Ensure the file object is JSON-compatible
		}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

export const { GET, POST } = createRouteHandler({
	router: ourFileRouter,
});
