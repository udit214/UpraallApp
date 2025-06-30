import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OrganizationProfileScreen from '../screens/Profiles/OrganizationProfileScreen';
import EditProfileScreen from '../screens/Profiles/EditProfileScreen';

const Stack = createNativeStackNavigator();

const OrganizationProfileStack = () => (
  <Stack.Navigator screenOptions={{
    headerShown: false
  }}>
    <Stack.Screen name="OrgProfile" component={OrganizationProfileScreen} />
    <Stack.Screen name="EditProfile" component={EditProfileScreen} />
  </Stack.Navigator>
);

export default OrganizationProfileStack;
