import React, { useState } from 'react';
import { View, TextInput, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { BASE_URL } from '../utils/config';
const CandidateLogin = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const data = { email, password };

    try {
      const response = await fetch(`${BASE_URL}/api/auth/candidate_login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Candidate logged in successfully.');
        // Navigate to Candidate Dashboard or Home here
      } else {
        Alert.alert('Login Failed', result.message || 'Invalid credentials.');
      }
    } catch (error) {
      Alert.alert('Network Error', 'Unable to connect to server.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Candidate Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
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

export default CandidateLogin;
