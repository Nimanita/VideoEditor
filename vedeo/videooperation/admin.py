from django.contrib import admin
from videooperation.models import video
from django.contrib.sessions.models import Session
# Register your models here.
#admin.site.register(videoFile)
#admin.site.register(Session)
from django.contrib.sessions.models import Session
import pprint

# If you remove this model admin below for sessions then you will see encrypted data only

class SessionAdmin(admin.ModelAdmin):
    def _session_data(self, obj):
        return obj.get_decoded()
    list_display = ['session_key', '_session_data', 'expire_date']

#admin.site.register(Session) 
# class SessionAdmin(admin.ModelAdmin):
#     def _session_data(self, obj):
#         return obj.get_decoded()
#     list_display = ['session_key', '_session_data', 'expire_date']
# admin.site.register(Session, SessionAdmin)
admin.site.register(Session, SessionAdmin) 
admin.site.register(video)