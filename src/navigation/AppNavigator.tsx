import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthScreen from '../screens/Auth/AuthScreen';
import OrganizationLogin from '../screens/Auth/OrganizationLogin';
import OrganizationSignup from '../screens/Auth/OrganizationSignup';
import CandidateLogin from '../screens/Auth/CandidateLogin';
import DocumentPreview from '../screens/Documents/DocumentPreview';
import EditProfileScreen from '../screens/Profiles/EditProfileScreen';
import { NavigationContainer } from '@react-navigation/native';


const Stack = createNativeStackNavigator();

const AppNavigator = ({ setIsLoggedIn }) => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Auth" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="OrgLogin">
        {(props) => <OrganizationLogin {...props} setIsLoggedIn={setIsLoggedIn} />}
      </Stack.Screen>
      <Stack.Screen name="OrgSignup" component={OrganizationSignup} />
      <Stack.Screen name="CandidateLogin" component={CandidateLogin} />
      <Stack.Screen name="DocumentPreview" component={DocumentPreview}/>
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />

  

    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
