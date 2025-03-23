from scipy import spatial
from ai_utils.embedding import EmbeddedChunk
from ai_utils.generation_model import OpenaiModel, GenerationModel


class paragraphRelatedness:
    """
    relatedness score for each paragraph is a number out of 1
    """

    def __init__(self, paragraph, relatedness, resource_name):
        self.paragraph = paragraph
        self.relatednessScore = relatedness
        self.resource_name = resource_name


# extract resource text content
# devide text into chucks
# embed each chunk
def most_related_paragraphs(
    question: str,
    embeddedChunks: list[EmbeddedChunk],
    top_n=50,
    relatedness_fn=lambda x, y: 1 - spatial.distance.cosine(x, y),
) -> list[paragraphRelatedness]:
    """
    return most related paragraphs for each question with its score:
    """
    question_embedding = GenerationModel().text_embedding(text=question)

    relatednesses = [
        paragraphRelatedness(
            embedded_chunck.paragraph,
            relatedness_fn(
                question_embedding["embedding"],
                embedded_chunck.embedding,
            ),
            embedded_chunck.resource_name,
        )
        for embedded_chunck in embeddedChunks
    ]
    return sorted(relatednesses, key=lambda x: x.relatednessScore, reverse=True)
