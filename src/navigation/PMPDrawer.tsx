import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import LogoutScreen from '../screens/Drawer/LogoutScreen';
import OrganizationDashboard from '../screens/project_dashboard/OrganizationProjectList';
import PMPStackNavigator from './PMPStackNavigator';
import CosStackNavigator from './CosStackNavigator';
import NCRStackNavigator from './NCRStackNavigator';
import ProjectStack from './candidatestack'; // ✅ stack with tabs + CreateCandidateScreen

const Drawer = createDrawerNavigator();

const PMPDrawerNavigator = ({ route }) => {
  const { project } = route.params;

  return (
    <Drawer.Navigator
      initialRouteName="PMPDashboard"
      screenOptions={{
        gestureEnabled: true,
        swipeEdgeWidth: 150,
        drawerType: 'slide',
        headerShown: true,
        drawerStyle: { backgroundColor: '#121212' },
        drawerActiveTintColor: '#BB86FC',
        drawerInactiveTintColor: '#CCCCCC',
        headerStyle: { backgroundColor: '#121212' },
        headerTintColor: '#FFFFFF',
      }}
    >
      {/* ✅ This is now the only main entry */}
      <Drawer.Screen
        name="PMPDashboard"
        options={{ title: project.name }}
      >
        {props => <ProjectStack {...props} project={project} />}
      </Drawer.Screen>

      <Drawer.Screen
        name="OrgDashboard"
        component={OrganizationDashboard}
        options={{ title: 'Dashboard' }}
      />
      <Drawer.Screen
        name="P & P"
        component={PMPStackNavigator}
        initialParams={{ project }}
        options={{ title: 'P & P' }}
      />
      <Drawer.Screen
        name="COS"
        component={CosStackNavigator}
        initialParams={{ project }}
        options={{ title: 'COS' }}
      />
      <Drawer.Screen
        name="NCR"
        component={NCRStackNavigator}
        initialParams={{ project }}
        options={{ title: 'NCR' }}
      />
      <Drawer.Screen
        name="Logout"
        component={LogoutScreen}
        options={{ title: 'Logout' }}
      />
    </Drawer.Navigator>
  );
};

export default PMPDrawerNavigator;
