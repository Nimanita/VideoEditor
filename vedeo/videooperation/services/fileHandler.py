from django.core.files.storage import FileSystemStorage
from django.conf import settings
import json 

import os

class fileHandler:
    
    @classmethod
    def createFolder(cls,session_key):
        folder_path = os.path.join(settings.MEDIA_ROOT, session_key)
        if not os.path.exists(folder_path):
            os.makedirs(folder_path)
        return folder_path
    
    @classmethod
    def storeFile(cls,session_key, uploaded_file):
        print("inside storefile")
        folder_path = cls.createFolder(session_key)
        fs = FileSystemStorage(location=folder_path)
        filename = fs.save(uploaded_file.name, uploaded_file)
        print("outside storefile" , type(filename))
        return filename
    
    @classmethod
    def deletePreviousFiles(cls,session_key):
        folder_path = os.path.join(settings.MEDIA_ROOT, session_key)
        if os.path.exists(folder_path):
            for file_name in os.listdir(folder_path):
                file_path = os.path.join(folder_path, file_name)
                if os.path.isfile(file_path):
                    os.remove(file_path)
    
    @classmethod
    def deletePreviousSubtitles(cls,session_key):
        print("inside filehandler")
        folder_path = os.path.join(settings.MEDIA_ROOT, session_key)
        if os.path.exists(folder_path):
            for file_name in os.listdir(folder_path):
                file_path = os.path.join(folder_path, file_name)
                if os.path.isfile(file_path) and file_name.lower().endswith(('.srt', '.sub', '.vtt')):
                    os.remove(file_path)
        print("outside filehandler")
        
    