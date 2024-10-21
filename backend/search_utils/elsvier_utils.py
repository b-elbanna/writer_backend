import requests


# Daily Request Limits:
# The Scopus API allows a maximum of 20,000 requests per day.
# Rate Limits: There is a rate limit of 5 requests per second.
# https://dev.elsevier.com/sc_search_tips.html
# https://dev.elsevier.com/scopus.html#!/Scopus_Search/ScopusSearch


api_key = "6f5914ca1357e015db8060b66ebb273e"
query_scopus = "TITLE(black holes) AND OPENACCESS(1)"
url_scopus = f"https://api.elsevier.com/content/search/scopus?query={query_scopus}&apiKey={api_key}"
# https://dx.doi.org/


#############################################################################

# query_sciencedirect = "black holes"
# url_sciencedirect = f"https://api.elsevier.com/content/search/sciencedirect?query={query_sciencedirect}&apiKey={api_key}"

rescontent = ""
with open("test.json", "w", encoding="utf-8") as f:
    # url_scopus doesn't required api_key
    rescontent = requests.get(url_scopus)
    f.write(rescontent.text)


print(rescontent.status_code, url_scopus)
"""
    It covers 78 million items including records from journals,
    books and book series,
    conference proceedings and trade publications across 16 million Author Profiles and
    70,000 Institutional Profiles All of this comes together to power your research
    and help you to stay abreast with current publications, find co-authors,
    analyze journals to publish in and track and monitor global trends
"""

# requests.get(url_sciencedirect).json()["search-results"]["entry"][0]["prism:url"]
