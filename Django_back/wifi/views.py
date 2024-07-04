# #views.py

# from django.shortcuts import render
# from rest_framework.views import APIView
# from rest_framework.decorators import api_view
# from rest_framework import status
# from rest_framework.response import Response
# from rest_framework.permissions import IsAuthenticated
# from django.http import JsonResponse
# import wifi
# import json



# import pywifi
# from pywifi import const
# from django.http import JsonResponse
# from rest_framework.decorators import api_view
# from .models import WiFiNetwork  # Importez votre modèle WiFiNetwork
# import qrcode
# from io import BytesIO
# from django.core.files.base import ContentFile
# from base64 import b64encode

# my_debug = {}


# @api_view(['POST'])
# def toggle_wifi(request):
#     action = request.data.get('action')  # 'on' ou 'off'
#     print(f"action = {action}")
#     wifi = pywifi.PyWiFi()
#     iface = wifi.interfaces()[0]  # Prend la première interface WiFi trouvée

#     if action == 'on':
#         iface.scan()
#         iface.connect(iface.scan_results()[0])
#         return Response({'message': 'WiFi activated.'}, status=status.HTTP_200_OK)
#     elif action == 'off':
#         iface.disconnect()
#         return Response({'message': 'WiFi deactivated.'}, status=status.HTTP_200_OK)
#     else:
#         return Response({'error': 'Invalid action.'}, status=status.HTTP_400_BAD_REQUEST)

# @api_view(['GET'])
# def wifi_list(request):
#     wifi = pywifi.PyWiFi()
#     iface = wifi.interfaces()[0]  # Prend la première interface WiFi trouvée

#     iface.scan()
#     scan_results = iface.scan_results()

#     wifi_list_json = []
#     for network in scan_results:
#         wifi_list_json.append({
#             "SSID": network.ssid,
#             "Signal": network.signal
#         })
#     return JsonResponse(wifi_list_json, safe=False)

# app_iface = None
# app_profile = None

# def app_connect_wifi(iface,profile,clear = 1,delay=10):
#     if(clear):
#         iface.disconnect()
#         iface.remove_all_network_profiles()
#     iface.connect(iface.add_network_profile(profile))
#     import time
#     time.sleep(delay)

#     return iface.status() == const.IFACE_CONNECTED

# def timer_check_status():
#     if(app_iface.status() == const.IFACE_CONNECTED):
#         return 1
#     else:
#         # Scanning wifi again if it find the older wifi
#         iface.connect(tmp_profile)
#         # Attendre la connexion
#         import time
#         time.sleep(10)

#         return 0
    
# @api_view(['POST'])
# def connect_to_wifi(request):
#     global app_iface,app_profile
#     global my_debug
#     SSID = request.data.get('SSID')
#     password = request.data.get('password')


#     my_debug["SSID"] = SSID
#     my_debug["password"]= password
#     if not SSID or not password:
#         return Response({'error': 'SSID and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

#     if(app_profile and SSID == app_profile.ssid and app_connect_wifi(app_iface,app_profile,delay=1)):
#         # The delay for reconnection should be less than the usual connection
#         print("Already Connected")
#         return Response({'success': 'Connected to WiFi.','rr':'already connected'}, status=status.HTTP_200_OK)

#     wifi = pywifi.PyWiFi()
#     iface = wifi.interfaces()[0]

#     # Configurer le profil de connexion
#     profile = pywifi.Profile()
#     profile.ssid = SSID
#     profile.auth = const.AUTH_ALG_OPEN
#     profile.akm.append(const.AKM_TYPE_WPA2PSK)
#     profile.cipher = const.CIPHER_TYPE_CCMP
#     profile.key = password
#     app_profile = profile
#     app_iface = iface

#     res = app_connect_wifi(app_iface,app_profile,clear=1)
#     # Attendre la connexion
#     if res:
#         # Enregistrer les informations WiFi dans la base de données
#         WiFiNetwork.objects.create(ssid=SSID, password=password)
#         return Response({'success': 'Connected to WiFi.'}, status=status.HTTP_200_OK)
#     else:
#         print("#"*20)
#         print("Debug:",my_debug)
#         print("#"*20)
#         return Response({'error': 'Failed to connect to WiFi.'}, status=status.HTTP_400_BAD_REQUEST)



# @api_view(['GET'])
# def generate_qr_code(request, ssid):
#     wifi_networks = WiFiNetwork.objects.filter(ssid=ssid)

#     if wifi_networks.count() > 1:
#         return Response({'error': 'Multiple WiFi networks found with the same SSID.'}, status=status.HTTP_400_BAD_REQUEST)

#     try:
#         wifi_network = wifi_networks.first()
#         qr_data = f"WIFI:T:WPA;S:{wifi_network.ssid};P:{wifi_network.password};;"
#         qr = qrcode.QRCode(
#             version=1,
#             error_correction=qrcode.constants.ERROR_CORRECT_L,
#             box_size=10,
#             border=4,
#         )
#         qr.add_data(qr_data)
#         qr.make(fit=True)
#         img = qr.make_image(fill='black', back_color='white')

#         buffer = BytesIO()
#         img.save(buffer, format="PNG")
#         buffer.seek(0)

#         return HttpResponse(buffer, content_type="image/png")
#     except WiFiNetwork.DoesNotExist:
#         return Response({'error': 'WiFi network not found.'}, status=status.HTTP_404_NOT_FOUND)



#views.py

from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
import wifi
import json



