# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import OrganizationProfile
from .serializers import OrganizationProfileSerializer

class OrganizationProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = request.user.org_profile
        serializer = OrganizationProfileSerializer(profile)
        return Response(serializer.data)

    def put(self, request):
        profile = request.user.org_profile
        serializer = OrganizationProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)