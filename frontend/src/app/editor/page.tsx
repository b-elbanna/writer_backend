"use client";

import authProtection from "@/auth/authProtection";
import MainEditor from "@/components/editor/mainEditor";

function EditorPage() {
	return (
		<div className=" w-full h-screen p-10 bg-primary">
			<MainEditor className="overflow-hidden" />
		</div>
	);
}

export default authProtection(EditorPage);
