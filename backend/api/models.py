from operator import mod
from tkinter import CASCADE
from django.db import models
from django.contrib.auth.models import User
# Create your models here.


class Note(models.Model):
    user  = models.ForeignKey(User,on_delete=models.CASCADE,blank=False,null=False)
    title = models.TextField(max_length=200,null=False,blank=False)
    status = models.TextField(max_length=1,null=False,blank=False,default="0")
    edit_date     = models.DateTimeField(
        auto_now_add=True, blank=True, null=True)
    create_date     = models.DateTimeField(auto_now=True,blank=True, null=True)


    def __str__(self):
        return self.title
