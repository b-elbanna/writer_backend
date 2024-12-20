// The format of the endpoint is
// https://api.biorxiv.org/details/[server]/[interval]/[cursor]/[format]
// where 'interval' can be
// 1) two YYYY-MM-DD dates separted by '/' and 'cursor' is the start point which defaults to 0 if not supplied,
// 		https://api.biorxiv.org/details/biorxiv/2018-08-21/2018-08-28/45/json
// 		will output 100 results within the date beginning from result 45
// 2) a numeric value for the N most recent posts,
// 3) a numeric with the letter 'd' for the most recent N days of posts

import axios from "axios";
import { headers } from "next/headers";

// or
// https://api.biorxiv.org/details/[server]/[DOI]/na/[format]

// scraping bioRxiv
let errNum = 0;
export default async function searchInSynthicalClient(
	searchQuery: string,
	maxResults: number = 10,
	pageNumber: number = 1
) {
	// https://www.biorxiv.org/search/covid+virus numresults:10 sort:relevance-rank?page=2
	const baseUrl = "https://api.synthical.com/search/get";
	const urlPparams = {
		query: searchQuery,
		is_by_id: false,
		is_manual: false,
		limit: maxResults, // num of articles,
		offset: (pageNumber - 1) * maxResults,
	};
	try {
		const response = await axios.get(baseUrl, {
			headers: {
				Accept: "application/json",
			},
			params: urlPparams,
		});
		// console.log(response);
		const articles: PaperSearchDataInerface[] = [];
		for (let result of response.data?.data?.list) {
			let article = {} as PaperSearchDataInerface;

			article.title = result.title;
			article.identifier = result.id;
			article.published = new Date(result.published).toUTCString();
			article.summary = result.abstract;
			article.doi = result.doi;
			article.publisher = result.authors
				.map((auther: any) => auther?.name)
				.join(" ");
			article.source = "synthical";
			article.url = `https://synthical.com/article/${result.id}`;
			articles.push(article);
		}
		return articles;
	} catch (err) {
		if (errNum < 3) {
			errNum++;
			console.log(err);
			return searchInSynthicalClient(searchQuery);
		} else {
			return Promise.reject(err);
		}
	}
}
