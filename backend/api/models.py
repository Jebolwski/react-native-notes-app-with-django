from distutils.command.upload import upload
from email.policy import default
from operator import mod
from tkinter import CASCADE
from django.db import models
from django.contrib.auth.models import User
# Create your models here.


class Note(models.Model):
    user  = models.ForeignKey(User,on_delete=models.CASCADE,blank=False,null=False)
    title = models.TextField(max_length=200,null=False,blank=False)
    status = models.TextField(max_length=1,null=False,blank=False,default="0")
    star = models.TextField(max_length=1,null=False,blank=False,default="0")
    edit_date     = models.DateTimeField(
        auto_now_add=True, blank=True, null=True)
    create_date     = models.DateTimeField(auto_now=True,blank=True, null=True)


    def __str__(self):
        return self.title


class Profile(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE,blank=False,null=False)
    bio = models.TextField(max_length=250,null=False,blank=False,default="No information was given.")
    profilePhoto = models.ImageField(upload_to="profilePhotos",null=False,blank=False,default="default.jpg")
    crate_date = models.DateTimeField(auto_now=True,blank=True, null=True)

    def __str__(self):
        return self.user.username
