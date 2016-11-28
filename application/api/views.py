from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from pgoapi import pgoapi
from pgoapi import utilities as util
import pprint
import json

@csrf_exempt
def main(request):
    api = pgoapi.PGoApi()

    mail = request.POST["mail"]
    passwd = request.POST["pass"]

    api.set_position(35.6602577, 139.6899648, 0)
    if not api.login("google", mail, passwd, app_simulation = True):
        return
    response_dict = [api.get_inventory(),api.get_player()]

    return HttpResponse(json.dumps(response_dict), content_type="application/json")
