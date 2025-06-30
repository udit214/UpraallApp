import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import OrganizationProjectList from '../screens/project_dashboard/OrganizationProjectList';
import LogoutUser from '../screens/Drawer/LogoutScreen';
import { NavigationContainer } from '@react-navigation/native';
import ProjectDashboard from '../screens/project_dashboard/ProjectDashboard';
import ProjectStack from './candidatestack'; // ✅ stack with tabs + CreateCandidateScreen

const Drawer1 = createDrawerNavigator()
const Drawer2 = createDrawerNavigator()



const PMPDrawer = ({route}) => {
    const { project } = route.params;
    return(
        <Drawer2.Navigator>
            <Drawer2.Screen name="Logout" component={LogoutUser} options={{ title: 'Logout' }} />
            <Drawer2.Screen name="PMPDashboard" component={ProjectDashboard}>

            </Drawer2.Screen>
        </Drawer2.Navigator>
    )
}

const DrawerGroup1 = () => {
    return(
        <Drawer1.Navigator
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
           
            <Drawer1.Screen name="Dashboard" component={OrganizationProjectList} />
            <Drawer1.Screen name="Logout">
                {(props) => <LogoutUser {...props} setIsLoggedIn={setIsLoggedIn} />}
            </Drawer1.Screen>
            <Drawer1.Screen name='PMPDrawer' component={PMPDrawer} />

        </Drawer1.Navigator>
    )
}


export default function BaseNavigator(){
    return (
        
            <DrawerGroup1></DrawerGroup1>

    )
}