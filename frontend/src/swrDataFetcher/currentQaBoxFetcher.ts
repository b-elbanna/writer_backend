import useSWR from "swr";
import fetcher from "./swrFetcher";

export default function useCurrentQaBoxFetcher(qaBoxId: string) {
	const { data, error, isLoading, mutate } = useSWR(
		`/qa/qa-box/${qaBoxId}`,
		fetcher
	);

	return {
		qaBox: data as QABoxInterface,
		isLoading,
		isError: error,
		mutate,
	};
}
