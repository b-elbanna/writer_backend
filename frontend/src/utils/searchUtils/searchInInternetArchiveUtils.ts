// title:(black holes) AND description:(black holes) AND collection:(journals) AND format:(Text PDF)

// https://archive.org/advancedsearch.php?q=description:(black holes) AND mediatype:(texts)&fl[]=collection&fl[]=identifier&fl[]=title&fl[]=type&sort[]=&sort[]=&sort[]=&rows=50&page=1&output=json&callback=callback&save=yes

import axios from "axios";

let errNum = 0;
export default async function searchInInternetArchiveClient(
	searchQuery: string,
	maxResults: number = 10,
	pageNumber: number = 1
) {
	try {
		const response = await axios.get("https://archive.org/advancedsearch.php", {
			params: {
				// q: `title:("${searchQuery}") AND description:("${searchQuery}") AND collection:(journals OR openaccess) AND format:(Text PDF) AND mediatype:(texts)`,
				q: `"${searchQuery}" AND collection:(journals) AND -collection:(arxiv) AND format:(Text PDF) AND mediatype:(texts)`,
				fl: [
					"collection",
					"language",
					"creator",
					"date",
					"publisher",
					"identifier",
					"title",
					"description",
					"external-identifier",
					"format",
					"source",
				],
				sort: ["", "", ""],
				rows: maxResults || 10,
				page: pageNumber || 1,
				output: "json",
			},
		});
		const articles: PaperSearchDataInerface[] = [];
		const resData = response.data.response.docs;
		console.log(resData[0]);
		for (let article of resData) {
			const newArt: PaperSearchDataInerface = {
				identifier: article?.identifier,
				summary: article.description,
				title: article.title,
				published: article.date,
				publisher: article.creator,
				url: article.source,
				source: "archive",
			};

			articles.push(newArt);
		}
		return articles;
	} catch (error) {
		if (errNum < 2) {
			errNum++;
			console.log(error);
			return searchInInternetArchiveClient(searchQuery, maxResults);
		} else {
			return Promise.reject(error);
		}
	}
}

export async function getInternetArchiveItemPdfUrl(identifier: string) {
	const filesMetadataUrl = `https://archive.org/metadata/${identifier}/files`;
	const response = await axios.get(filesMetadataUrl);
	const filesMetaData = response.data.result;
	console.log(response.data);
	for (let fileData of filesMetaData) {
		if (fileData.format === "Text PDF") {
			const pdfdownloadUrl = `https://archive.org/download/${identifier}/${fileData.name}`;

			// console.log(pdfdownloadUrl);
			return { pdfdownloadUrl, sizeBytes: fileData.size };
		}
	}
	// console.log(filesMetaData);
}
