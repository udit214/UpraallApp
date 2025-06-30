from django.contrib import admin
from . models import  Organization ,User,Project
# Register your models here.

# admin.site.register(Candidate)
admin.site.register(Organization)
admin.site.register(User)
admin.site.register(Project)
