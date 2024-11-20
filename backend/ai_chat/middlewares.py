from urllib.parse import parse_qs
from channels.db import database_sync_to_async
from channels.auth import AuthMiddleware, get_user
from dj_rest_auth.jwt_auth import JWTAuthentication
from dj_rest_auth.app_settings import api_settings


class JWTWSAuthMiddleware(JWTAuthentication, AuthMiddleware):

    def populate_scope(self, scope):
        # Make sure we have a cookie
        if "cookies" not in scope:
            raise ValueError(
                "JWTWSAuthMiddleware cannot find cookiews in scope. "
                "CookieMiddleware must be above it."
            )
        super().populate_scope(scope)

    async def resolve_scope(self, scope):
        user = None
        # from session scope
        user = await get_user(scope)
        if user.is_anonymous:
            user = await self.authenticate(scope)
        if user:
            scope["user"]._wrapped = user

    @database_sync_to_async
    def authenticate(self, scope):
        from django.contrib.auth.models import AnonymousUser

        cookie_name = api_settings.JWT_AUTH_COOKIE
        cookies: dict = scope["cookies"]
        header = scope["headers"]
        if cookie_name:
            print(cookie_name)
            raw_token = cookies.get(cookie_name)
        else:
            return None

        if raw_token is None:
            return None

        validated_token = self.get_validated_token(raw_token)
        return self.get_user(validated_token) or AnonymousUser()

    async def __call__(self, scope, receive, send):
        scope = dict(scope)
        # Scope injection/mutation per this middleware's needs.
        self.populate_scope(scope)
        # Grab the finalized/resolved scope
        await self.resolve_scope(scope)

        return await super().__call__(scope, receive, send)


# database_sync_to_async:
#   It is used for retrieving the data from the database as Django ORM is totally synchronous.
@database_sync_to_async
def returnUser(token_string):
    from django.contrib.auth.models import AnonymousUser
    from rest_framework.authtoken.models import Token

    try:
        user = Token.objects.get(key=token_string).user
    except:
        user = AnonymousUser()
    return user


class TokenAuthMiddleWare:
    def __init__(self, app):
        # In the __init__ function we define the current instance app
        # to the app which is passed into the stack
        self.app = app

    async def __call__(self, scope, receive, send):
        self.chatbox_id = self.scope["url_route"]["kwargs"]["chatbox_id"]
        cookies = self.get_cookies()
        cookies = self.scope["cookies"]
        cookies = self.scope["headers"].get(b"cookie")
        # . The scope is the dictionary, which functions similarly to the request parameter in function-based views (def fun(request))
        query_string = scope["query_string"]
        query_params = query_string.decode()

        # parse_qs: It is used for parsing the query parameters from string to dict.
        query_dict = parse_qs(
            query_params
        )  # {'token': ['12efe8bf7e5ce5a8380c9f525f0e3c9d2b0a92fa']}
        token = query_dict["token"][0]
        user = await returnUser(token)
        scope["user"] = user
        return await self.app(scope, receive, send)


# print(scope):
# {
# 'type': 'websocket',
# 'path': '/ws/socket-chat/',
# 'raw_path': b'/ws/socket-chat/',
# 'headers': [(b'host', b'127.0.0.1:8000'),
# (b'connection', b'Upgrade'), (b'pragma', b'no-cache'),
# (b'cache-control', b'no-cache'),
# (b'user-agent', b'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36 Edg/112.0.1722.58'),
# (b'upgrade', b'websocket'), (b'origin', b'http://127.0.0.1:8000'), (b'sec-websocket-version', b'13'), (b'accept-encoding', b'gzip, deflate, br'),
# (b'accept-language', b'en-GB,en;q=0.9,en-US;q=0.8'),
# (b'cookie', b'localauth=localapidf2dc2697f06b17d:; isNotIncognito=true; _ga=GA1.1.845249753.1681036069; sessionid=s0meng5dk3osubiubu46nly5ahd1mc9q; csrftoken=iPCIhLk6OhSmGmeBzPQArOaWwvlsubdQcUZTFR4Gm6tIpLSNw1aFJBR06gxmX1ZO'),
# (b'sec-websocket-key', b'vmeaZFS0McSpmnY2bFXbyQ=='),
# (b'sec-websocket-extensions', b'permessage-deflate; client_max_window_bits')],
# 'query_string': b'token=12efe8bf7e5ce5a8380c9f525f0e3c9d2b0a92fa',
# 'client': ['127.0.0.1', 58492],
# 'server': ['127.0.0.1', 8000],
# 'subprotocols': [],
# 'asgi': {'version': '3.0'},
# 'cookies': {'localauth': 'localapidf2dc2697f06b17d:', 'isNotIncognito': 'true', '_ga': 'GA1.1.845249753.1681036069', 'sessionid': 's0meng5dk3osubiubu46nly5ahd1mc9q', 'csrftoken': 'iPCIhLk6OhSmGmeBzPQArOaWwvlsubdQcUZTFR4Gm6tIpLSNw1aFJBR06gxmX1ZO'},
# 'session': <django.utils.functional.LazyObject object at 0x0000028F835C6470>,
# 'user': <channels.auth.UserLazyObject object at 0x0000028F83473A00>
# }
