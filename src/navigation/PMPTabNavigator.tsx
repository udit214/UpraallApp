import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import LetterScreen from '../screens/Documents/LetterScreen';
import ProjectDashboard from '../screens/project_dashboard/ProjectDashboard';
import OrganizationProfileStack from './OrganizationProfileStack';

const Tab = createBottomTabNavigator();

const PMPTabNavigator = ({ project }) => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#BB86FC',
        tabBarInactiveTintColor: '#CCCCCC',
        tabBarStyle: { backgroundColor: '#121212' },
      }}
    >
      {/* Home is FIRST so it's default */}
      <Tab.Screen
        name="Home"
        component={ProjectDashboard}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" size={24} color={color} />
          ),
        }}
        initialParams={{ project }}
      />

      <Tab.Screen
        name="Overview"
        component={LetterScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="dashboard" size={24} color={color} />
          ),
        }}
        initialParams={{ project }}
      />

      <Tab.Screen
        name="Profile"
        component={OrganizationProfileStack}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="person" size={24} color={color} />
          ),
        }}
        initialParams={{ project }}
      />
    </Tab.Navigator>
  );
};

export default PMPTabNavigator;
