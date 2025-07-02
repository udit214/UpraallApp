import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import OrganizationProjectList from '../screens/project_dashboard/OrganizationProjectList';
import LogoutUser from '../screens/Drawer/LogoutScreen';
import { NavigationContainer } from '@react-navigation/native';
import ProjectDashboard from '../screens/project_dashboard/ProjectDashboard';
import { createStackNavigator } from '@react-navigation/stack';
import PAndPDocumentPage from '../screens/Documents/P_and_P';
import CosRecordsPage from '../screens/Documents/Cos_Records';
import NCRScreen from '../screens/Documents/NCRScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import OrganizationProfileScreen from '../screens/Profiles/OrganizationProfileScreen';
import EditProfileScreen from '../screens/Profiles/EditProfileScreen';

const Drawer1 = createDrawerNavigator()
const Drawer2 = createDrawerNavigator()
const Stack = createStackNavigator()
const RootStack = createStackNavigator();
const Tabnav = createBottomTabNavigator()
const Profilestack = createStackNavigator()

const ProfilePageStack = () => {
  return(
    <Profilestack.Navigator
    screenOptions={{headerShown:false}}
    >
      <Profilestack.Screen component={OrganizationProfileScreen} name='OrganizationProfileScreen' />
      <Profilestack.Screen component={EditProfileScreen} name='EditProfileScreen' />
    </Profilestack.Navigator>
  )
}


const TabNavigation = ({route}) =>{
  const { project } = route.params || {};
  return(
        <Tabnav.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#BB86FC',
        tabBarStyle: { backgroundColor: '#121212' },
      }}
    >
      <Tabnav.Screen
        name="Home"
        component={ProjectDashboard}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" size={24} color={color} />
          ),
        }}
        initialParams={{ project }}
      />
      <Tabnav.Screen
        name="Notice"
        component={ProjectDashboard}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" size={24} color={color} />
          ),
        }}
        initialParams={{ project }}
      />
      <Tabnav.Screen
        name="Profile"
        component={ProfilePageStack}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" size={24} color={color} />
          ),
        }}
        initialParams={{ project }}
      />
    </Tabnav.Navigator>
  )
}

const PMPDrawer = ({ route, setIsLoggedIn }) => {
  const { project } = route.params || {};

  return (
    <Drawer2.Navigator
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
      <Drawer2.Screen
        name="project Dashboard"
        component={TabNavigation}
        initialParams={{ project }}
      />
      <Drawer2.Screen
        name="P_and_P"
        component={PAndPDocumentPage}
        initialParams={{ project }}
      />
      <Drawer2.Screen
        name="Cosrecord"
        component={CosRecordsPage}
        initialParams={{ project }}
      />
      <Drawer2.Screen
        name="NCR"
        component={NCRScreen}
        initialParams={{ project }}
      />
      <Drawer2.Screen name="Logout">
        {(props) => <LogoutUser {...props} setIsLoggedIn={setIsLoggedIn} />}
      </Drawer2.Screen>
    </Drawer2.Navigator>
  );
};


const DrawerGroup1 = ({ setIsLoggedIn }) => {
  return (
    <Drawer1.Navigator
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
      <Drawer1.Screen name="Dashboard" component={OrganizationProjectList} />
      <Drawer1.Screen name="Logout">
        {(props) => <LogoutUser {...props} setIsLoggedIn={setIsLoggedIn} />}
      </Drawer1.Screen>
    </Drawer1.Navigator>
  );
};

const RootNavigator = ({ setIsLoggedIn }) => {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="DrawerGroup1">
        {(props) => <DrawerGroup1 {...props} setIsLoggedIn={setIsLoggedIn} />}
      </RootStack.Screen>

      <RootStack.Screen name="DrawerGroup2">
        {(props) => <PMPDrawer {...props} setIsLoggedIn={setIsLoggedIn} />}
      </RootStack.Screen>
    </RootStack.Navigator>
  );
};

export default function BaseNavigator(){
    return (
    <NavigationContainer>
        <RootNavigator />
    </NavigationContainer>

    )
}