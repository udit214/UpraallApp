from rest_framework import serializers
from .models import PAndPDocument,CosRecords,NCR

class PAndPDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = PAndPDocument
        fields = '__all__'
        read_only_fields = ['uploaded_by', 'uploaded_at'] 

class CosRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = CosRecords
        fields = '__all__'
        read_only_fields = ['uploaded_by', 'uploaded_at'] 

class NCRSerializer(serializers.ModelSerializer):
    created_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = NCR
        fields = '__all__'
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']
