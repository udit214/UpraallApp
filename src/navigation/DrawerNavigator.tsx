// navigation/DrawerNavigator.js
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import OrganizationDashboard from '../screens/project_dashboard/OrganizationProjectList';


import ProjectManagementPanel from '../screens/project_dashboard/orgProject';
import PMPDrawerNavigator from './PMPDrawer'; // 👈 New

const Drawer = createDrawerNavigator();

const DrawerNavigator = ({ setIsLoggedIn }) => (
  <Drawer.Navigator
    screenOptions={{
      gestureEnabled: true,              // 👈 Enable swipe gestures
      swipeEdgeWidth: 150,                // 👈 Distance from edge to trigger drawer (default is 32)
      drawerType: 'slide',
      headerShown: true,
      drawerStyle: { backgroundColor: '#121212' },
      drawerActiveTintColor: '#BB86FC',
      drawerInactiveTintColor: '#CCCCCC',
      headerStyle: { backgroundColor: '#121212' },
      headerTintColor: '#FFFFFF',
    }}
  >
    


    {/* Hidden PMP Drawer, opens from project card click */}
    <Drawer.Screen
      name="PMP"
      component={PMPDrawerNavigator}
        options={({ route }) => ({
    drawerItemStyle: { display: 'none' },
    headerShown: false, // 👈 hides outer header when PMP is active
  })}
    />

    <Drawer.Screen name="Logout">
      {(props) => <LogoutUser {...props} setIsLoggedIn={setIsLoggedIn} />}
    </Drawer.Screen>
  </Drawer.Navigator>
);

export default DrawerNavigator;
