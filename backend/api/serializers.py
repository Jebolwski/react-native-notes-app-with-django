from dataclasses import field
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from django.contrib.auth.models import User
from .models import Note, Profile




class NoteSerializer(ModelSerializer):

    class Meta:
        model       = Note
        fields      = "__all__"

class ProfileSerializer(ModelSerializer):

    class Meta:
        model       = Profile
        fields      = "__all__"