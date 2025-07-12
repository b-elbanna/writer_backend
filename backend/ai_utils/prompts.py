CREATE_OUTLINE_SYSTEM_MESSAGE_MD = """
Your task is to create detailed and structured article outlines using Markdown formatting. Follow the guidelines below to ensure professional and comprehensive results:

Use Proper Heading Levels:
	# for the main title of the article.
	## for major section titles.
	### for subsection titles or detailed topics.

Incorporate Diverse Text Formats:
	Use tables for concise and organized data representation.
	Include ordered lists (1.) and unordered lists (*) to enhance readability.
	Provide hyperlinks to additional resources or references when relevant.	
Detail Steps and Guidelines:
	try to introduce resources
	Include step-by-step instructions in relevant sections for creating high-quality content.
Highlight best practices and actionable tips.:
	Focus on emphasizing key points to ensure the content is clear and valuable.
Cover Comprehensive Topics:
	Ensure the outline includes all important aspects of the given article title.
	Organize all topics and subtopics in a logical and coherent flow for easy understanding.
Maintain Professional Standards
	Emphasize clarity, coherence, and logical progression throughout the outline.
	Follow a professional Markdown formatting style to improve usability.
	Ensure the response is detailed, organized, and free from ambiguities.
Important Note:
	Respond directly in Markdown formatting without enclosing the content in ```markdown blocks.
"""

CREATE_OUTLINE_SYSTEM_MESSAGE_JSON = """
Your task is to create a comprehensive article outline based on the provided article title and description. The outline should be structured in JSON format as follows: 
[
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

Ensure the following: 
- Use 'h1' for main titles, 'h2' for section titles, and 'h3' for subsection titles. 
- For paragraphs ('p' type), the text can include bold formatting, colored text, or hyperlinks. 
- Each element must have a unique ID. 
- Maintain proper nesting of children elements within their parent elements. 
- use an ordered list in which each item has a specific order, set the "listStyleType" to "decimal" and use "listStart" to define the item order.
- add steps and guidelines for best article content, including key points, and all posible topics subtopics under this title .
Please create the outline with careful attention to detail and professional formatting.
"""
CREATE_OUTLINE_SYSTEM_MESSAGE = CREATE_OUTLINE_SYSTEM_MESSAGE_MD

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

Title: "The Future of Renewable Energy"
Language: "English"

JSON Response:
[
    "The article explores the advancements in renewable energy technologies and their potential impact on reducing global carbon emissions. It discusses solar, wind, and hydro power as key players in the transition to a sustainable energy future.",
    "This piece delves into the innovative solutions being developed to harness renewable energy sources. It highlights the importance of government policies and international cooperation in accelerating the adoption of green energy worldwide.",
    "The focus of the article is on the economic and environmental benefits of renewable energy. It examines the challenges and opportunities in the renewable sector, emphasizing the need for continued investment and research."
]

Use these guidelines to generate informative and engaging descriptions for any given article title. Always strive to provide value and clarity to the reader.
"""
TEXT_IMPROVEMENT_SYSTEM_MESSAGE = f"""You will be given a piece of text and your goal is to paraphrase it 
                        and to improve the quality and relevance of it
                        please:
                        - Use engaging language to make the text more compelling.
                        - Rephrase any complex or unclear sections for clarity.
                        - Use the same language as the text 
                        - Return the improved text only without any Brackets."""

TEXT_COMPLETION_SYSTEM_MESSAGE = """" 
You will be provided with a segment of text that belongs to a larger article.
Additional context, such as the article's title or outline, may also be supplied.
Your task is to complete the text seamlessly within the context of the article, continuing directly from the last word of the provided segment while maintaining coherence and relevance to the article's theme and structure.
"""
