from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.models import User

from .serializers import NoteSerializer
from .models import Note

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        
        token['username'] = user.username
        token['email'] = user.email
        token['is_authenticated'] = user.is_authenticated
        token['is_superuser'] = user.is_superuser

        
        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer



@api_view(['GET','POST'])
def YourNotes(request):
    notes = Note.objects.all().filter(user_id=request.data.get('user_id'))
    serializer = NoteSerializer(notes,many=True)
    return Response(serializer.data)



@api_view(['GET','POST'])
def AddNote(request):
    note = Note.objects.create(
        user = User.objects.get(id=request.data.get('user_id')),
        title = request.data.get('title'),
        body = request.data.get('body'),
    )
    note.save()
    serializer = NoteSerializer(note,many=False)
    return Response(serializer.data)