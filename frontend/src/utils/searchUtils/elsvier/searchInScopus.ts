import axios from "axios";

const baseScopusEndpoint = `https://api.elsevier.com/content/search/scopus`;
let errNum = 0;
export default async function searchInScopusClient(
	searchQuery: string,
	maxResults: number = 10,
	pageNumber: number = 1
) {
	const urlPparams = {
		// apikey: process.env.NEXT_PUBLIC_ELSEVIER_KEY,
		start: pageNumber * maxResults || 1,
		count: maxResults || 10, // num of articles
		query: `TITLE(${searchQuery}) AND OPENACCESS(1)`,
	};
	try {
		const response = await axios.get(baseScopusEndpoint, {
			params: urlPparams,
			headers: {
				"X-ELS-APIKey": process.env.NEXT_PUBLIC_ELSEVIER_KEY,
			},
		});
		const articles: PaperSearchDataInerface[] = [];
		for (let article of response.data["search-results"]?.entry) {
			articles.push({
				doi: article["prism:doi"],
				summary: article["dc:description"] || "",
				title: article["dc:title"],
				published: article["prism:coverDate"],
				publisher: article["dc:creator"],
				url: `https://dx.doi.org/${article["prism:doi"]}`,
				source: "scopus",
			});
		}
		console.log(articles[0]);
		return articles;
	} catch (err) {
		if (errNum < 3) {
			errNum++;
			console.log(err);
			return searchInScopusClient(searchQuery);
		} else {
			return Promise.reject(err);
		}
	}
}
