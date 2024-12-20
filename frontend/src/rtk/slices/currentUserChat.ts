import { clientApi } from "@/baseApis/axiosBase";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

let nextPageUrl: string | undefined;
interface CurrentUserChatbox {
	chatbox: ChatboxInterface;
	nextPageUrl?: string;
	totalMessagesCount: number;
	status:
		| "init"
		| "pending"
		| "fulfilled"
		| "rejected"
		| "nextpagePending"
		| "nextpageRejected";
}
const initialState = {
	chatbox: {},
	status: "init",
	totalMessagesCount: 0,
} as CurrentUserChatbox;
interface ChatMessagesApiResponse {
	count: number;
	next: string;
	previous: string;
	results: ChatboxMessageInterace[];
}

export const getCurrentUserChatbox = createAsyncThunk(
	"currentUserChatbox/getCurrentUserChatbox",
	async ({ chatboxId }: { chatboxId: string }) => {
		const chatRes = await clientApi.get(`/chat/chatbox/${chatboxId}`);
		const messRes = await clientApi.get(`/chat/messages/${chatboxId}`);
		let chatboxData: ChatboxInterface = chatRes.data;
		let messData: ChatMessagesApiResponse = messRes.data;
		chatboxData.messages = messData.results.reverse();
		nextPageUrl = messData.next;
		return {
			chatbox: chatboxData,
			nextPageUrl: messData.next,
			totalMessagesCount: messData.count,
		};
	}
);
export const createUserChatbox = createAsyncThunk(
	"currentUserChatbox/createUserChatbox",
	async ({
		name,
		temperature,
		sys_message,
	}: {
		name: string;
		temperature?: string;
		sys_message?: string;
	}) => {
		const response = await clientApi.post(`/chat/chatboxes`, {
			name,
			temperature,
			sys_message,
		});
		const chatboxData: ChatboxInterface = response.data;
		const messRes = await clientApi.get(`/chat/messages/${chatboxData.id}`);
		let messData: ChatMessagesApiResponse = messRes.data;
		chatboxData.messages = messData.results.reverse();
		nextPageUrl = messData.next;
		return {
			chatbox: chatboxData,
			nextPageUrl: messData.next,
			totalMessagesCount: messData.count,
		};
	}
);

export const getNextMessagesPage = createAsyncThunk(
	"currentUserChatbox/getNextMessagesPage",
	async () => {
		if (nextPageUrl) {
			const messRes = await axios.get(nextPageUrl);
			let messData: ChatMessagesApiResponse = messRes.data;
			nextPageUrl = messData.next;
			return {
				messages: messData.results.reverse(),
				nextPageUrl: messData.next,
			};
		}
		return null;
	}
);

const currentUserChatbox = createSlice({
	name: "currentUserChatbox",
	initialState,
	reducers: {
		resetCurrentUserChatbox: (state, action) => {
			return initialState;
		},
		addChatMessage: (state, action) => {
			let newMessage = action.payload as ChatboxMessageInterace;
			if (state.chatbox.messages)
				state.chatbox.messages = [...state.chatbox.messages, newMessage];
			else state.chatbox.messages = [newMessage];
			return state;
		},
	},
	extraReducers: (builder) => {
		// get current chatbox
		builder.addCase(getCurrentUserChatbox.fulfilled, (state, action) => {
			state.status = "fulfilled";
			state.chatbox = action.payload.chatbox;
			state.nextPageUrl = action.payload.nextPageUrl;
			state.totalMessagesCount = action.payload.totalMessagesCount;
			return state;
		});
		builder.addCase(getCurrentUserChatbox.pending, (state, action) => {
			state.status = "pending";
			return state;
		});
		builder.addCase(getCurrentUserChatbox.rejected, (state, action) => {
			state.status = "rejected";
			return state;
		});
		// ///////////////////////////////////////////////////

		// create and set current chatbox
		builder.addCase(createUserChatbox.fulfilled, (state, action) => {
			state.status = "fulfilled";
			state.chatbox = action.payload.chatbox;
			state.nextPageUrl = action.payload.nextPageUrl;
			state.totalMessagesCount = action.payload.totalMessagesCount;
			return state;
		});
		builder.addCase(createUserChatbox.pending, (state, action) => {
			state.status = "pending";
			return state;
		});
		builder.addCase(createUserChatbox.rejected, (state, action) => {
			state.status = "rejected";
			return state;
		});
		// ///////////////////////////////////////////////////

		// append current chatbox messages
		builder.addCase(getNextMessagesPage.fulfilled, (state, action) => {
			state.status = "fulfilled";
			state.nextPageUrl = action.payload?.nextPageUrl;
			if (action.payload && state.chatbox.messages)
				state.chatbox.messages = [
					...action.payload.messages,
					...state.chatbox.messages,
				];
			return state;
		});
		builder.addCase(getNextMessagesPage.pending, (state, action) => {
			state.status = "nextpagePending";
			return state;
		});
		builder.addCase(getNextMessagesPage.rejected, (state, action) => {
			state.status = "nextpageRejected";
			return state;
		});
		// ///////////////////////////////////////////////////
	},
});

export const { resetCurrentUserChatbox, addChatMessage } =
	currentUserChatbox.actions;
export default currentUserChatbox.reducer;
