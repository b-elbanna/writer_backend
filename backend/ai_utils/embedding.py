from ai_utils import open_ai
from scipy import spatial
from tenacity import retry, wait_exponential, stop_after_attempt
from . import available_models
from . import gpt
from functools import lru_cache
from scipy import spatial
import tiktoken
import re


class EmbeddedChunk:

    def __init__(self, text, embedding=None, resource_name=None):
        self.paragraph: str = text
        self.embedding: list[float] = embedding
        self.resource_name: str = resource_name

    def __repr__(self) -> str:
        return f"({self.paragraph[:5].strip().strip()}...[{len(self.paragraph)}]...{self.paragraph[-5:].strip().strip()} | [{len(self.embedding)}] embedding_length)  \n"

    def __str__(self) -> str:
        return self.__repr__()


class EmbeddingText:
    def __init__(
        self,
        text: str = None,
        embeddings: list = None,
        paragraphs: list = None,
        resource_name=None,
    ):

        if text == embeddings == paragraphs == None:
            raise ValueError("text or embeddings or paragraphs must be provided")

        self.__chunks = None
        if text is None:
            self.__chunks = [
                EmbeddedChunk(paragraph, embedding, resource_name)
                for paragraph, embedding in zip(paragraphs, embeddings)
            ]
        else:
            self.__chunks = self.__divide_and_embed(text, resource_name)

        self.resource_name = resource_name
        self.__paragraphs = paragraphs
        self.__embeddings = embeddings

    def __repr__(self):
        return str(self.chunks)

    # create iterator
    def __iter__(self):
        return iter(self.chunks)

    @property
    @lru_cache(maxsize=None)
    def chunks(self) -> list[EmbeddedChunk] | None:
        if self.__chunks is not None:
            return self.__chunks

        return self.__divide_and_embed(self.full_paragraph)

    @chunks.setter
    def chunks(self, value):
        self.__chunks = value

    @property
    @lru_cache(maxsize=None)
    def embeddings(self):
        if self.__embeddings is not None:
            return self.__embeddings
        return [chunk.embedding for chunk in self.chunks]

    @embeddings.setter
    def embeddings(self, value):
        self.__embeddings = value

    @property
    @lru_cache(maxsize=None)
    def paragraphs(self):

        if self.__paragraphs is not None:
            return self.__paragraphs
        return [chunk.paragraph for chunk in self.chunks]

    @paragraphs.setter
    def paragraphs(self, value):
        self.__paragraphs = value

    # @property
    # @lru_cache(maxsize=None)
    # def full_paragraph(self):
    #     if self.__paragraphs is not None:
    #         return " ".join(self.__paragraphs)
    #     return " ".join(self.paragraphs)

    def __divide_and_embed(self, full_paragraph: str, resource_name=None):
        """
        estimated time of execution: 1 second per 5_000 token
        """
        # full_paragraph: str = " ".join(self.paragraphs)
        splitted = re.split("\.\n", full_paragraph)
        print("splitted", len(splitted))
        paragraphs = []

        for elem in splitted:
            if len(elem) < 15:
                continue
            if len(elem) / 3 > 8_000:
                chunks = self.__create_chunks(elem, 1_000)
                for chunk in chunks:
                    paragraphs.append(chunk)
            else:
                paragraphs.append(elem)
        paragraphs = [p + "." for p in paragraphs]
        embeddings = []
        _input = []
        n_avg_tokens = 0
        usage = 0
        for i in range(len(paragraphs)):
            _input.append(paragraphs[i])
            n_avg_tokens += len(paragraphs[i])
            if i != len(paragraphs) - 1:
                if n_avg_tokens + len(paragraphs[i + 1]) < 8_000:
                    continue
            embed_req = self.make_embeddings(
                input=_input, model=available_models.embedding_model
            )
            data = embed_req.data
            for embedding in data:
                embeddings.append(embedding.embedding)
            usage += embed_req.usage.total_tokens
            _input = []
            n_avg_tokens = 0
        return [
            EmbeddedChunk(para, emb, resource_name)
            for para, emb in zip(paragraphs, embeddings)
        ]

    def __create_chunks(self, text, n):
        """Returns successive n-sized chunks from provided text."""
        tokenizer = tiktoken.get_encoding("cl100k_base")
        tokens = tokenizer.encode(text)
        i = 0
        chunks = []
        while i < len(tokens):
            # Find the nearest end of sentence within a range of 0.5 * n and 1.5 * n tokens
            j = min(i + int(1.5 * n), len(tokens))
            while j > i + int(0.5 * n):
                # Decode the tokens and check for full stop or newline
                chunk = tokenizer.decode(tokens[i:j])
                if chunk.endswith(".") or chunk.endswith("\n"):
                    break
                j -= 1
            # If no end of sentence found, use n tokens as the chunk size
            if j == i + int(0.5 * n):
                j = min(i + n, len(tokens))
            chunks.append(tokenizer.decode(tokens[i:j]))
            i = j
        if gpt.calc_token_count(chunk[-1]) < 100:
            chunks[-2] += chunks.pop()
        return chunks

    @classmethod
    @retry(
        wait=wait_exponential(multiplier=1, min=1, max=5), stop=stop_after_attempt(5)
    )
    def make_embeddings(cls, **kwargs):
        """
        for more info:
        https://platform.openai.com/docs/api-reference/embeddings/create
        """

        return open_ai.embeddings.create(**kwargs)


def sort_by_relatedness(
    query: str,
    array,
    relatedness_fn=lambda x, y: 1 - spatial.distance.cosine(x, y),
) -> list[str]:
    """Returns a list of strings and relatednesses, sorted from most related to least."""
    query_embedding_response = EmbeddingText.make_embeddings(
        input=query, model=available_models.embedding_model
    )
    query_embedding = query_embedding_response.data[0].embedding
    strings_and_relatednesses = [
        (
            i,
            relatedness_fn(
                query_embedding,
                EmbeddingText.make_embeddings(
                    input=i, model=available_models.embedding_model
                )
                .data[0]
                .embedding,
            ),
        )
        for i in array
    ]

    return sorted(strings_and_relatednesses, key=lambda x: x[1], reverse=True)
