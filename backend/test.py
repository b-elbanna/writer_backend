from search_utils import libgen_search


def test_func():
    results = libgen_search.search_in_libgen_pdf_books("atoms")
    for result in results:
        print(result.pdf_url)
    print(len(results))


if __name__ == "__main__":
    import timeit

    ex_time = timeit.timeit(test_func, number=1)
    # get_page("black hole", "en")
    print(ex_time)
