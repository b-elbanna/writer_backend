from scipy import spatial
from ai_utils.embedding import EmbeddingText, gpt, EmbeddedChunk


class paragraphRelatedness:
    """
    relatedness score for each paragraph is a number out of 1
    """

    def __init__(self, paragraph, relatedness):
        self.paragraph = paragraph
        self.relatednessScore = relatedness


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
    question_embedding = EmbeddingText.make_embeddings(
        input=question, model=gpt.available_models.embedding_model
    )

    relatednesses = [
        paragraphRelatedness(
            embedded_chunck.paragraph,
            relatedness_fn(
                question_embedding.data[0].embedding,
                embedded_chunck.embedding,
            ),
        )
        for embedded_chunck in embeddedChunks
    ]
    return sorted(relatednesses, key=lambda x: x.relatednessScore, reverse=True)


# save embedding as a resource
# receive a question
# search for answer in ebeddings
# send most related paragraphs
