from django.contrib import admin
from django.urls import path, include
from django.shortcuts import render
from django.contrib.auth import views as auth_views
from detect.views import upload_image_for_detection

def index(request):
    return render(request,'index.html')

urlpatterns = [
    path('', index),
    path("admin/", admin.site.urls),
    path('login/', include('login.urls')),
    path('accounts/', include('django.contrib.auth.urls')),
    path('community/', include('community.urls')),
    path('selfchatbot/', include('selfchatbot.urls', namespace='selfchatbot')),
    path('prediction/', include('prediction.urls')), # predict 병합
    path('upload/', upload_image_for_detection, name='upload_image'),
    path('soil/', include('soil.urls')),
]