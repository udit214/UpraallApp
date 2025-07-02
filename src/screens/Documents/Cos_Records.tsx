import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Alert,
  Modal,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { pick, keepLocalCopy } from '@react-native-documents/picker';
import {
  Button,
  Card,
  Text,
  TextInput,
  IconButton,
  useTheme,
  Provider as PaperProvider,
  MD3DarkTheme,
} from 'react-native-paper';
import { Trash2, Edit, Upload } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';


const SERVER_URL = 'http://10.0.2.2:8000/api_doc/documents-CosRecords/';

const CosRecordsPage = ({ project }) => {
  const navigation = useNavigation();
  const [documents, setDocuments] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocFile, setNewDocFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    const response = await fetch(SERVER_URL, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }
    const data = await response.json();

    // Sort documents by uploaded_at descending (most recent first)
    const sortedDocs = data.sort((a, b) => new Date(b.uploaded_at) - new Date(a.uploaded_at));

    setDocuments(sortedDocs);
  } catch (error) {
    console.error('Failed to fetch documents:', error);
  } finally {
    setLoading(false);
  }
};

const handlePickDocument = async () => {
  try {
    const [file] = await pick({
      allowMultiSelection: false,
      mode: 'import',
    });

    if (!file || !file.uri) {
      Alert.alert('Error', 'No file URI received');
      return;
    }

    const fileName = file.name ?? 'UnnamedFile';
    const destPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

    // Copy content:// file to app's local storage
    await RNFS.copyFile(file.uri, destPath);

    console.log('📁 Copied file to:', destPath);

    setNewDocFile({
      uri: `file://${destPath}`,
      fileName,
      type: file.type ?? 'application/octet-stream',
    });
  } catch (err) {
    console.error('Document pick error:', err);
    Alert.alert('Error', 'Failed to pick or process file');
  }
};

  const handleUpload = async () => {
  if (!newDocFile || !newDocTitle) {
    Alert.alert('Missing Info', 'Please select a file and enter a title.');
    return;
  }

  if (!project?.id) {
    Alert.alert('Project Error', 'Project information is missing.');
    return;
  }

  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      Alert.alert('Auth Error', 'User token not found. Please login again.');
      return;
    }

    console.log('📁 Selected file object:', newDocFile);

    const uri = newDocFile?.uri;
    const name = newDocFile?.fileName || newDocFile?.name || 'upload.pdf';
    const type = newDocFile?.type || 'application/pdf';

    if (!uri) {
      Alert.alert('File Error', 'File URI is missing.');
      return;
    }

    const formData = new FormData();
    formData.append('title', newDocTitle);
    formData.append('project', project.id.toString());
    formData.append('file', {
      uri: uri.startsWith('file://') ? uri : `file://${uri}`,
      name,
      type,
    });

    const response = await fetch(SERVER_URL, {
      method: 'POST',
      headers: {
        Authorization: `Token ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Upload failed:', errText);
      Alert.alert('Upload Failed', `Server responded with error:\n${errText}`);
      return;
    }

    const newDoc = await response.json();
    setDocuments(prev => [newDoc, ...prev]);
    setModalVisible(false);
    setNewDocFile(null);
    setNewDocTitle('');
    Alert.alert('Success', 'Document uploaded successfully.');
  } catch (error) {
    console.error('Upload error:', error);
    Alert.alert('Error', 'An unexpected error occurred during upload.');
  }
};


  const handleDelete = (id) => {
    Alert.alert('Delete Document', 'Are you sure you want to delete this document?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => setDocuments(documents.filter(doc => doc.id !== id)),
      },
    ]);
  };

  const renderItem = ({ item }) => (
      <TouchableOpacity onPress={() => navigation.navigate('DocumentPreview', { document: item })}>
    <Card style={styles.card} mode="outlined">
      <Card.Title
        title={item.title}
        subtitle={`Uploaded: ${new Date(item.uploaded_at).toLocaleString()}`}
        left={props => <Upload {...props} color={theme.colors.primary} />}
      />
      <Card.Actions style={styles.cardActions}>
        <IconButton
          icon={() => <Edit size={20} color={theme.colors.primary} />}
          onPress={() => Alert.alert('Edit not implemented')}
          accessibilityLabel="Edit document"
        />
        <IconButton
          icon={() => <Trash2 size={20} color="red" />}
          onPress={() => handleDelete(item.id)}
          accessibilityLabel="Delete document"
        />
      </Card.Actions>
    </Card>
  </TouchableOpacity>
  );
  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#BB86FC" />
      </View>
      );
    }

  return (

      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.header}>
          <Text variant="headlineMedium">COS Records</Text>
          <Button icon="upload" mode="contained" onPress={() => setModalVisible(true)}>
            Upload
          </Button>
        </View>

        <FlatList
          data={documents}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={<Text style={styles.emptyText}>No documents uploaded yet.</Text>}
        />

        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: theme.colors.elevation.level2 }]}>
              <Text variant="titleLarge" style={{ marginBottom: 12 }}>
                Upload New Document
              </Text>
              <TextInput
                label="Document Title"
                value={newDocTitle}
                mode="outlined"
                onChangeText={setNewDocTitle}
                style={{ marginBottom: 12 }}
              />
              <Button mode="outlined" onPress={handlePickDocument} icon="file-upload">
                Pick File
              </Button>
              {newDocFile && (
                <Text style={{ marginTop: 8 }}>
                  Selected: {newDocFile.fileName ?? newDocFile.name}
                </Text>
              )}
              <View style={styles.modalButtons}>
                <Button mode="contained" onPress={handleUpload} style={{ flex: 1, marginRight: 8 }}>
                  Upload
                </Button>
                <Button mode="outlined" onPress={() => setModalVisible(false)} style={{ flex: 1 }}>
                  Cancel
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      </View>

  );
};

export default CosRecordsPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  card: {
    marginVertical: 6,
  },
  cardActions: {
    justifyContent: 'flex-end',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#aaa',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    borderRadius: 8,
    padding: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 20,
  },
});
