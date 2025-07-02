import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { Provider as PaperProvider ,  MD3DarkTheme,} from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import DrawerNavigator from './src/navigation/DrawerNavigator';
import BaseNavigator from './src/navigation/BaseNavigator';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        setIsLoggedIn(!!token);
      } catch (error) {
        console.error('Error checking login status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
    <PaperProvider theme={MD3DarkTheme}>

        {isLoggedIn ? (
          <BaseNavigator setIsLoggedIn={setIsLoggedIn} />
        ) : (
          <AppNavigator setIsLoggedIn={setIsLoggedIn} />
        )}

    </PaperProvider>
    </SafeAreaProvider>
  );
};

export default App;
