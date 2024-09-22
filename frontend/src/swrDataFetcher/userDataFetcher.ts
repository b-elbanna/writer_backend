import useSWR from "swr";
import fetcher from "./swrFetcher";

export default function useUserDataFetcher() {
	const { data, error, isLoading, mutate } = useSWR("/auth/user", fetcher);

	return {
		user: data as {
			pk: string;
			username: string;
			email: string;
			first_name: string;
			last_name: string;
			is_staff: boolean;
			user_credits: number;
		},
		isLoading,
		isError: error,
		mutate,
	};
}
