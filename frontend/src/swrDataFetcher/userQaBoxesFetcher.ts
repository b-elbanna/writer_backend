import useSWR from "swr";
import fetcher from "./swrFetcher";

export default function useUserQaBoxesFetcher() {
	const { data, error, isLoading, mutate } = useSWR("/qa/qa-boxes", fetcher);

	return {
		qaBoxes: data as QABoxInterface[],
		isLoading,
		isError: error,
		mutate,
	};
}
