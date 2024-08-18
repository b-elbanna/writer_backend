import json
from ai_utils.gpt import chat_completion
from openai.types import Completion


def suggest_descriptions(article_title) -> Completion:

    res = chat_completion(
        temperature=1.2,
        messages=[
            {"role": "system", "content": "always respond in json format"},
            {
                "role": "user",
                "content": f"suggest 10 short scientific descriptions for an article with the title {article_title} \nThe desires response format is{json.dumps({'description':['insert_description']})}",
            },
        ],
        response_format={"type": "json_object"},
    )
    return res


def create_outline(article_title, descriptions) -> Completion:
    """
    pass descriptions created by suggest_descriptions func to generate an outline
    """
    outline = {"outline": ["insert_section_title"]}
    res = chat_completion(
        temperature=0.8,
        messages=[
            {"role": "system", "content": "always respond in json format"},
            {
                "role": "user",
                "content": f"create an scinecific article outline given that:\nArticle Title: {article_title}\nArticle Description: {descriptions}\nThe desires response format is {json.dumps(outline)}",
            },
        ],
        response_format={"type": "json_object"},
    )
    return res
