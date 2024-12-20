import useSWR from "swr";
import fetcher from "./swrFetcher";

export default function useUserChatBoxesFetcher() {
	const { data, error, isLoading, mutate } = useSWR("/chat/chatboxes", fetcher);

	return {
		chatBoxes: data as any[],
		isLoading,
		isError: error,
		mutate,
	};
}
