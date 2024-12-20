import axios from "axios";

let errNum = 0;
export default async function searchInArxivClient(
	searchQuery: string,
	maxResults: number = 10,
	pagNumber: number = 1
): Promise<PaperSearchDataInerface[]> {
	try {
		// http://export.arxiv.org/api/query?search_query=all:%22black+hole%22
		const response = await axios.get("https://export.arxiv.org/api/query", {
			params: {
				search_query: `all:"${searchQuery}"`,
				start: maxResults * (pagNumber - 1),
				max_results: maxResults || 10,
			},
		});
		const parser = new DOMParser();
		const xmlDoc: XMLDocument = parser.parseFromString(
			response.data,
			"text/xml"
		);
		const articleElements = xmlDoc.querySelectorAll("entry");
		const articles: PaperSearchDataInerface[] = [];
		console.log(articleElements[0]);
		articleElements.forEach((articleElement, i) => {
			const title = articleElement.querySelector("title")?.textContent?.trim();
			const summary = articleElement
				.querySelector("summary")
				?.textContent?.trim();
			const doi = articleElement.querySelector("doi")?.textContent?.trim();
			const publisher = articleElement
				.querySelector("author")
				?.textContent?.trim();
			const published = articleElement
				.querySelector("published")
				?.textContent?.trim();
			const url =
				articleElement
					.querySelector('link[title="doi"]')
					?.getAttribute("href") ||
				articleElement.querySelector("id")?.textContent?.trim();
			const pdfUrl =
				articleElement
					.querySelector('link[title="pdf"]')
					?.getAttribute("href") || undefined;
			if (title && url) {
				articles.push({
					title,
					summary,
					publisher,
					published,
					url,
					pdfUrl,
					doi,
					source: "arxiv",
				});
			}
		});
		return articles;
	} catch (error) {
		if (errNum < 3) {
			errNum++;
			console.log(error);
			return searchInArxivClient(searchQuery, maxResults);
		} else {
			throw error;
		}
	}
}
