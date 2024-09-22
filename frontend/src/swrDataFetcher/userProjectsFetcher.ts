import useSWR from "swr"
import fetcher from "./swrFetcher"

export default function useUserProjectsFetcher () {

  const { data, error, isLoading ,mutate} = useSWR('writing/projects', fetcher)
 
  return {
    projects: data as ProjectInterface[],
    isLoading,
    isError: error,
	mutate
  }
}