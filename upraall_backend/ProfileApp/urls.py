# ProfileApp/urls.py
from django.urls import path
from .views import OrganizationProfileView , CandidateProfileDetailView

urlpatterns = [
    path('organization/profile/', OrganizationProfileView.as_view(), name='organization-profile'),
    path('candidate-profile/<int:pk>/', CandidateProfileDetailView.as_view())
]
