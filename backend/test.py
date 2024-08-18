from collections import namedtuple

openai_models = namedtuple(
    "openai_models",
    [
        "base_model",
        "gpt_35_turbo",
        "gpt_4",
        "gpt_4_turbo",
        "gpt_4_vision",
        "gpt_4o",
        "gpt_4o_mini",
        "embedding_model",
    ],
)
available_models = openai_models(
    base_model="gpt-4o-mini",
    gpt_35_turbo="gpt-3.5-turbo-1106",
    gpt_4="gpt-4",
    gpt_4_turbo="gpt-4-1106-preview",
    gpt_4_vision="gpt-4-vision-preview",
    gpt_4o="gpt-4o",
    gpt_4o_mini="gpt-4o-mini-2024-07-18",
    embedding_model="text-embedding-ada-002",
)
print(available_models._asdict())
print(available_models._field_defaults)
print(available_models._fields)
# print(dict(available_models))
