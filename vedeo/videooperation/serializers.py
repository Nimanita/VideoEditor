from rest_framework import serializers
from .models import video

class videoSerializer(serializers.ModelSerializer):
    class Meta:
        model = video
        fields = '__all__'