from .views import uploadVideo , testsessions , getVideo , uploadSubtitle , downloadVideo
from django.urls import path, include
from django.conf import settings

from django.conf.urls.static import static
urlpatterns = [
    path('operation', uploadVideo),
    path('subtitle', uploadSubtitle),
    path('home', testsessions),
    path('media/<str:filename>' , getVideo),
    path('download/<str:filename>' , downloadVideo )
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)