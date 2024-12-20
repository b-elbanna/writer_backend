import useSWR from "swr";
import fetcher from "./swrFetcher";

export default function useProjectFetcher(projectId: string) {
	const { data, error, isLoading, mutate } = useSWR(
		`/writing/project/${projectId}`,
		fetcher
	);

	return {
		project: data as ProjectInterface,
		isLoading,
		isError: error,
		mutate,
	};
}
