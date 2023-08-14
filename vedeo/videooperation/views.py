from rest_framework.decorators import api_view , permission_classes
from rest_framework.parsers import JSONParser
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from videooperation.services.videoService import videoService
from django.shortcuts import  render
from django.core.files.storage import FileSystemStorage
from django.conf import settings
import random
from rest_framework.parsers import FormParser, MultiPartParser
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt
import json 
from rest_framework.parsers import JSONParser
from django.http import JsonResponse
import os
from videooperation.services.fileHandler import fileHandler
from django.http import FileResponse, Http404

@api_view(['POST' , 'GET'])
def uploadVideo(request):
    print("REQUEST" ,request.FILES)
    if request.method == 'POST' and request.FILES['File']:

        if 'sessionId' not in request.session:
            print("No session id")
            return HttpResponse("<h1>INVALID SESSION</h1>")
        print("inside upload video view")
        videoService.addVideoToSessionCache(request)
        return HttpResponse("<h1>welcome to TechVidvan Employee Portal<br> The Session is Set {{request.session['test']}}</h1>")

        
@api_view(['POST' , 'GET'])
def uploadSubtitle(request):
    print("REQUEST" ,request.FILES)
    if request.method == 'POST' and request.FILES['File']:
        

        z = request.session.get('File')
        if 'sessionId' not in request.session:
            print("No session id")
            return HttpResponse("<h1>INVALID SESSION</h1>")

        return videoService.addSubtileToVideo(request)
               

@api_view(['GET'])
def testsessions(request):
    print("inside views")
    if not request.session.session_key:
        request.session.create()
        if request.session.session_key:
            request.session["sessionId"] = request.session.session_key
        return JsonResponse({'status': 'ok1'})
    else:
        print("session already exists")
        fileHandler.deletePreviousFiles(request.session.session_key)
        return JsonResponse({'status': 'ok2'})

@api_view(['GET'])
def getVideo(request , filename):
     
     #request = JSONParser().parse(request)
     print("inside filename" , request , filename , type(filename))
     fileUrl = f"{settings.MEDIA_URL}{request.session.session_key}/{filename}"
     print("FILEURL" , {fileUrl})
     return JsonResponse({'fileUrl': fileUrl})

@api_view(['GET'])
def downloadVideo(request , filename):
     
    print("download" , filename , request)
    if filename:
        filePath = f"/home/mamata/vedeo{settings.MEDIA_URL}{request.session.session_key}/{filename}"
        print("filepath" , filePath)
        if os.path.exists(filePath) and os.path.isfile(filePath):
            response = FileResponse(open(filePath, "rb"), as_attachment=True, filename=filename)
            response['Content-Disposition'] = f'attachment; filename="{filename}"'
      
            return response
       
        
        
    else:
        raise Http404("Filename parameter missing.")

