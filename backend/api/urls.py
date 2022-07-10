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
    path('add-note/',views.AddNote,name='add-note'),



]+static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)