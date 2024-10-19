import wikipedia as wk
import wikipediaapi as wkapi
from functools import lru_cache

base_agent = ".wikipedia.org"

langs = [
    "en",
    "ar",
]

SECTIONS_TO_IGNORE = [
    "See also",
    "References",
    "External links",
    "Further reading",
    "Footnotes",
    "Bibliography",
    "Sources",
    "Citations",
    "Literature",
    "Footnotes",
    "Notes and references",
    "Photo gallery",
    "Works cited",
    "Photos",
    "Gallery",
    "Notes",
    "References and sources",
    "References and notes",
]


class WikiPage:

    def __init__(self, title, lang):
        self.title = title
        self.lang = lang
        self.page_id = self.title

    def __repr__(self):
        return f"|{self.title}|"

    @classmethod
    def get_langs():
        langs = {}
        for key in langs:
            langs[key] = wk.languages()[key]
        return langs

    @property
    @lru_cache(maxsize=None)
    def __page(self):
        wk.set_lang(self.lang)
        page = wk.WikipediaPage(title=self.title)
        return page

    @property
    @lru_cache(maxsize=None)
    def url(self):

        return self.__page.url

    @property
    @lru_cache(maxsize=None)
    def summary(self):
        summary = wk.summary(self.title, auto_suggest=False, redirect=False)
        return summary

    @property
    @lru_cache(maxsize=None)
    def text_content(self) -> str:
        return self.__page.content

    @property
    @lru_cache(maxsize=None)
    def references(self) -> list:
        return self.__page.references

    @property
    @lru_cache(maxsize=None)
    def images_urls(self) -> list[str]:
        return self.__page.images

    @property
    @lru_cache(maxsize=None)
    def sections(self) -> list:
        agent = self.lang + base_agent
        wiki = wkapi.Wikipedia(user_agent=agent, language=self.lang)
        page = wkapi.WikipediaPage(wiki=wiki, title=self.title, language=self.lang)
        return [str(sec) for sec in page.sections]


def search(title: str, lang: str, n_suggestions: int = 10) -> list[WikiPage]:
    wk.set_lang(lang)
    suggestions = wk.search(title, results=n_suggestions)

    # is_disambiguation: bool = suggestion.find("disambiguation") != -1
    is_disambiguation = lambda suggestion: suggestion.find("disambiguation") != -1
    disambiguations = []

    for suggestion in suggestions:
        # remove and ignore disambiguations
        if is_disambiguation(suggestion):
            print(suggestion)
            # titles = wk.search(suggestion, results=n_suggestions)
            # disambiguations += titles
            suggestions.remove(str(suggestion))
    # disambiguations = filter(lambda el: not is_disambiguation(el), disambiguations)
    suggestions += disambiguations

    return [WikiPage(suggestion, lang) for suggestion in suggestions]


if __name__ == "__main__":
    print(search("black holes", "en", 10))
