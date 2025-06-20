/**
 * File: App.js
 * ------------
 * This is the main entry point for the React Native app.
 * It sets up screen navigation using React Navigation's stack navigator.
 * 
 * The app includes the following screens:
 * - LoginScreen: User login
 * - RegisterScreen: User registration
 * - BudgetSetupScreen: Initial monthly budget entry
 * - DashboardScreen: Main dashboard for managing and tracking finances
 * 
 * React Navigation is used to handle transitions between these screens.
 */

import React from 'react'; // Import React
import { NavigationContainer } from '@react-navigation/native'; // Provides navigation context
import { createNativeStackNavigator } from '@react-navigation/native-stack'; // Creates a stack-based navigator

// Import all screens used in the app
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import DashboardScreen from './screens/DashboardScreen'; // Main dashboard screen
import BudgetSetupScreen from './screens/BudgetSetupScreen'; // Screen for setting up budget

// Create a stack navigator instance
const Stack = createNativeStackNavigator();

// Root component of the app
export default function App() {
  return (
    // Wrap app in navigation context
    <NavigationContainer>
      {/* Define the screen stack for navigation */}
      <Stack.Navigator initialRouteName="Login">
        {/* Login screen shown first */}
        <Stack.Screen name="Login" component={LoginScreen} />

        {/* Registration screen */}
        <Stack.Screen name="Register" component={RegisterScreen} />

        {/* Screen for initial budget setup */}
        <Stack.Screen name="BudgetSetup" component={BudgetSetupScreen} />

        {/* Main dashboard screen */}
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
