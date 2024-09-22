import useSWR from "swr"
import { createPostFetcher } from "./swrFetcher"


const postFetcher = createPostFetcher()
export default function useRefreshTokenPostFetcher () {

	const { data, error, isLoading ,mutate} = useSWR('/auth/token/refresh', postFetcher)
	return {
		refreshData: data as {
			access:string,
			access_expiration: string
		 } ,
		isLoading,
		isError: error,mutate
	}
}