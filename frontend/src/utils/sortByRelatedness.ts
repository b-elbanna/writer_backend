import { clientApi } from "@/baseApis/axiosBase";

export default async function sortByRelatedness(
	query: string,
	listToSort: string[]
) {
	const res = await clientApi.post("writing/sort-by-relatedness", {
		query: query,
		data_array: listToSort,
	});
	return res.data as [string, number][];
}
