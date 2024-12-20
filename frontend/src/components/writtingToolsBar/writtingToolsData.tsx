import {
	BotIcon,
	EditIcon,
	FilePlus2Icon,
	FileQuestionIcon,
	Icon,
} from "lucide-react";

const writtingToolsData: {
	id: number;
	name: string;
	description: string;
	Icon: any;
}[] = [
	{ id: 0, name: "editor", description: "smart text editor", Icon: EditIcon },
	{
		id: 1,
		name: "chatbox",
		description: "chat with latest AI models",
		Icon: BotIcon,
	},
	{
		id: 2,
		name: "qabox",
		description: "search for answers in your resources",
		Icon: FileQuestionIcon,
	},
	{
		id: 3,
		name: "resources",
		description: "search for papers",
		Icon: FilePlus2Icon,
	},
];

export default writtingToolsData;
