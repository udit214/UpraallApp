from django.shortcuts import render
from rest_framework import generics, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from .models import PAndPDocument , CosRecords,NCR
from .serializers import PAndPDocumentSerializer , CosRecordSerializer , NCRSerializer

from rest_framework.response import Response
from rest_framework import status

class PAndPDocumentListCreateView(generics.ListCreateAPIView):
    queryset = PAndPDocument.objects.all()
    serializer_class = PAndPDocumentSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("Validation errors:", serializer.errors) 
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        serializer.save(uploaded_by=self.request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
class CosRecordsListCreateView(generics.ListCreateAPIView):
    queryset = CosRecords.objects.all()
    serializer_class = CosRecordSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("Validation errors:", serializer.errors) 
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        serializer.save(uploaded_by=self.request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    


class NCRListCreateView(generics.ListCreateAPIView):
    serializer_class = NCRSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        return NCR.objects.filter(created_by=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class NCRDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = NCR.objects.all()
    serializer_class = NCRSerializer
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        kwargs['partial'] = True  # Allow partial updates
        return self.partial_update(request, *args, **kwargs)