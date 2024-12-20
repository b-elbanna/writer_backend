import axios from "axios";

const springerApiKey = process.env.NEXT_PUBLIC_SPRINGER_KEY;
const baseSpringerEndpoint = "https://api.springernature.com/openaccess/json";

let errNum = 0;
export default async function searchInSpringerClient(
	searchQuery: string,
	maxResults: number = 10,
	pageNumber: number = 1
) {
	const urlPparams = {
		api_key: springerApiKey,
		start: pageNumber,
		p: maxResults, // num of articles
		// "q": "doi:10.1134/S1063779623060096",
		q: `title:"${searchQuery}"`,
		// "date-facet-mode": "between",
		// "date": "2017-01-01 TO 2019-12-31",
	};
	try {
		const response = await axios.get(baseSpringerEndpoint, {
			params: urlPparams,
		});
		console.log(response.data?.records);
		const articles: PaperSearchDataInerface[] = [];
		for (let article of response.data?.records) {
			console.log(article);
			let articlePuplisher = "";
			for (let el of article.creators) {
				articlePuplisher += el.creator + " ";
			}
			let url = article.url[0].value;
			articles.push({
				summary: article?.abstract?.p || article?.abstract,
				title: article.title,
				published: article?.publicationName,
				publisher: articlePuplisher,
				url,
				source: "springer",
			});
			// articles[-1].url = await getPdgUrl(url);
		}
		return articles;
	} catch (err) {
		if (errNum < 3) {
			errNum++;
			console.log(err);
			return searchInSpringerClient(searchQuery, maxResults);
		} else {
			return Promise.reject(err);
		}
	}
}

async function getPdgUrl(url: string) {
	const res = await axios.get(url);
	res.config.url;
	url = res.request.res.responseUrl;
	return url.replace("article", "content/pdf") + ".pdf";
}
