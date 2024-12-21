# https://github.com/LibreTranslate/LibreTranslate?tab=readme-ov-file


# can be installed and hosted localy

# pip install libretranslate
import requests
import json

# required api key:
# {"error":"Visit https://portal.libretranslate.com to get an API key"}
res = requests.post(
    "https://libretranslate.com/translate",
    data=json.dumps({"q": "Hello!", "source": "en", "target": "es", "api_key": ""}),
    headers={"Content-Type": "application/json"},
)
print(res.text)
