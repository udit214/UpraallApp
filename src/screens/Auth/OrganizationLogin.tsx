import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../utils/config';

const OrganizationLogin = ({ setIsLoggedIn }) => {  // <-- Accept setIsLoggedIn prop
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/auth/organization_login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      setLoading(false);

      if (response.ok && result.token) {
        // Save token securely
        await AsyncStorage.setItem('authToken', result.token);
        Alert.alert('Success', 'Login successful');

        // Update login state to show DrawerNavigator
        setIsLoggedIn(true);
        
        // No need to navigate manually here,
        // because the app will switch navigator automatically based on isLoggedIn
      } else {
        Alert.alert('Error', result.message || 'Login failed');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Server error. Try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Organization Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 32,
    alignSelf: 'center',
    fontWeight: '600',
  },
  input: {
    height: 50,
    backgroundColor: '#1f1f1f',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    color: '#fff',
  },
  button: {
    height: 50,
    backgroundColor: '#BB86FC',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default OrganizationLogin;
