from search_utils import libgen_search
import requests
import io
import PyPDF2
import json


def test_func():
    extract_text_from_pdf_file("example.pdf")


def extract_text_from_pdf_file(file_path: str):
    pdf_file_obj = open(file_path, "rb")
    pdf_reader = PyPDF2.PdfReader(pdf_file_obj)

    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text()
    return text


def exract_text_from_pdf_url(pdf_url: str):
    # take about 30 seconds per 1_mb
    response = requests.get(pdf_url)

    # pdf_file_obj = open("example.pdf", "rb")
    pdf_file_obj = io.BytesIO(response.content)
    pdf_reader = PyPDF2.PdfReader(pdf_file_obj)

    text = ""
    # this loop takes about 4 seconds per 1_mb
    for page in pdf_reader.pages:
        text += page.extract_text()
    return text


if __name__ == "__main__":
    import timeit

    ex_time = timeit.timeit(test_func, number=1)
    # get_page("black hole", "en")
    print(ex_time)
