/**
 * File: LoginScreen.js
 * --------------------
 * This React Native component handles user login functionality.
 * It collects the user's email and password, authenticates via a backend API,
 * stores the JWT token locally with AsyncStorage, and conditionally navigates
 * the user to the dashboard or the initial budget setup screen based on whether
 * they already have a budget configured.
 */

import React, { useState } from 'react'; // React and useState hook for component state
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet
} from 'react-native'; // UI components from React Native
import axios from 'axios'; // Axios for HTTP requests
import AsyncStorage from '@react-native-async-storage/async-storage'; // Local storage for the token

// The main functional component that renders the login form
export default function LoginScreen({ navigation }) {
  // Store the email input value
  const [email, setEmail] = useState('');

  // Store the password input value
  const [password, setPassword] = useState('');

  // Function to handle login logic
  const handleLogin = async () => {
    try {
      // Make a POST request to the login endpoint with user credentials
      const res = await axios.post('http://10.0.0.81:5000/api/auth/login', {
        email,
        password,
      });

      // Extract the token from the response
      const token = res.data.token;

      // Save the token locally for future use
      await AsyncStorage.setItem('token', token);

      // Check if the user already has a budget
      const budgetRes = await axios.get('http://10.0.0.81:5000/api/budget', {
        headers: { Authorization: token }
      });

      // Navigate user depending on their budget status
      if (budgetRes.data.exists) {
        navigation.navigate('Dashboard'); // If budget exists, go to dashboard
      } else {
        navigation.navigate('BudgetSetup'); // Otherwise, prompt setup
      }

    } catch (err) {
      // Show an alert if something goes wrong
      Alert.alert('Login Failed', err.response?.data?.message || 'Try again');
    }
  };

  return (
    <View style={styles.container}>
      {/* Title text */}
      <Text style={styles.title}>Login</Text>

      {/* Input for email */}
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      {/* Input for password */}
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      {/* Button to trigger login */}
      <Button title="Login" onPress={handleLogin} />

      {/* Button to navigate to register screen */}
      <Button title="Register Instead" onPress={() => navigation.navigate('Register')} />
    </View>
  );
}

// Define styles used in the component
const styles = StyleSheet.create({
  container: {
    padding: 20, // Padding around edges
    flex: 1, // Fill entire screen
    justifyContent: 'center' // Center vertically
  },
  title: {
    fontSize: 24, // Large font for title
    marginBottom: 20, // Spacing below the title
    textAlign: 'center' // Center-aligned title
  },
  input: {
    borderWidth: 1, // Border around text input
    marginBottom: 10, // Space below input
    padding: 10, // Padding inside input box
    borderRadius: 5 // Rounded corners
  }
});