import pywifi
from pywifi import const
from django.http import JsonResponse
from rest_framework.decorators import api_view
from .models import WiFiNetwork  # Importez votre modèle WiFiNetwork
import qrcode
from io import BytesIO
from django.core.files.base import ContentFile
from base64 import b64encode

my_debug = {}
app_iface = None
app_profile = None


class Wifix:
    """Structure pour representer l'objet wifi"""
    debug : dict
    scanned_wifi_list : dict
    state_code : dict
    # wifi : 
    # profile : 
    # iface : 
    # current_wifi : 
    def __init__(self):
        self.state_code = {
            0:"Not Connected",
            1:"Connected",
            2:"Already Connected"    
        }
        self.profile,self.iface = None,None
        self.scanned_wifi_list = {}
        self.wifi = pywifi.PyWiFi()
        self.iface = self.wifi.interfaces()[0]  # Prend la première interface WiFi trouvée
    def toggle_wifi(self):
        pass

    def scan_wifi(self):
        self.iface.scan()
        scan_results = self.iface.scan_results()
        return scan_results
    def wifi_list(self):
        wifi_list_json = []
        # pywifi.Profile().__dict__.items()
        # dict_items([('id', 0), ('auth', 0), ('akm', [0]), ('cipher', 0), ('ssid', None), ('bssid', None), ('key', None)])
        #const.AKM_TYPE_NONE, const.AKM_TYPE_WPA, const.AKM_TYPE_WPAPSK const.AKM_TYPE_WPA2PSK
        scan_results = self.scan_wifi()
        for network in scan_results:
            # network.akm -> [1,2] -> 12
            print(f"{network.ssid} {sum(network.akm)}")
            wifi_list_json.append({
                "BSSID":network.bssid,
                "SSID": network.ssid,
                "Signal": network.signal,
                "AKM":sum(network.akm)
            })
        return wifi_list_json

    def check_status(self):
        return self.iface.status() == const.IFACE_CONNECTED
    
    def simple_connect(self,profile,delay=10):
        self.iface.connect(self.iface.add_network_profile(profile))    
        import time
        time.sleep(delay)
        return self.iface.status() == const.IFACE_CONNECTED

    def connect(self,SSID,password):
        my_debug["SSID"] = SSID
        my_debug["password"]= password
        state = 0
        temp_profile = None
        if(SSID == profile.ssid):
            state = self.check_status()
        if(state):
            # still connected
            return 1

        # if state is 0
        if(SSID in self.scanned_wifi_list.keys()):
            # we should use bssid
            self.iface.disconnect()
            self.iface.remove_all_network_profiles()
        else:
            new_profile = pywifi.Profile()
            new_profile.ssid = SSID
            new_profile.auth = const.AUTH_ALG_OPEN
            new_profile.akm.append(const.AKM_TYPE_WPA2PSK)
            new_profile.cipher = const.CIPHER_TYPE_CCMP
            new_profile.key = password

            self.scanned_wifi_list[SSID] = new_profile

        state = self.simple_connect(self.scanned_wifi_list[SSID])
        if(state):
            #connected to the wifi
            WiFiNetwork.objects.create(ssid=SSID, password=password)
            return 1
        if(SSID == profile.ssid):
            # Can't access with the current password
            return 0
        return 0

wifix = Wifix()


@api_view(['GET'])
def check_status(request):
    return wifix.check_status()

@api_view(['POST'])
def toggle_wifi(request):
    global wifix
    action = request.data.get('action')  # 'on' ou 'off'

    if action == 'on':
        wifix.iface.scan()
        wifix.iface.connect(iface.scan_results()[0])
        return Response({'message': 'WiFi activated.'}, status=status.HTTP_200_OK)
    elif action == 'off':
        wifix.iface.disconnect()
        return Response({'message': 'WiFi deactivated.'}, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Invalid action.'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def wifi_list(request):
    global wifix
    wifi_list_json = wifix.wifi_list()
    return JsonResponse(wifi_list_json, safe=False)
    
@api_view(['POST'])
def connect_to_wifi(request):
    global wifix
    SSID = request.data.get('SSID')
    password = request.data.get('password')
    
    if not SSID or not password:
        return Response({'error': 'SSID and password are required.'}, status=status.HTTP_400_BAD_REQUEST)
    
    res = wifix.connect(SSID,password)
    if(res):
        return Response({'success': 'Connected to WiFi.','rr':'already connected'}, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Failed to connect to WiFi.'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def generate_qr_code(request, ssid):
    wifi_networks = WiFiNetwork.objects.filter(ssid=ssid)

    if wifi_networks.count() > 1:
        return Response({'error': 'Multiple WiFi networks found with the same SSID.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        wifi_network = wifi_networks.first()
        qr_data = f"WIFI:T:WPA;S:{wifi_network.ssid};P:{wifi_network.password};;"
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(qr_data)
        qr.make(fit=True)
        img = qr.make_image(fill='black', back_color='white')

        buffer = BytesIO()
        img.save(buffer, format="PNG")
        buffer.seek(0)

        return HttpResponse(buffer, content_type="image/png")
    except WiFiNetwork.DoesNotExist:
        return Response({'error': 'WiFi network not found.'}, status=status.HTTP_404_NOT_FOUND)

def timer_check_status():
    global wifix
    if(wifix.iface.status() == const.IFACE_CONNECTED):
        return 1
    else:
        # Scanning wifi again if it find the older wifi
        wifix.iface.connect(tmp_profile)
        # Attendre la connexion
        import time
        time.sleep(10)
        return 0
