from django.urls import path
from . import views

urlpatterns = [
    path('documents-p_and_p/', views.PAndPDocumentListCreateView.as_view(), name='pandp-document-list-create'),
    path('documents-CosRecords/', views.CosRecordsListCreateView.as_view(), name='cos-document-list-create'),
    path('document-NCR/' , views.NCRListCreateView.as_view() , name='document_NCR'),
    path('document-NCR/<int:pk>/', views.NCRDetailView.as_view(), name='document_NCR_detail'),  
]
