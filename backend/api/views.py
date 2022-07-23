from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from .serializers import NoteSerializer,ProfileSerializer
from .models import Note, Profile

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


@api_view(['POST','GET'])
def GetProfile(request,pk):
    profile = Profile.objects.get(id=pk)
    serializer = ProfileSerializer(profile,many=False)
    return Response(serializer.data)

@csrf_exempt 
@api_view(['PUT','POST','GET'])
def EditProfile(request,pk):
    profile = Profile.objects.get(id=pk)
    print(request.data.get("photo"))
    if (request.data.get("photo")):
        profile.profilePhoto = request.data.get("photo")
    else:
        profile.profilePhoto = profile.photo.url

    profile.bio = request.data.get("bio")
    profile.save()
    print(profile.profilePhoto)
    print(profile.bio)
    return Response("Updated")


