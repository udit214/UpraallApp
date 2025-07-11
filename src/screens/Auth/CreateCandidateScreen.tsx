import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  Alert,
  TouchableOpacity,
  RefreshControl,
  Modal,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  RadioButton,
  useTheme,
  Card,
  Title,
  Paragraph,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'react-native';
import { BASE_URL } from '../utils/config';

const CandidateManagementScreen = ({ navigation, route }) => {
  const theme = useTheme();
  const project = route.params?.project;

  const [form, setForm] = useState({ username: '', email: '', phone: '', gender: 'male' });
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [requestedCandidates, setRequestedCandidates] = useState([]);
  const [requested_profiles , setrequested_profiles] =useState([])
  const [available_profiles , setavailable_profiles] = useState([])
  const [refreshing, setRefreshing] = useState(false);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [requestedDisplayData, setRequestedDisplayData] = useState([]);
  const [assignedRole, setAssignedRole] = useState('');
  const DEFAULT_PROFILE_PIC = `${BASE_URL}/media/defaults/deafaultpic1.jpg`;


  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async () => {
    const { username, email, phone, gender } = form;
    if (!username || !email || !phone) {
      Alert.alert('Validation Error', 'Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      const res = await fetch(`${BASE_URL}/api/auth/candidates/create/`, {
        method: 'POST',
        headers: { Authorization: `Token ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        Alert.alert('Success', 'Candidate created and notified via email.');
        setForm({ username: '', email: '', phone: '', gender: 'male' });
        fetchCandidates();
      } else {
        Alert.alert('Error', data?.detail || 'Failed to create candidate.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCandidates = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const res = await fetch( `${BASE_URL}/api/auth/organization/candidates/`, {
        method: 'POST',
        headers: { Authorization: `Token ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: project.id }),
      });
      const data = await res.json();
      if (res.ok) {
        console.log(data)
        setCandidates(data.available_candidates);
        setRequestedCandidates(data.requested_candidates);
        setrequested_profiles(data.requested_profiles);
        setavailable_profiles(data.available_profiles);
        const merged = data.requested_candidates.map((candidateProject) => {
        const profile = data.requested_profiles.find(p => p.id === candidateProject.profile.id);

        
        return {
          ...candidateProject,
          profile: profile || {}, // fallback
        };
      });

      setRequestedDisplayData(merged);
      console.log('this is the profile pics',requested_profiles)
      } else {
        Alert.alert('Error', 'Failed to fetch candidates');
      }
    } catch (err) {
      Alert.alert('Network Error', 'Something went wrong');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCandidates();
  };

  const openAssignModal = (candidate) => {
    setSelectedCandidate(candidate);
    setAssignedRole('');
    setAssignModalVisible(true);
  };

  const assignCandidate = async () => {
    if (!assignedRole.trim()) {
      Alert.alert('Validation Error', 'Role cannot be empty');
      return;
    }
    try {
      const token = await AsyncStorage.getItem('authToken');
      const res = await fetch(`${BASE_URL}/api/auth/candidates/assign/`, {
        method: 'POST',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          candidate_id: selectedCandidate.id,
          project_id: project.id,
          role: assignedRole,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        Alert.alert('Success', 'Candidate assigned to project.');
        setAssignModalVisible(false);
        setAssignedRole('');
        fetchCandidates();
      } else {
        Alert.alert('Error', data?.detail || 'Assignment failed.');
      }
    } catch (err) {
      Alert.alert('Network Error', 'Something went wrong');
    }
  };

const renderCandidate = ({ item }) => {
  console.log(item, 'hello i am your item');

  const profilePic = item.profile_picture
    ? item.profile_picture.startsWith('http')
      ? item.profile_picture
      : `${BASE_URL}${item.profile_picture}`
    : DEFAULT_PROFILE_PIC;

  return (
    <Card style={styles.card}>
      <TouchableOpacity onPress={() => navigation.navigate('CandidateProfile', { candidateId:item.id })}>
        <Card.Content style={styles.cardContent}>
          <Image
            source={{ uri: profilePic }}
            style={styles.profileImage}
          />
          <View style={{ marginLeft: 12 }}>
            <Title>{item.username}</Title>
            <Paragraph>{item.bio}</Paragraph>
          </View>
        </Card.Content>
      </TouchableOpacity>
      <Card.Actions>
        <Button onPress={() => openAssignModal(item)}>Add</Button>
      </Card.Actions>
    </Card>
  );
};



const renderRequestedCandidate = ({ item }) => {

  const profile = item.profile || {};
  const profilePic = profile.profile_picture
    ? profile.profile_picture.startsWith('http')
      ? profile.profile_picture
      : `${BASE_URL}${profile.profile_picture}`
    : DEFAULT_PROFILE_PIC;

  return (
    <Card style={styles.card}>
      <TouchableOpacity onPress={() => navigation.navigate('CandidateProfile', { candidateId: item.profile.id })}>
        <Card.Content style={styles.cardContent}>
          <Image
            source={{ uri: profilePic }}
            style={styles.profileImage}
          />
          <View style={{ marginLeft: 12 }}>
            <Title>{profile.username}</Title>
            <Paragraph>{profile.email}</Paragraph>
            <Paragraph>Status: {item.joining_status}</Paragraph>
            <Paragraph>Post: {item.role}</Paragraph>
          </View>
        </Card.Content>
      </TouchableOpacity>
    </Card>
  );
};


  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text variant="titleLarge" style={styles.title}>Manage Candidates</Text>

      <Text style={styles.sectionTitle}>Create New Candidate</Text>
      <TextInput label="Username" value={form.username} onChangeText={(text) => handleChange('username', text)} style={styles.input} />
      <TextInput label="Email" value={form.email} keyboardType="email-address" onChangeText={(text) => handleChange('email', text)} style={styles.input} />
      <TextInput label="Phone" value={form.phone} keyboardType="phone-pad" onChangeText={(text) => handleChange('phone', text)} style={styles.input} />
      <Text style={styles.label}>Gender</Text>
      <RadioButton.Group onValueChange={(value) => handleChange('gender', value)} value={form.gender}>
        <View style={styles.radioRow}>
          <RadioButton value="male" /><Text style={styles.radioLabel}>Male</Text>
          <RadioButton value="female" /><Text style={styles.radioLabel}>Female</Text>
        </View>
      </RadioButton.Group>
      <Button mode="contained" onPress={handleSubmit} loading={loading} disabled={loading} style={styles.button}>
        Create Candidate
      </Button>

      <Text style={styles.sectionTitle}>Available Candidates</Text>
      <FlatList
        data={available_profiles}
        renderItem={renderCandidate}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={false}
      />

      <Text style={styles.sectionTitle}>Requested Candidates</Text>
      <FlatList
  data={requestedDisplayData}
  renderItem={renderRequestedCandidate}
  keyExtractor={(item) => item.id.toString()}
  scrollEnabled={false}
/>

      <Modal visible={assignModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Assign Role</Text>
            <TextInput
              label="Role"
              value={assignedRole}
              onChangeText={setAssignedRole}
              style={styles.input}
            />
            <View style={styles.modalButtonRow}>
              <Button mode="contained" onPress={assignCandidate} style={styles.modalButton}>
                Confirm
              </Button>
              <Button mode="outlined" onPress={() => setAssignModalVisible(false)} style={styles.modalButton}>
                Cancel
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
    padding: 16,
    flex: 1,
  },
  title: {
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
  },
  sectionTitle: {
    color: '#BB86FC',
    fontSize: 18,
    marginTop: 24,
    marginBottom: 12,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#1f1f1f',
    marginBottom: 12,
  },
  button: {
    marginTop: 16,
    backgroundColor: '#BB86FC',
  },
  label: {
    color: '#ccc',
    marginTop: 10,
    marginBottom: 5,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  radioLabel: {
    color: '#fff',
    marginRight: 20,
  },
  card: {
    marginBottom: 12,
    backgroundColor: '#1f1f1f',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
    fontWeight: '600',
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 6,
    backgroundColor: '#BB86FC',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  modalContainer: {
    backgroundColor: '#1f1f1f',
    padding: 20,
    width: '85%',
    borderRadius: 12,
    elevation: 5,
  },
  avatarContainer: {
  marginRight: 12,
},
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#333',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ccc',
  },

});

export default CandidateManagementScreen;
