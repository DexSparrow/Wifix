from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse,HttpResponse
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
    scanned_wifi_list : list
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
        self.scanned_wifi_list = []
        self.wifi = None
        self.iface = None
        try:
            self.wifi = pywifi.PyWiFi()
            self.iface = self.wifi.interfaces()[0]  # Prend la première interface WiFi trouvée
            self.scan_wifi()
        except FileNotFoundError as f:
            print(f"{f}")
            exit(0)
        except PermissionError as f:
            print(f"{f}")
            print("Please run this command as root")
            exit(0)


    def toggle_wifi(self):
        pass

    def scan_wifi(self):
        self.scanned_wifi_list = []
        self.iface.scan()
        scan_results = self.iface.scan_results()
        for network in scan_results:
            if(network not in self.scanned_wifi_list):
                self.scanned_wifi_list.append(network)
    def wifi_list(self):
        wifi_list_json = []
        #const.AKM_TYPE_NONE, const.AKM_TYPE_WPA, const.AKM_TYPE_WPAPSK const.AKM_TYPE_WPA2PSK
        self.scan_wifi()
        counter = 0
        for network in self.scanned_wifi_list:
            wifi_list_json.append({
                "ID":counter,
                "BSSID":network.bssid,
                "SSID": network.ssid,
                "Signal": network.signal,
                "AKM":int("".join(str(x) for x in network.akm))
            })
            counter += 1
        return wifi_list_json

    def check_status(self):
        return self.iface.status()

    def is_connected(self):
        return self.iface.status() == const.IFACE_CONNECTED
    
    def simple_connect(self,profile,delay=10):
        self.iface.disconnect()
        self.iface.remove_all_network_profiles()
        self.iface.connect(self.iface.add_network_profile(profile))    
        import time
        time.sleep(delay)
        print("Iface status = ",self.iface.status())
        return self.iface.status() == const.IFACE_CONNECTED

    # def connect(self,SSID,password):
    def ping_wifi(self,id):
        state = 0
        temp_profile = None
        if(self.profile and (self.scanned_wifi_list[id].ssid == self.profile.ssid)):
            if(self.is_connected()):
                # Still connected
                return Response({'success': 'Connected to WiFi.','rr':'already connected'}, status=status.HTTP_200_OK)
            else:
                # Remove info bd
                # Tofix we need to recheck this cause if the wifi is not in list anymore it will be removed
                state = self.check_status()
                if(state == const.IFACE_DISCONNECTED):
                    wifi_info = self.scanned_wifi_list[id]
                    wifi_remove = WiFiNetwork.objects.filter(ssid=wifi_info["ssid"],bssid=wifi_info["bssid"])
                    wifi_remove.delete()
                else:
                    print("The wifi got problem error 500")
                    pass
                    # The wifi had a problem or something like that
                self.profile = None
                return Response({'error': 'Failed to connect to WiFi,login to connect'}, status=status.HTTP_400_BAD_REQUEST)
                # Reconnect

            # if state is 0
        check_bd = WiFiNetwork.objects.filter(bssid=self.scanned_wifi_list[id].bssid)
        if(check_bd):
            check_bd = check_bd[0]
            # connect with bd info
            profile = pywifi.Profile()
            profile.ssid = check_bd.ssid
            profile.bssid = check_bd.bssid
            profile.key = check_bd.password
            profile.akm = [int(x) for x in str(check_bd.akm)]
            profile.auth = check_bd.auth
            profile.cipher = check_bd.cipher
            state = self.simple_connect(profile)
            if(state):
                self.profile = profile
                return Response({'success': 'Connected to WiFi.'}, status=status.HTTP_200_OK)
            else:
                # Remove bd
                check_bd.delete()
                return Response({'error': 'Failed to connect to WiFi,login to connect'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error': 'Not connected,login to connect'}, status=status.HTTP_400_BAD_REQUEST)

    def connect(self,id,password):
        new_profile = pywifi.Profile()
        new_profile.ssid = self.scanned_wifi_list[id].ssid
        new_profile.bssid = self.scanned_wifi_list[id].bssid
        new_profile.auth = const.AUTH_ALG_OPEN
        new_profile.akm = self.scanned_wifi_list[id].akm
        new_profile.cipher = const.CIPHER_TYPE_CCMP
        new_profile.key = password
        state = self.simple_connect(new_profile)
        if(state):
            # connected to the wifi
            self.profile = new_profile
            akm = "".join(str(x) for x in new_profile.akm)
            WiFiNetwork.objects.create(ssid=new_profile.ssid, password=new_profile.key,bssid=new_profile.bssid,akm=akm,auth=new_profile.auth,cipher=new_profile.cipher)
            return Response({'success': 'Connected to WiFi.'}, status=status.HTTP_200_OK)
        return Response({'error': 'Failed to connect to wifi, try again'}, status=status.HTTP_200_OK)

    def generate_qr_code(self,id):
        id=int(id)
        wifi_networks = WiFiNetwork.objects.filter(bssid=self.scanned_wifi_list[id].bssid)

        if wifi_networks.count() > 1:
            return Response({'error': 'Multiple WiFi networks found with the same SSID.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            wifi_network = wifi_networks.first()
            qr_data = f"WIFI:T:{wifi_network.akm};S:{wifi_network.ssid};P:{wifi_network.password};;"
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
            img.save(buffer)
            buffer.seek(0)

            return HttpResponse(buffer, content_type="image/png")
        except WiFiNetwork.DoesNotExist:
            return Response({'error': 'WiFi network not found.'}, status=status.HTTP_404_NOT_FOUND)

wifix = Wifix()
wifix.scan_wifi()
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
def ping_wifi(request):
    id = request.data.get('ID')
    res = wifix.ping_wifi(id)
    return res

@api_view(['POST'])
def connect_to_wifi(request):
    global wifix
    id = request.data.get('ID')
    password = request.data.get('password')
    
    print(f"This is {id}  {password}")
    if ((id==None) or not password):
        return Response({'error': 'SSID and password are required.'}, status=status.HTTP_400_BAD_REQUEST)
    res = wifix.connect(id=id,password=password)
    if(res):
        return Response({'success': 'Connected to WiFi.','rr':'already connected'}, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Failed to connect to WiFi.'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
# def generate_qr_code(request, ssid):
def generate_qr_code(request,id):
    global wifix
    return wifix.generate_qr_code(id)

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
