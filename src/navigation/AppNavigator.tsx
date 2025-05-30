
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ProgramSetupScreen from '../screens/ProgramSetupScreen';
import WorkoutScreen from '../screens/WorkoutScreen';
import ExerciseImageTest from '../screens/ExerciseImageTest';

const Tab = createBottomTabNavigator();

function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: 'Accueil', title: 'Accueil' }}
      />
      <Tab.Screen
        name="Program"
        component={ProgramSetupScreen}
        options={{ tabBarLabel: 'Programme', title: 'Programme' }}
      />
      <Tab.Screen
        name="Workout"
        component={WorkoutScreen}
        options={{ tabBarLabel: 'Entraînement', title: 'Entraînement' }}
      />
      <Tab.Screen
        name="Test"
        component={ExerciseImageTest}
        options={{ tabBarLabel: 'Test', title: 'Test' }}
      />
    </Tab.Navigator>
  );
}

export default AppNavigator;