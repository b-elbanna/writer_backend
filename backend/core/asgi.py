"""
ASGI config for core project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os
from django.core.asgi import get_asgi_application
from django.urls import path
from channels.routing import ProtocolTypeRouter
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from channels.sessions import SessionMiddleware, CookieMiddleware
from ai_chat.middlewares import JWTWSAuthMiddleware
from ai_chat.consumers import ChatConsumer


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")


def JWTAuthMiddlewareStack(inner):

    return CookieMiddleware(SessionMiddleware(JWTWSAuthMiddleware(inner)))


application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": AllowedHostsOriginValidator(
            JWTAuthMiddlewareStack(
                URLRouter(
                    [
                        path("ws/chat/<chat_id>", ChatConsumer.as_asgi()),
                    ]
                )
            )
        ),
    }
)
