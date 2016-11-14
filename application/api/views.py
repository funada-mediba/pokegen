from django.shortcuts import render
from django.http import HttpResponse
from pgoapi import pgoapi
from pgoapi import utilities as util
import pprint
import json

def main(request):

    api = pgoapi.PGoApi()
    position = util.get_pos_by_name("shibuya")

    api.set_position(*position)

    if not api.login("google", "kaihatu.pgo@gmail.com", "pokemongo_kaihatu", app_simulation = True):
        return

    response_dict = api.get_inventory()
    # print('Response dictionary (get_player): \n\r{}'.format(pprint.PrettyPrinter(indent=4).pformat(response_dict)))

    return HttpResponse(json.dumps(response_dict))
