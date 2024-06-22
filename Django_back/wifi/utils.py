from rest_framework_jwt.settings import api_settings

def jwt_response_payload_handler(token, user=None, request=None):
    return {
        'token': token,
        'user': {
            'username': user.username,
        }
    }
