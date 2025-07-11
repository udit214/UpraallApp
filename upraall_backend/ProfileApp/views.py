# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import OrganizationProfile , CandidateProfile
from authapp.models import Candidate
from .serializers import OrganizationProfileSerializer , CandidateProfileSerializer

class OrganizationProfileView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        profile = request.user.organization_profile.org_profile
        print(profile)
        serializer = OrganizationProfileSerializer(profile)
        return Response(serializer.data)

    def put(self, request):
        profile = request.user.organization_profile.org_profile
        serializer = OrganizationProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class CandidateProfileDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        candidate_profile = CandidateProfile.objects.get(id=int(pk))
        serializer = CandidateProfileSerializer(candidate_profile, context={'request': request})
        return Response(serializer.data)