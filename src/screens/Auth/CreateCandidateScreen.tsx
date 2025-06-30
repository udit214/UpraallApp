import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  RadioButton,
  useTheme,
  ActivityIndicator,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CandidateCreationScreen = ({ navigation }) => {
  const theme = useTheme();
  const [form, setForm] = useState({
    username: '',
    email: '',
    phone: '',
    gender: 'male',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async () => {
    if (!form.username || !form.email || !form.phone) {
      Alert.alert('Validation Error', 'Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      const res = await fetch('http://10.0.2.2:8000/api/candidates/create/', {
        method: 'POST',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert('Success', 'Candidate created and notified via email.');
        navigation.goBack();
      } else {
        console.error(data);
        Alert.alert('Error', data?.detail || 'Failed to create candidate.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>Create New Candidate</Text>

      <TextInput
        label="Username"
        value={form.username}
        onChangeText={(text) => handleChange('username', text)}
        style={styles.input}
      />
      <TextInput
        label="Email"
        value={form.email}
        keyboardType="email-address"
        onChangeText={(text) => handleChange('email', text)}
        style={styles.input}
      />
      <TextInput
        label="Phone"
        value={form.phone}
        keyboardType="phone-pad"
        onChangeText={(text) => handleChange('phone', text)}
        style={styles.input}
      />

      <Text style={styles.label}>Gender</Text>
      <RadioButton.Group
        onValueChange={(value) => handleChange('gender', value)}
        value={form.gender}
      >
        <View style={styles.radioRow}>
          <RadioButton value="male" />
          <Text style={styles.radioLabel}>Male</Text>
          <RadioButton value="female" />
          <Text style={styles.radioLabel}>Female</Text>
        </View>
      </RadioButton.Group>

      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={loading}
        disabled={loading}
        style={styles.button}
      >
        Create Candidate
      </Button>
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
  },
  input: {
    backgroundColor: '#1f1f1f',
    marginBottom: 12,
  },
  button: {
    marginTop: 20,
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
});

export default CandidateCreationScreen;
