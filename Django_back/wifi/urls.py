from django.urls import path
from .views import wifi_list,connect_to_wifi,toggle_wifi

urlpatterns = [
    path('wifi/', wifi_list, name='wifi_list'),
    path('connect/',connect_to_wifi, name='connect_to_wifi'),
    path('toggle/',toggle_wifi, name='toggle_wifi')
]
