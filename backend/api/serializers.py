from dataclasses import field
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from django.contrib.auth.models import User
from .models import Note




class NoteSerializer(ModelSerializer):

    class Meta:
        model       = Note
        fields      = "__all__"