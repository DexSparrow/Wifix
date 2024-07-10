# models.py

from django.db import models

class WiFiNetwork(models.Model):
    ssid = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    bssid = models.CharField(max_length=255)
    akm = models.IntegerField()
    auth = models.IntegerField()
    cipher = models.IntegerField()
    # def __str__(self):
    #     return self.bssid

# Wifi :
#     - a cc
#     - a cd
#     - a

