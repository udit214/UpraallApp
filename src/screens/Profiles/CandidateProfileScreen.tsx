import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Linking,
} from 'react-native';
import {
  Text,
  Title,
  Paragraph,
  ActivityIndicator,
  Divider,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://10.0.2.2:8000';
const DEFAULT_PIC = `${BASE_URL}/media/defaults/deafaultpic1.jpg`;

const CandidateProfileScreen = ({ route }) => {
  const { candidateId } = route.params;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCandidateProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      console.log('🔍 Fetching profile for candidateId:', candidateId);

      const res = await fetch(`${BASE_URL}/api_profile/candidate-profile/${candidateId}/`, {
        headers: { Authorization: `Token ${token}` },
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status} - ${errorText}`);
      }

      const data = await res.json();
      console.log('✅ Profile fetched:', data);
      setProfile(data);
    } catch (err) {
      console.error('❌ Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidateProfile();
  }, []);

  const getImageUri = () => {
    if (profile?.profile_picture) {
      return profile.profile_picture.startsWith('http')
        ? profile.profile_picture
        : `${BASE_URL}${profile.profile_picture}`;
    }
    return DEFAULT_PIC;
  };

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 50 }} size="large" />;
  }

  if (!profile) {
    return (
      <View style={styles.center}>
        <Text style={{ color: '#fff' }}>Profile not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileCard}>
        <Image source={{ uri: getImageUri() }} style={styles.image} />
        <Title style={styles.username}>{profile.username}</Title>
        {profile.bio ? <Paragraph style={styles.bio}>{profile.bio}</Paragraph> : null}
        <Divider style={styles.divider} />

        {profile.phone ? (
          <View style={styles.infoBlock}>
            <Text style={styles.label}>📞 Phone:</Text>
            <Text style={styles.value}>{profile.phone}</Text>
          </View>
        ) : null}

        {profile.website ? (
          <View style={styles.infoBlock}>
            <Text style={styles.label}>🔗 Website:</Text>
            <Text
              style={styles.link}
              onPress={() => Linking.openURL(profile.website)}
            >
              {profile.website}
            </Text>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
};

export default CandidateProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  profileCard: {
    backgroundColor: '#1f1f1f',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  image: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 12,
    backgroundColor: '#333',
  },
  username: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 6,
  },
  bio: {
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 12,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#333',
    marginVertical: 16,
  },
  infoBlock: {
    width: '100%',
    marginBottom: 12,
  },
  label: {
    color: '#BB86FC',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  value: {
    color: '#fff',
  },
  link: {
    color: '#03DAC6',
    textDecorationLine: 'underline',
  },
});
