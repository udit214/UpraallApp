// navigation/PMPStackNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NcrScreen from '../screens/Documents/NCRScreen';
import DocumentPreview from '../screens/Documents/DocumentPreview';


const Stack = createNativeStackNavigator();

const NCRStackNavigator = ({ route }) => {
  const { project } = route.params;

  return (
    <Stack.Navigator>
      <Stack.Screen name="NCRPage"  options={{ headerShown: false}}>
        {props => <NcrScreen {...props} project={project} />}
      </Stack.Screen>
      <Stack.Screen name="DocumentPreview" component={DocumentPreview} options={{  headerShown: false }} />
    </Stack.Navigator>
  );
};

export default NCRStackNavigator;
