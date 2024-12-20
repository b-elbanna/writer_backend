"https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=covid%20HAS_FT%3Ay&resultType=core&cursorMark=*&pageSize=10&format=json";

import axios from "axios";

const baseEPMCEndpoint =
	"https://www.ebi.ac.uk/europepmc/webservices/rest/search";
let errNum = 0;
export default async function searchInEPMCClient(
	searchQuery: string,
	maxResults: number = 10,
	pageNumber: number = 1
) {
	const urlPparams = {
		query: `${searchQuery} HAS_FT:y`,
		resultType: "core",
		cursorMark: "*", //Specify the cursorMark for pagination of the result list. For the first request you can omit the parameter or leave the cursorMark empty or use the default value * (asterisk sign). For every following page use the value of the returned nextCursorMark element.
		format: "json",
		pageSize: maxResults, // num of articles,
	};
	try {
		const response = await axios.get(baseEPMCEndpoint, {
			params: urlPparams,
			headers: {
				Accept: "application/json",
			},
		});
		const articles: PaperSearchDataInerface[] = [];
		for (let result of response.data?.resultList?.result) {
			let article = {} as PaperSearchDataInerface;
			article.title = result.title;
			article.published = result.dateOfCreation;
			article.publisher = result.authorString;
			article.summary = result.abstractText?.split("</h4>")?.pop();
			article.doi = result.doi;
			article.source = "europePMC";
			for (let el of result.fullTextUrlList.fullTextUrl) {
				if (el.documentStyle === "pdf") {
					article.pdfUrl = el.url;
				}
				if (el.documentStyle === "html") {
					article.url = el.url;
				}
				if (el.documentStyle === "doi") {
					if (!article.doi) article.doi = el.url.split("doi.org/").pop();
					if (!article.url) article.url = el.url;
				}
			}
			articles.push(article);
		}
		console.log(articles[2]);
		return articles;
	} catch (err) {
		if (errNum < 3) {
			errNum++;
			console.log(err);
			return searchInEPMCClient(searchQuery);
		} else {
			return Promise.reject(err);
		}
	}
}
