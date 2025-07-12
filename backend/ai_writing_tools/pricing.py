from rest_framework.response import Response
from rest_framework import status


class Plan:
    name: str
    price_in_usd: float
    credits: int

    def __repr__(self):
        return f"Plan(name={self.name}, price_in_usd={self.price_in_usd}, credits={self.credits})"

    def __init__(self, name, price_in_usd, credits):
        self.name = name
        self.price_in_usd = price_in_usd
        self.credits = credits


class Plans:
    basic = Plan("Basic", 5, 250_000)
    standard = Plan("Standard", 15, 1_000_000)
    premium = Plan("Premium", 30, 3_000_000)


class Operation:
    def __init__(self, name, credits_per_token, required_credits):
        self.name = name
        self.credits_per_token = credits_per_token
        self.required_credits = required_credits

    def __repr__(self):
        return f"Operation(name={self.name}, credits_per_token={self.credits_per_token}, required_credits={self.required_credits})"

    def is_free(self):
        return self.required_credits == 0

    def is_available(self, credits):
        return credits > self.required_credits

    def calc_credits(self, n_tokens):
        return n_tokens * self.credits_per_token

    def get_user_payment(self, request, total_tokens: int):
        if total_tokens == 0:
            return
        credits = self.calc_credits(total_tokens)
        current_user = request.user
        if current_user.user_credits < credits:
            current_user.user_credits = 0
        else:
            current_user.user_credits -= credits
        current_user.save()

    def validate_user_credits(self, view_func):
        def wrapper(_, request, *args, **kwargs):
            if self.is_available(request.user.user_credits):
                return view_func(_, request, *args, **kwargs)

            return Response(
                {"error": f"Not enough credits to generate an {self.name}."},
                status=status.HTTP_402_PAYMENT_REQUIRED,
            )

        return wrapper


class Operations:
    chat = Operation("chat", 15, 5000)
    improvement = Operation("improvement", 2, 1000)
    completion = Operation("completion", 2, 500)
    article_outline = Operation("article_outline", 1, 5000)
    article_description = Operation("article_description", 1, 1000)
    rewrite_wiki_section = Operation("rewrite_wiki_section", 20, 10000)
