import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AuthScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image
        source={require('./assets/mylogo-removebg-preview.png')} // Make sure to place a logo image at this path
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Welcome to Upraall Project Manager</Text>
      <Text style={styles.description}>
        A powerful tool to streamline and manage engineering documentation for organizations and candidates.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('CandidateLogin')}
      >
        <Text style={styles.buttonText}>Login as Candidate</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('OrgLogin')}
      >
        <Text style={styles.buttonText}>Login as Organization</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={() => navigation.navigate('OrgSignup')}
      >
        <Text style={styles.secondaryButtonText}>Signup as Organization</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#bbb',
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#BB86FC',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginVertical: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#03DAC6',
  },
  secondaryButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});
