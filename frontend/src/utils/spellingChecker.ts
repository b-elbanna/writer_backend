import axios from "axios";

// Access is currently limited to:
// 20 requests per IP per minute (this is supposed to be a peak value - don’t constantly send this many requests or we would have to block you)
// 75KB text per IP per minute
// 20KB text per request
// Only up to 30 misspelled words will have suggestions.

const checkGrammar = async (inputText: string) => {
	try {
		const response = await axios.post(
			"https://api.languagetoolplus.com/v2/check",
			{
				text: inputText,
				language: "en-US",
			}
		);
		return response.data.matches;
	} catch (error) {
		console.error("Error checking grammar:", error);
		return [];
	}
};
