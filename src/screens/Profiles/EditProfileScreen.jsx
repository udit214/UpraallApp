import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  useTheme,
  ActivityIndicator,
} from 'react-native-paper';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://192.168.1.5:8000';

const EditProfileScreen = ({ navigation }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const theme = useTheme();

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const res = await fetch(`${BASE_URL}/api_profile/organization/profile/`, {
        headers: { Authorization: `Token ${token}` },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await res.json();
      setProfile(data);
    } catch (e) {
      console.error('Fetch profile error:', e);
      Alert.alert('Error', 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleImagePick = () => {
    launchImageLibrary({ mediaType: 'photo' }, response => {
      if (response.assets && response.assets.length > 0) {
        setProfile({ ...profile, logo: response.assets[0] });
      }
    });
  };

  const handleSubmit = async () => {
    setUpdating(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      const formData = new FormData();

      ['name', 'email', 'phone', 'address', 'description', 'website'].forEach(field => {
        formData.append(field, profile[field] || '');
      });

      if (profile.logo?.uri) {
        formData.append('logo', {
          uri: profile.logo.uri,
          type: profile.logo.type || 'image/jpeg',
          name: profile.logo.fileName || 'logo.jpg',
        });
      }

      const res = await fetch(`${BASE_URL}/api_profile/organization/profile/`, {
        method: 'PUT',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (!res.ok) {
        const error = await res.text();
        console.error('Update failed:', error);
        Alert.alert('Error', 'Failed to update profile');
      } else {
        Alert.alert('Success', 'Profile updated');
        navigation.goBack();
      }
    } catch (e) {
      console.error('Submit error:', e);
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading || !profile) {
    return <ActivityIndicator style={{ marginTop: 50 }} size="large" />;
  }

  const getLogoUri = () => {
    if (profile.logo?.uri) return profile.logo.uri;
    if (typeof profile.logo === 'string') {
      return profile.logo.startsWith('http')
        ? profile.logo
        : `${BASE_URL}${profile.logo}`;
    }
    return 'https://via.placeholder.com/150';
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={handleImagePick}>
        <Image source={{ uri: getLogoUri() }} style={styles.logo} />
        <Text style={styles.editImageText}>Tap to change logo</Text>
      </TouchableOpacity>

      {['name', 'email', 'phone', 'address', 'website', 'description'].map(field => (
        <TextInput
          key={field}
          label={field.charAt(0).toUpperCase() + field.slice(1)}
          value={profile[field] || ''}
          onChangeText={text => setProfile({ ...profile, [field]: text })}
          style={styles.input}
          multiline={field === 'description'}
        />
      ))}

      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={updating}
        style={styles.button}
      >
        Save Changes
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#121212',
    flex: 1,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 10,
    backgroundColor: '#333',
  },
  editImageText: {
    color: '#BB86FC',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#1f1f1f',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#BB86FC',
  },
});

export default EditProfileScreen;
