import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet,TouchableOpacity,
} from 'react-native';
import { Card, Button, Avatar, useTheme, Divider, ProgressBar } from 'react-native-paper';
import axios from 'axios';
import { BASE_URL } from '../utils/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProjectDashboard = ({ navigation, route }) => {
  
  const theme = useTheme();
  const { project } = route.params;

  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const handleProfilePress = (member) => {
  navigation.navigate('CandidateProfileScreen', { candidate: member });
};


  useEffect(() => {
    fetchAcceptedCandidates();
  }, []);

const fetchAcceptedCandidates = async () => {
  try {
    // Make sure this matches the key you use during login
    const token = await AsyncStorage.getItem('authToken');

    if (!token) {
      console.error('No auth token found.');
      return;
    }

    const response = await axios.get(
      `${BASE_URL}/api/auth/projects/${project.id}/accepted-candidates/`,
      {
        headers: {
          Authorization: `Token ${token}`, // ✅ DRF TokenAuth format
        },
      }
    );
    console.log('API response:', response.data , 'i am response.data');
    setTeam(response.data);
  } catch (error) {
    console.error(
      'Error fetching candidates:',
      error.response?.data || error.message
    );
  } finally {
    setLoading(false);
  }
};
  return (
    <ScrollView style={styles.container}>
      <Card style={styles.headerCard}>
        <Text style={styles.projectName}>{project.name}</Text>
        <Text style={styles.status}>Status: 🟢 {project.status}</Text>
        <ProgressBar
          progress={project.progress}
          color={theme.colors.primary}
          style={styles.progressBar}
        />
        <Text style={styles.progressText}>{Math.round(project.progress * 100)}% Complete</Text>
        <Text style={styles.timeline}>📅 {project.startDate} ➜ {project.endDate}</Text>
      </Card>

      <View style={styles.metricsContainer}>
        <Card style={styles.metricCard}><Text style={styles.metric}>Tasks: 120</Text></Card>
        <Card style={styles.metricCard}><Text style={styles.metric}>Completed: 88</Text></Card>
        <Card style={styles.metricCard}><Text style={styles.metric}>Team: {team.length}</Text></Card>
        <Card style={styles.metricCard}><Text style={styles.metric}>Pending NCRs: 3</Text></Card>
      </View>

      <Divider style={styles.divider} />

      <Text style={styles.sectionTitle}>Team Members</Text>
      <View style={styles.teamList}>
        {loading ? (
          <Text style={{ color: '#aaa' }}>Loading...</Text>
        ) : team.length === 0 ? (
          <Text style={{ color: '#888' }}>No accepted team members yet.</Text>
        ) : (
          team.map((member) => (
  <TouchableOpacity
    key={member.id}
    onPress={() => navigation.navigate('CandiateProfileHome', { candidateId: member.id })}
    activeOpacity={0.8}
    style={styles.profileCard}
  >
    <View style={styles.profileRow}>
      <Avatar.Image
        size={48}
        source={{ uri: member.profile?.profile_picture }}
        style={styles.avatarImage}
      />
      <View style={styles.profileDetails}>
        <Text style={styles.profileName}>
          {member.profile?.username || member.name || 'Unnamed'}
        </Text>
        <Text style={styles.profileRole}>
          {member.role || 'No role assigned'}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
))


        )}
      </View>
    </ScrollView>
  );
};

export default ProjectDashboard;
const styles = StyleSheet.create({

  headerCard: {
    backgroundColor: '#1f1f1f',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  projectName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  status: {
    color: '#ccc',
    marginTop: 4,
  },
  progressBar: {
    marginTop: 12,
    height: 8,
    borderRadius: 8,
  },
  progressText: {
    marginTop: 6,
    color: '#bbb',
  },
  timeline: {
    marginTop: 4,
    color: '#999',
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metricCard: {
    backgroundColor: '#1f1f1f',
    padding: 16,
    borderRadius: 10,
    marginVertical: 6,
    width: '48%',
  },
  metric: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  divider: {
    marginVertical: 16,
    backgroundColor: '#333',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
    flexWrap: 'wrap',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  teamList: {
    gap: 10,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    backgroundColor: '#BB86FC',
    marginRight: 12,
  },
  memberName: {
    color: '#eee',
    fontSize: 15,
  },
  addMemberButton: {
    marginTop: 10,
    backgroundColor: '#BB86FC',
    borderRadius: 8,
    
  },
container: {
  flex: 1,
  backgroundColor: '#121212',
  position: 'relative',
},

scrollContent: {
  padding: 16,
  paddingBottom: 100, // keep this so content doesn’t hide behind the button
},

floatingButton: {
  position: 'absolute',
  bottom: 20,
  alignSelf: 'center',
  backgroundColor: '#BB86FC',
  paddingHorizontal: 24,
  paddingVertical: 6,
  borderRadius: 30,
  elevation: 4, // shadow for Android
  shadowColor: '#000', // shadow for iOS
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
},
profileCard: {
  backgroundColor: '#1f1f1f',
  marginBottom: 12,
  padding: 12,
  borderRadius: 10,
},

profileRow: {
  flexDirection: 'row',
  alignItems: 'center',
},

avatarImage: {
  backgroundColor: '#333',
},

profileDetails: {
  marginLeft: 12,
  flex: 1,
},

profileName: {
  color: '#fff',
  fontSize: 16,
  fontWeight: '600',
},

profileRole: {
  color: '#aaa',
  fontSize: 14,
  marginTop: 2,
},


});



