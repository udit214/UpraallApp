import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LogoutUser = ({ navigation, setIsLoggedIn }) => {
  useEffect(() => {
    const logout = async () => {
      await AsyncStorage.removeItem('authToken');
      setIsLoggedIn(false);  // Update login state, App.tsx will switch nav
    };

    logout();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#6200ee" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default LogoutUser;
