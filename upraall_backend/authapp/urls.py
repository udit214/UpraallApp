from django.urls import path
from . import views

urlpatterns = [
    path('organization_signup/', views.organization_signup, name='organization_signup'),
    path('organization_login/', views.organization_login, name='organization_login'),
    path('create_project/', views.create_project),
    path('projects/dashboard/', views.project_dashboard, name='project_dashboard'),
    path('projects/create/', views.create_project, name='create_project'),
    path('candidates/create/', views.CreateCandidateView.as_view(), name='create-candidate'),
    path('organization/candidates/', views.OrganizationCandidatesView.as_view(), name='organization-candidates'),
    path('candidates/assign/', views.AssignCandidateToProjectView.as_view()),
]
