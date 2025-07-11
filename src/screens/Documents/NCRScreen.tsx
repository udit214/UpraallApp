import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Modal,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { Text, Button, Card, Title, Paragraph } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'react-native-image-picker';
import { Picker } from '@react-native-picker/picker';
import { BASE_URL } from '../utils/config';

const NCRScreen = ({ project }) => {
  const [ncrs, setNCRs] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null);
  const [token, setToken] = useState('');
  const [selectedNcr, setSelectedNcr] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState('');


  useEffect(() => {
    fetchNCRs();
  }, []);

  const fetchNCRs = async () => {
    const storedToken = await AsyncStorage.getItem('authToken');
    if (!storedToken) {
      Alert.alert('Error', 'Please login again.');
      return;
    }
    setToken(storedToken);
    try {
      const response = await fetch(`${BASE_URL}/api_doc/document-NCR/`, {
        headers: { Authorization: `Token ${storedToken}` },
      });
      const data = await response.json();
      setNCRs(data);
    } catch {
      Alert.alert('Error', 'Failed to load NCRs');
    }
  };

  const deleteNCR = async (id) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      await fetch(`${BASE_URL}/api_doc/document-NCR/${id}/`, {
        method: 'DELETE',
        headers: { Authorization: `Token ${token}` },
      });
      setNCRs((prev) => prev.filter((ncr) => ncr.id !== id));
    } catch {
      Alert.alert('Error', 'Could not delete NCR');
    }
  };

  const updateNCRStatus = async () => {
    if (!newStatus) return;
    try {
      const token = await AsyncStorage.getItem('authToken');
      await fetch(`http://192.168.1.5:8000/api_doc/document-NCR/${selectedNcr.id}/`, {
        method: 'PATCH',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      setStatusModalVisible(false);
      fetchNCRs();
    } catch {
      Alert.alert('Error', 'Could not update status');
    }
  };

  const handleImagePick = () => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo', quality: 0.7 }, (response) => {
      if (!response.didCancel && !response.errorCode && response.assets?.length) {
        setImage(response.assets[0]);
      }
    });
  };

  const handleSubmit = async () => {
    if (!title || !description || !location) {
      Alert.alert('Validation', 'All fields are required');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('location', location);
    formData.append('project', project.id);

    if (image) {
      formData.append('image', {
        uri: image.uri,
        name: image.fileName || 'ncr.jpg',
        type: image.type || 'image/jpeg',
      });
    }

    try {
      const response = await fetch('${BASE_URL}/api_doc/document-NCR/', {
        method: 'POST',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (response.ok) {
        Alert.alert('Success', 'NCR submitted');
        setTitle('');
        setDescription('');
        setLocation('');
        setImage(null);
        setModalVisible(false);
        fetchNCRs();
      } else {
        const error = await response.json();
        Alert.alert('Error', JSON.stringify(error));
      }
    } catch {
      Alert.alert('Error', 'Failed to submit NCR');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button mode="contained" onPress={() => setModalVisible(true)}>
          Raise NCR
        </Button>
      </View>

      <ScrollView>
        {ncrs.length === 0 ? (
          <Text style={styles.emptyText}>No NCRs found.</Text>
        ) : (
          ncrs.map((ncr) => (
            <Card key={ncr.id} style={[styles.card, { backgroundColor: '#1e1e1e' }]}>
              <Card.Content>
                <Title style={{ color: '#fff' }}>{ncr.title}</Title>
                <Paragraph style={{ color: '#bbb' }}>{ncr.description}</Paragraph>
                <Text style={{ color: '#ccc', marginTop: 6 }}>📍 Location: {ncr.location}</Text>
                <Text style={{ color: '#ccc' }}>📅 Issued: {new Date(ncr.created_at).toDateString()}</Text>
                <Text style={{ color: '#ccc' }}>👤 Uploaded by: {ncr.created_by_name || 'N/A'}</Text>
                <Text style={{ color: '#bbb', marginTop: 6 }}>🟠 Status: {ncr.status}</Text>

                {ncr.image && (
                  <Image
                    source={{ uri: ncr.image }}
                    style={{ width: '100%', height: 200, marginTop: 12, borderRadius: 6 }}
                    resizeMode="cover"
                  />
                )}

                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 }}>
                  <Button
                    onPress={() => {
                      setSelectedNcr(ncr);
                      setNewStatus(ncr.status);
                      setStatusModalVisible(true);
                    }}
                    textColor="#00b4d8"
                  >
                    Edit
                  </Button>
                  <Button onPress={() => deleteNCR(ncr.id)} textColor="#ff4d4d">
                    Delete
                  </Button>
                </View>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>

      {/* Modal for Raising NCR */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: '#1e1e1e' }]}>
            <TextInput
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
              placeholderTextColor="#aaa"
            />
            <TextInput
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
              style={[styles.input, { height: 80 }]}
              multiline
              placeholderTextColor="#aaa"
            />
            <TextInput
              placeholder="Location"
              value={location}
              onChangeText={setLocation}
              style={styles.input}
              placeholderTextColor="#aaa"
            />
            <Button mode="outlined" onPress={handleImagePick}>
              {image ? 'Change Image' : 'Pick Image'}
            </Button>
            {image && (
              <Image
                source={{ uri: image.uri }}
                style={{ width: '100%', height: 150, marginTop: 10, borderRadius: 6 }}
              />
            )}
            <View style={styles.modalButtons}>
              <Button mode="contained" onPress={handleSubmit}>
                Submit
              </Button>
              <Button onPress={() => setModalVisible(false)} style={{ marginLeft: 8 }}>
                Cancel
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal for Editing Status */}
      <Modal
        visible={statusModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setStatusModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: '#1f1f1f' }]}>
            <Text style={{ color: '#fff', fontSize: 18, marginBottom: 12 }}>Update NCR Status</Text>
            <View
  style={{
    backgroundColor: '#2c2c2c',
    borderRadius: 6,
    marginBottom: 16,
  }}
>
  <Picker
    selectedValue={newStatus}
    onValueChange={(itemValue) => setNewStatus(itemValue)}
    dropdownIconColor="#fff"
    style={{ color: '#fff' }}
  >
    <Picker.Item label="Open" value="open" />
    <Picker.Item label="In Progress" value="in_progress" />
    <Picker.Item label="Closed" value="closed" />
  </Picker>
  <TextInput
  value={resolutionNotes}
  onChangeText={setResolutionNotes}
  placeholder="Add resolution notes (optional)"
  placeholderTextColor="#999"
  multiline
  numberOfLines={3}
  style={{
    backgroundColor: '#2c2c2c',
    padding: 10,
    borderRadius: 6,
    color: '#fff',
    marginBottom: 16,
    textAlignVertical: 'top',
  }}
/>
</View>

            <View style={styles.modalButtons}>
              <Button onPress={updateNCRStatus} textColor="#00b4d8">
                Save
              </Button>
              <Button onPress={() => setStatusModalVisible(false)} textColor="#ccc">
                Cancel
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default NCRScreen;

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
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#aaa',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    borderRadius: 8,
    padding: 24,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#555',
    color: '#fff',
    marginBottom: 16,
    paddingVertical: 6,
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 20,
  },
});
