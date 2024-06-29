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


@api_view(['POST'])
def toggle_wifi(request):
    action = request.data.get('action')  # 'on' ou 'off'
    print(f"action = {action}")
    wifi = pywifi.PyWiFi()
    iface = wifi.interfaces()[0]  # Prend la première interface WiFi trouvée

    if action == 'on':
        iface.scan()
        iface.connect(iface.scan_results()[0])
        return Response({'message': 'WiFi activated.'}, status=status.HTTP_200_OK)
    elif action == 'off':
        iface.disconnect()
        return Response({'message': 'WiFi deactivated.'}, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Invalid action.'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def wifi_list(request):
    wifi = pywifi.PyWiFi()
    iface = wifi.interfaces()[0]  # Prend la première interface WiFi trouvée

    iface.scan()
    scan_results = iface.scan_results()

    wifi_list_json = []
    for network in scan_results:
        wifi_list_json.append({
            "SSID": network.ssid,
            "Signal": network.signal
        })
    return JsonResponse(wifi_list_json, safe=False)
my_debug = []
@api_view(['POST'])
def connect_to_wifi(request):
    SSID = request.data.get('SSID')
    password = request.data.get('password')
    global my_debug
    my_debug += [SSID]
    my_debug += [password]
    if not SSID or not password:
        return Response({'error': 'SSID and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

    wifi = pywifi.PyWiFi()
    iface = wifi.interfaces()[0]

    # Déconnecter du réseau actuel
    iface.disconnect()
    iface.status() == const.IFACE_DISCONNECTED

    # Configurer le profil de connexion
    profile = pywifi.Profile()
    profile.ssid = SSID
    profile.auth = const.AUTH_ALG_OPEN
    profile.akm.append(const.AKM_TYPE_WPA2PSK)
    profile.cipher = const.CIPHER_TYPE_CCMP
    profile.key = password

    iface.remove_all_network_profiles()
    tmp_profile = iface.add_network_profile(profile)

    iface.connect(tmp_profile)
    # Attendre la connexion
    import time
    time.sleep(10)

    if iface.status() == const.IFACE_CONNECTED:
        # Enregistrer les informations WiFi dans la base de données
        WiFiNetwork.objects.create(ssid=SSID, password=password)
        return Response({'success': 'Connected to WiFi.'}, status=status.HTTP_200_OK)
    else:
        print("#"*20)
        print("Debug:",my_debug)
        print("#"*20)
        return Response({'error': 'Failed to connect to WiFi.'}, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET'])
def generate_qr_code(request, ssid):
    try:
        wifi_network = WiFiNetwork.objects.get(ssid=ssid)
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
