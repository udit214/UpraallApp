import React, { useState } from 'react';
import {
  View, TextInput, Text, Alert,
  StyleSheet, ActivityIndicator, TouchableOpacity
} from 'react-native';

const OrganizationSignup = ({ navigation }: any) => {
  const [organizationName, setOrganizationName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contact, setContact] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setLoading(true);
    const data = {
      organization_name: organizationName,
      email: email,
      password: password,
      contact: contact,
    };

    try {
      const response = await fetch('http://10.0.2.2:8000/api/auth/organization_signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Organization signed up successfully. Await Upraall verification.');
        navigation.navigate('OrgLogin');
      } else {
        Alert.alert('Error', result.message || 'Error during signup');
      }
    } catch (error) {
      Alert.alert('Error', 'Error connecting to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Faded background when loading */}
      <View style={[styles.formContainer, loading && { opacity: 0.4 }]}>
        <Text style={styles.title}>Organization Signup</Text>

        <TextInput
          style={styles.input}
          placeholder="Organization Name"
          value={organizationName}
          onChangeText={setOrganizationName}
          editable={!loading}
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          editable={!loading}
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          editable={!loading}
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          placeholder="Contact Number"
          keyboardType="phone-pad"
          value={contact}
          onChangeText={setContact}
          editable={!loading}
          placeholderTextColor="#888"
        />

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.5 }]}
          onPress={handleSignup}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <Text style={styles.redirectText}>
          Already have an account?{' '}
          <Text style={styles.link} onPress={() => !loading && navigation.navigate('OrgLogin')}>
            Login here
          </Text>
        </Text>
      </View>

      {/* Full-screen spinner overlay */}
      {loading && (
        <View style={styles.spinnerOverlay}>
          <ActivityIndicator size="large" color="#BB86FC" />
        </View>
      )}
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
  formContainer: {
    zIndex: 1,
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
  redirectText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#bbb',
  },
  link: {
    color: '#BB86FC',
    textDecorationLine: 'underline',
  },
  spinnerOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: '#00000090',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});

export default OrganizationSignup;
