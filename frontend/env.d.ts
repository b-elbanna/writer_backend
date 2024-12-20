declare global {
	interface ProjectInterface {
		id: string;
		lang: "en" | "ar";
		title: string;
		name: string;
		qaBox: string;
		chatbox: string;
		article_text?: string;
		article?: {};
		description: string;
		outline: string[];
		used_credits: 0;
		user_name: string;
		created_at: string;
		modified_at: string;
	}

	interface PaperSearchDataInerface {
		identifier?: string;
		title: string;
		source:
			| "springer"
			| "arxiv"
			| "archive"
			| "wiki"
			| "scopus"
			| "europePMC"
			| "synthical";
		summary?: string;
		url: string;
		pdfUrl?: string;
		publisher?: string;
		published?: string;
		doi?: string;
	}
	export interface QABoxInterface {
		id: string;
		name: string;
		resources: QAResourceInterface[];
		user_name: string;
		project: string;
		created_at: string;
	}
	{
	}
	interface QAResourceInterface {
		id: string;
		name: string;
		url: string | null;
		chucks_number: number;
		embeddings_number: number;
		username: string;
		created_at: string;
		type: string;
	}
	interface ChatboxMessageInterace {
		id: string;
		chatbox_name?: string;
		user_msg: string;
		assistant_msg: string;
		n_prompt_messages?: string;
		finish_reason?: "stop" | "length" | "content_filter";
		voice_message?: boolean;
		created_at: string;
	}
	interface ChatboxInterface {
		id: string;
		name: string;
		user_name: string;
		temperature: string;
		sys_message: string;
		created_at: string;
		messages?: ChatboxMessageInterace[];
	}
}

export default global;
