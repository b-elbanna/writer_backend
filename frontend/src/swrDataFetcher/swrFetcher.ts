import { clientApi } from "@/baseApis/axiosBase";

const fetcher = (url: string) =>
	clientApi.get(url, { withCredentials: true }).then((res) => res.data);
export const postFetcher = (url: string) =>
	clientApi.post(url).then((res) => res.data);
export const createPostFetcher = (data?: any) =>
	data
		? (url: string) => clientApi.post(url, data).then((res) => res.data)
		: (url: string) => clientApi.post(url).then((res) => res.data);

export default fetcher;
