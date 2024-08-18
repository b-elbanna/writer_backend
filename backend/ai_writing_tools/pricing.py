plans = [
    {
        "name": "Basic",
        "price in USD": 5,
        "credits": 250_000,
    },
    {
        "name": "Standard",
        "price in USD": 15,
        "credits": 1_000_000,
    },
    {
        "name": "Premium",
        "price in USD": 30,
        "credits": 3_000_000,
    },
]


class Operation:
    chat = "chat"
    improvement = "improvement"
    completion = "completion"


def calc_credits(operation: str, n_tokens, model=None):
    """
    Operation:
        chat = "chat"
        improvement = "improvement"
        completion = "completion
    """

    if operation == Operation.chat:

        return n_tokens * 15
    elif operation == Operation.completion:
        return n_tokens * 2
    elif operation == Operation.improvement:
        return max((100, n_tokens * 2))
    elif operation == Operation.rewrite_wiki_section:
        return n_tokens


class Credit:

    def calc(operation: str, n_tokens, model=None):
        """
        Operation:
            chat = "chat"
            improvement = "improvement"
            completion = "completion
        """

        if operation == Operation.chat:

            return n_tokens * 15
        elif operation == Operation.completion:
            return n_tokens * 2
        elif operation == Operation.improvement:
            return max((100, n_tokens * 2))
        elif operation == Operation.rewrite_wiki_section:
            return n_tokens
