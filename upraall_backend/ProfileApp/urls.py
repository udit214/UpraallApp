# ProfileApp/urls.py
from django.urls import path
from .views import OrganizationProfileView

urlpatterns = [
    path('organization/profile/', OrganizationProfileView.as_view(), name='organization-profile'),
]
