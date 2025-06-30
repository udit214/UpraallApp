// navigation/ProjectStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PMPTabNavigator from './PMPTabNavigator';
import CandidateCreationScreen from '../screens/Auth/CreateCandidateScreen';
const Stack = createNativeStackNavigator();

const ProjectStack = ({ route }) => {
  const { project } = route.params;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs">
        {props => <PMPTabNavigator {...props} project={project} />}
      </Stack.Screen>
      <Stack.Screen
        name="CreateCandidate"
        component={CandidateCreationScreen}
        options={{ title: 'Create Candidate', headerShown: true }}
      />
    </Stack.Navigator>
  );
};

export default ProjectStack;
