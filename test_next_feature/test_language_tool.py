import language_tool_python

text = """
Mohamed Salah Hamid Mahrous Ghali, born on June 15, 1992, he are an Egyptian football ployer who occupys the right wing position with Liverpool in the Premier League and the Egyptian national team."""

tool = language_tool_python.LanguageTool("en-US")
print(tool.check(text))
