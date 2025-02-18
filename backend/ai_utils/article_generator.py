import json
from ai_utils.gpt import chat_completion
from openai.types import Completion

CREATE_OUTLINE_SYSTEM_MESSAGE_MD = """
Your task is to create a comprehensive article outline based on the provided article title and description. The outline should be structured in markdown format : 
Ensure the following: 
- add steps and guidelines for best article content, including key points, and all posible topics subtopics under this title .
- Please create the outline with careful attention to detail and professional formatting.
"""
CREATE_OUTLINE_SYSTEM_MESSAGE = """
Your task is to create a comprehensive article outline based on the provided article title and description. The outline should be structured in JSON format as follows: 
{
	"outline": [
		{
			"children": [
				{
					"text": "Main Title (heading 1)"
				}
			],
			"type": "h1",
			"id": "unique-id-1",
			"align": "center"
		},
		{
			"children": [
				{
					"text": "Section Title (heading 2)"
				}
			],
			"type": "h2",
			"id": "unique-id-2"
		},
		{
			"children": [
				{
					"text": "Subsection Subtitle (heading 3)"
				}
			],
			"type": "h3",
			"id": "unique-id-3",
			"indent": 1
		},
		{
			"children": [
				{
					"text": "Normal text for section and subsection content. or orderd list :"
				}
			],
			"type": "p",
			"id": "unique-id-5",
			"indent": 2
		},
		{
			"type": "p",
			"id": "M2z68JR9xF",
			"indent": 3,
			"children": [
				{
					"text": "item 1"
				}
			],
			"listStyleType": "decimal"
		},
		{
			"type": "p",
			"id": "ozcHUUqRMA",
			"indent": 3,
			"listStyleType": "decimal",
			"children": [
				{
					"text": "item 2"
				}
			],
			"listStart": 2
		}
	]
}

Ensure the following: 
- Use 'h1' for main titles, 'h2' for section titles, and 'h3' for subsection titles. 
- For paragraphs ('p' type), the text can include bold formatting, colored text, or hyperlinks. 
- Each element must have a unique ID. 
- Maintain proper nesting of children elements within their parent elements. 
- use an ordered list in which each item has a specific order, set the "listStyleType" to "decimal" and use "listStart" to define the item order.
- add steps and guidelines for best article content, including key points, and all posible topics subtopics under this title .
Please create the outline with careful attention to detail and professional formatting.
"""


SUGGEST_DESCRIPTIONS_SYSTEM_MESSAGE = """

Your task is to generate possible descriptions for a given article title. Follow these guidelines:

1. Comprehension: Understand the context and topic suggested by the article title.
2. Accuracy: Provide descriptions that are factually correct and relevant to the topic.
3. Variety: Offer multiple descriptions at least 5, each with a slightly different perspective or angle on the topic.
4. Clarity: Ensure the descriptions are clear, concise, and easy to understand.
5. Engagement: Write in a style that is engaging and captures the reader's interest.
6. Avoid Plagiarism: Do not copy text directly from other sources. Generate original content based on the understanding of the topic.
7. JSON Format: Ensure the response is in JSON format with an array of descriptions.

Example:

Article Title: "The Future of Renewable Energy"

JSON Response:
{
  "descriptions": [
    "The article explores the advancements in renewable energy technologies and their potential impact on reducing global carbon emissions. It discusses solar, wind, and hydro power as key players in the transition to a sustainable energy future.",
    "This piece delves into the innovative solutions being developed to harness renewable energy sources. It highlights the importance of government policies and international cooperation in accelerating the adoption of green energy worldwide.",
    "The focus of the article is on the economic and environmental benefits of renewable energy. It examines the challenges and opportunities in the renewable sector, emphasizing the need for continued investment and research."
  ]
}
Use these guidelines to generate informative and engaging descriptions for any given article title. Always strive to provide value and clarity to the reader.
"""


def suggest_descriptions(article_title) -> Completion:

    res = chat_completion(
        temperature=1.2,
        messages=[
            {
                "role": "system",
                "content": SUGGEST_DESCRIPTIONS_SYSTEM_MESSAGE,
            },
            {
                "role": "user",
                "content": f"{article_title} ",
                # "content": f"suggest 10 short scientific descriptions for an article with the title {article_title} \nThe desires response format is{json.dumps({'descriptions':['insert_description']})}",
            },
        ],
        response_format={"type": "json_object"},
    )
    return res


def create_outline(article_title, descriptions) -> Completion:
    """
    pass descriptions created by suggest_descriptions func to generate an outline
    """
    res = chat_completion(
        temperature=1.1,
        messages=[
            {"role": "system", "content": "always respond in markdown format"},
            {"role": "system", "content": CREATE_OUTLINE_SYSTEM_MESSAGE_MD},
            {
                "role": "user",
                "content": f"Article Title: {article_title}\nArticle Description: {descriptions}",
            },
        ],
    )
    return res
