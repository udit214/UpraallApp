import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import {
  Text,
  Button,
  Divider,
  Surface,
  ActivityIndicator,
} from 'react-native-paper';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OrganizationProfileScreen = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const res = await fetch('http://10.0.2.2:8000/api_profile/organization/profile/', {
        headers: { Authorization: `Token ${token}` },
      });

      if (!res.ok) {
        throw new Error(`Status ${res.status}`);
      }

      const data = await res.json();
      setProfile(data);
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchProfile();
    }, [])
  );

  const getLogoUri = () => {
    if (profile?.logo?.startsWith('http')) return profile.logo;
    if (typeof profile?.logo === 'string') {
      return `http://10.0.2.2:8000${profile.logo}`;
    }
    return 'https://via.placeholder.com/160';
  };

  if (loading || !profile) {
    return <ActivityIndicator style={{ marginTop: 50 }} size="large" />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Surface style={styles.card} elevation={4}>
          console.log('🖼️ logo uri = ', getLogoUri());

                <Image
        source={{ uri: getLogoUri() }}
        style={styles.logo}
        resizeMode="cover"
      />
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.description}>{profile.description}</Text>

          <Divider style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.label}>📧 Email</Text>
            <Text style={styles.value}>{profile.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>📞 Phone</Text>
            <Text style={styles.value}>{profile.phone}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>📍 Address</Text>
            <Text style={styles.value}>{profile.address}</Text>
          </View>

          {profile.website && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>🔗 Website</Text>
              <Text style={styles.value}>{profile.website}</Text>
            </View>
          )}

          <Button
            mode="contained"
            icon="pencil"
            style={styles.button}
            onPress={() => navigation.navigate('EditProfileScreen')}
          >
            Edit Profile
          </Button>
        </Surface>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrganizationProfileScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  container: {
    padding: 20,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#1f1f1f',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    backgroundColor: '#333',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 20,
  },
  divider: {
    width: '100%',
    marginVertical: 12,
    backgroundColor: '#333',
  },
  infoRow: {
    width: '100%',
    marginVertical: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#BB86FC',
    marginBottom: 2,
  },
  value: {
    fontSize: 15,
    color: '#eee',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#BB86FC',
    width: '100%',
    borderRadius: 8,
  },
});
