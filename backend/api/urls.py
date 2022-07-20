from django.urls import path,include
from . import views
from .views import AddNote, MyTokenObtainPairView
from django.contrib.auth import views as authview
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('notes/',views.YourNotes,name='your-notes'),
    path('notes-five/',views.YourNotesLastFive,name='your-notes-five'),
    path('add-note/',views.AddNote,name='add-note'),
    path('note-status/',views.NoteStatus,name='note-status'),
    path('note-star/',views.NoteStar,name='note-star'),
    path('note/<int:pk>/remove/',views.RemoveNote,name='note-remove'),
    path('profile/<int:pk>/',views.GetProfile,name='profile'),
    path('profile/<int:pk>/edit/',views.EditProfile,name='edit-profile'),



]+static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)