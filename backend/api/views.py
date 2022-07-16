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
    notes = Note.objects.all().filter(user_id=request.data.get('user_id')).order_by("-edit_date")
    serializer = NoteSerializer(notes,many=True)
    return Response(serializer.data)

@api_view(['GET','POST'])
def YourNotesLastFive(request):
    notes = Note.objects.all().filter(star=1).order_by("-edit_date")
    serializer = NoteSerializer(notes,many=True)
    return Response(serializer.data)


@api_view(['GET','POST'])
def AddNote(request):
    note = Note.objects.create(
        user = User.objects.get(id=request.data.get('user_id')),
        title = request.data.get('title'),
    )
    note.save()
    serializer = NoteSerializer(note,many=False)
    return Response(serializer.data)



@api_view(['GET','POST'])
def NoteStatus(request):
    note = Note.objects.get(id=request.data.get("note_id"))
    note.status=request.data.get("note_status");
    note.save()
    serializer = NoteSerializer(note,many=False)
    return Response(serializer.data)

@api_view(['GET','POST'])
def NoteStar(request):
    note = Note.objects.get(id=request.data.get("note_id"))
    note.star=request.data.get("note_star");
    note.save()
    serializer = NoteSerializer(note,many=False)
    return Response(serializer.data)


@api_view(['POST'])
def RemoveNote(request,pk):
    note = Note.objects.get(id=pk)
    note.delete()
    return Response("Deleted")
