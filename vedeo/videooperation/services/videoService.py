
import json
import traceback
import logging
from bson.json_util import dumps
import secrets
import string
import random
from videooperation.models import video
from django.contrib.sessions.models import Session
from django.core.cache import cache
import ffmpeg
from django.http import JsonResponse
from django.conf import settings
from videooperation.services.fileHandler import fileHandler
import os
import subprocess
log = logging.getLogger(__name__)

class videoService:
    
    filehandler = fileHandler()
    @classmethod
    def addVideo(cls , videoFile, subtitleFile=None):
        try:
            newRecord = video(videoFile=videoFile, subtitleFile=videoFile)
            newRecord.save()
            return newRecord
        except Exception as e:
            exceptionTrace = traceback.format_exc()
            print(exceptionTrace)
    
    @classmethod
    def addVideoToSessionCache(cls , request):
    # Get the session key from the request
        cls.filehandler.deletePreviousFiles(request.session.session_key)
        upload = request.FILES['File']
        file = cls.filehandler.storeFile(request.session.session_key, upload)
        print(file , "typeof fiel" , type(file))
        cachedSessionData = Session.objects.get(session_key = request.session.session_key).get_decoded()
     
        if cachedSessionData:
            data = {
                "videoFile" : file
            }
            request.session["videos"] = []
            request.session["videos"].append(data)
      
        print("ABCD" , cachedSessionData)
    

    
    @classmethod
    def getVideoFromSessionCache(cls , request):
    # Get the session key from the request
   
        cachedSessionData = Session.objects.get(session_key = request.session.session_key).get_decoded()
     
        if cachedSessionData:
   
            if "videos" in cachedSessionData:
                return JsonResponse({'video_url': cachedSessionData["videos"]})
            
        print("ABCD" , cachedSessionData)
    
    @classmethod
    def addSubtileToVideo(cls , request):
    # Get the session key from the request
        try:
            cls.filehandler.deletePreviousSubtitles(request.session.session_key)
            upload = request.FILES['File']
            print(upload , ".srtfile")
            subtitleFile = cls.filehandler.storeFile(request.session.session_key, upload)
            
            cachedSessionData = Session.objects.get(session_key = request.session.session_key).get_decoded()
            
         
            videoFileName = cachedSessionData["videos"][0]["videoFile"]
            
            folderPath = os.path.join(settings.MEDIA_ROOT, request.session.session_key)
   
            videoFile = folderPath + "/" + videoFileName
            fileName, fileExtension = os.path.splitext(videoFileName)
            outputVideo = folderPath + "/"+ fileName + "_with_subtitles" + fileExtension
            subtitleFilePath = folderPath + "/" + subtitleFile
               #ffmpeg.input(videoFile).output(outputVideo, vf='subtitles=' + subtitleFilePath).run()
            ffmpeg_cmd = [
                'ffmpeg', '-i', videoFile, '-vf', f'subtitles={subtitleFilePath}', outputVideo
            ]

            # Run the FFmpeg command using subprocess
            completed_process = subprocess.run(
                ffmpeg_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True
            )

            # Print the stdout and stderr if the FFmpeg command fails
            if completed_process.returncode != 0:
                print("FFmpeg command failed. Error output:")
                print(completed_process.stderr)
                print(completed_process.stdout)
                return JsonResponse({'error': 'Failed to add subtitles to video'})
            
            os.remove(videoFile)
            outputVideoFileName = fileName + "_with_subtitles" + fileExtension
            data = {
                    "subtitleFile" : subtitleFile,
                    "videoFile" : outputVideoFileName
                }
            request.session["videos"] = []
            request.session["videos"].append(data)
            
            cachedSessionData = Session.objects.get(session_key = request.session.session_key).get_decoded()
            print("ABCDEFGHIPEPKD" , cachedSessionData , outputVideoFileName)
            return JsonResponse({'fileUrl': outputVideoFileName})
        
        except Exception as e:
            exceptionTrace = traceback.format_exc()
            message = f"Failure while adding subtitle to video" \
                      f"exceptionTrace: {exceptionTrace}" \
                      f" Exception: {str(e)}"
            print(message)
            
       
 