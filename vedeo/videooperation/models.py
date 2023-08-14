from django.db import models

class video(models.Model):
    videoFile = models.FileField(upload_to='media/videos', max_length=256)
    subtitleFile = models.FileField(upload_to='media/subtitles', max_length=256, blank=True)
    


   
    def __str__(self):
        return f"Video: {self.videoFile.name}, Subtitle: {self.subtitleFile.name}"