import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { Text, Button, Card, Title, Paragraph } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';

const OrganizationProjectList = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [chainageKm, setChainageKm] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [ongoingProjects, setOngoingProjects] = useState([]);
  const [appliedProjects, setAppliedProjects] = useState([]);
  const [completedProjects, setCompletedProjects] = useState([]);

  const navigation = useNavigation();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleCardPress = (project) => {
    scale.value = withTiming(0.97, { duration: 100 }, () => {
      scale.value = withTiming(1, { duration: 100 });
    });
    
    navigation.navigate('DrawerGroup2', {
  screen: 'project Dashboard',
  params: { project: project }
});
  };

  const loadTokenAndProjects = useCallback(async () => {
    const storedToken = await AsyncStorage.getItem('authToken');
    if (!storedToken) {
      Alert.alert('Authentication Error', 'Please log in again.');
      return;
    }
    setToken(storedToken);

    try {
      const response = await fetch('http://192.168.1.5:8000/api/auth/projects/dashboard/', {
        headers: {
          Authorization: `Token ${storedToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOngoingProjects(data.ongoing || []);
        setAppliedProjects(data.applied || []);
        setCompletedProjects(data.completed || []);
      } else {
        Alert.alert('Error', 'Failed to load projects');
      }
    } catch (err) {
      Alert.alert('Error', 'Network error while loading projects');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadTokenAndProjects();
  }, [loadTokenAndProjects]);

  const onRefresh = () => {
    setRefreshing(true);
    loadTokenAndProjects();
  };

  const submitProject = async () => {
    if (!projectName.trim() || !projectDescription.trim() || !chainageKm.trim()) {
      Alert.alert('Validation Error', 'All fields are required');
      return;
    }

    const chainageFloat = parseFloat(chainageKm);
    if (isNaN(chainageFloat) || chainageFloat <= 0) {
      Alert.alert('Validation Error', 'Chainage must be a positive number');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://10.0.2.2:8000/api/auth/projects/create/', {
        method: 'POST',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: projectName,
          description: projectDescription,
          chainage_km: chainageFloat,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Project application submitted!');
        setModalVisible(false);
        setProjectName('');
        setProjectDescription('');
        setChainageKm('');

        setAppliedProjects((prev) => [
          ...prev,
          {
            id: result.id ?? Date.now(),
            name: result.name ?? projectName,
            description: result.description ?? projectDescription,
            chainage_km: result.chainage_km ?? chainageFloat,
            is_verified: result.is_verified ?? false,
            created_at: result.created_at ?? new Date().toISOString(),
          },
        ]);
      } else {
        Alert.alert('Error', result.detail || 'Submission failed');
      }
    } catch (error) {
      Alert.alert('Network Error', 'Failed to submit project');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#BB86FC" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Button mode="contained" onPress={() => setModalVisible(true)} style={styles.button}>
          Apply for New Project
        </Button>

        <Text style={styles.sectionTitle}>Ongoing Projects</Text>
        {ongoingProjects.map((project) => (
          <TouchableWithoutFeedback
            key={project.id}
            onPressIn={() => {
              scale.value = withTiming(0.97, { duration: 100 });
            }}
            onPressOut={() => {
              scale.value = withTiming(1, { duration: 100 });
              handleCardPress(project);
            }}
          >
            <Animated.View style={[styles.card, animatedStyle]}>
              <Card key={project.id} style={[styles.card, { backgroundColor: '#00b4d8' }]}>
                <Card.Content>
                  <Title style={styles.projectTitle}>{project.name}</Title>
                  <Paragraph>{project.description}</Paragraph>
                  <Text style={styles.statusText}>Status: Ongoing</Text>
                </Card.Content>
              </Card>
            </Animated.View>
          </TouchableWithoutFeedback>
        ))}

        <Text style={styles.sectionTitle}>Applied Projects</Text>
        {appliedProjects.map((project) => (
          <Card key={project.id} style={[styles.card, { backgroundColor: '#fca311' }]}>
            <Card.Content>
              <Title style={styles.projectTitle}>{project.name}</Title>
              <Paragraph>{project.description}</Paragraph>
              <Text style={styles.statusText}>Status: Applied</Text>
            </Card.Content>
          </Card>
        ))}

        <Title style={styles.sectionTitle}>Completed Projects</Title>
        {completedProjects.map((project, idx) => (
          <Card key={idx} style={[styles.card, { backgroundColor: '#2c3e50' }]}>
            <Card.Content>
              <Title>{project.name}</Title>
              <Paragraph>{project.status}</Paragraph>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              placeholder="Project Name"
              value={projectName}
              onChangeText={setProjectName}
              style={styles.input}
              placeholderTextColor="#ccc"
            />
            <TextInput
              placeholder="Project Description"
              value={projectDescription}
              onChangeText={setProjectDescription}
              style={styles.input}
              multiline
              numberOfLines={4}
              placeholderTextColor="#ccc"
            />
            <TextInput
              placeholder="Chainage (in km)"
              value={chainageKm}
              onChangeText={setChainageKm}
              style={styles.input}
              keyboardType="decimal-pad"
              placeholderTextColor="#ccc"
            />
            <Button mode="contained" onPress={submitProject}>
              Submit Project
            </Button>
            <Button onPress={() => setModalVisible(false)} style={{ marginTop: 10 }}>
              Cancel
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#121212',
    flex: 1,
  },
  button: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 12,
    color: 'white',
  },
  card: {
    marginVertical: 6,
    backgroundColor: '#1f1f1f',
    borderRadius: 8,
    elevation: 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#1f1f1f',
    margin: 20,
    padding: 20,
    borderRadius: 10,
  },
  input: {
    backgroundColor: '#2a2a2a',
    color: 'white',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 5,
    marginBottom: 10,
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  statusText: {
    marginTop: 5,
    fontWeight: '600',
    color: '#444',
  },
});

export default OrganizationProjectList;
