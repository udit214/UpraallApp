// navigation/PMPStackNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PAndPDocumentPage from '../screens/Documents/P_and_P';
import DocumentPreview from '../screens/Documents/DocumentPreview';
import CosRecordsPage from '../screens/Documents/Cos_Records';

const Stack = createNativeStackNavigator();

const CosStackNavigator = ({ route }) => {
  const { project } = route.params;

  return (
    <Stack.Navigator>
      <Stack.Screen name="CosRecordsPage"  options={{ headerShown: false}}>
        {props => <CosRecordsPage {...props} project={project} />}
      </Stack.Screen>
      <Stack.Screen name="DocumentPreview" component={DocumentPreview} options={{  headerShown: false }} />
    </Stack.Navigator>
  );
};

export default CosStackNavigator;
