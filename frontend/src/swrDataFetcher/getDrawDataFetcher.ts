import useSWR from "swr";
import fetcher from "./swrFetcher";

export interface DrawBoxRes {
	id: string;
	user: string;
	name: string;
	project: string;
	elements: any[];
	created_at: string;
	modified_at: string;
}

export default function useDrawFetcher(projectId: string) {
	const { data, error, isLoading, mutate } = useSWR(
		`/writing/project/${projectId}/draws`,
		fetcher
	);
	console.log(data);
	return {
		draws: data as DrawBoxRes[],
		isLoading,
		isError: error,
		mutate,
	};
}
