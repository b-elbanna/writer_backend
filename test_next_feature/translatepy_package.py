from translatepy import Translator, Language

text = """
Mohamed Salah Hamid Mahrous Ghali, born on June 15, 1992, is an Egyptian football ployer who occupys the right wing position with Liverpool in the Premier League and the Egyptian national team."""
translator = Translator()


# print(translator.services)


def test_func():
    translation = translator.spellcheck(text)

    with open("translated.txt", "w", encoding="utf-8") as f:
        print(translation.result)
        f.write(translation.result)
    return translation.result


if __name__ == "__main__":
    import timeit

    print(
        timeit.timeit(
            test_func,
            number=1,
        )
    )
