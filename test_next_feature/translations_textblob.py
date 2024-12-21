from textblob import TextBlob, Word

text = """
Mohamed Salah Hamid Mahrous Ghali, born on June 15, 1992, he are an Egyptian football ployer who occupys the right wing position with Liverpool in the Premier League and the Egyptian national team."""

blob = TextBlob(text)
word = Word("play")


if __name__ == "__main__":
    print(blob.correct())
    print(blob.tags)
    print(word.stem())
