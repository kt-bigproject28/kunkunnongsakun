from django.urls import path
from . import views

app_name = 'selfchatbot'

urlpatterns = [
    path('chatbot/', views.chatbot, name='chatbot'),
    path('clear_logs/', views.chat_clear_logs, name='clear_logs'),
    path('error/', views.error_page, name='error_page'),
    path('chat_sessions/', views.chat_sessions, name='chat_sessions'),
    path('chat_history/<str:session_id>/', views.chat_history, name='chat_history'),
    path('delete_session/<str:session_id>/', views.delete_session, name='delete_session'),
    path('update_session_name/<str:session_id>/', views.update_session_name, name='update_session_name'),
]