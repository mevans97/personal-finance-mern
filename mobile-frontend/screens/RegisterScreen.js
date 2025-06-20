/**
 * File: RegisterScreen.js
 * ------------------------
 * This component provides the user registration screen for the mobile app.
 * It allows users to create a new account by entering an email and password.
 * 
 * Key functionality includes:
 * - Controlled form inputs for email and password.
 * - API request to the backend `/api/auth/register` endpoint using Axios.
 * - Success feedback via an alert and navigation to the Login screen.
 * - Basic styling using React Native's StyleSheet.
 */

import React, { useState } from 'react'; // Import React and useState hook
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native'; // UI components from React Native
import axios from 'axios'; // Axios is used for making HTTP requests

export default function RegisterScreen({ navigation }) {
  // State variables for storing user input
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Handles registration form submission
  const handleRegister = async () => {
    try {
      // Send POST request to backend registration endpoint
      await axios.post('http://10.0.0.81:5000/api/auth/register', {
        email,
        password,
      });

      // If successful, alert the user and redirect to login
      Alert.alert('Success', 'Registered successfully! Please log in.');
      navigation.navigate('Login');
    } catch (err) {
      // Show error alert if registration fails
      Alert.alert('Registration Failed', err.response?.data?.message || 'Try again');
    }
  };

  // JSX layout for the registration screen
  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Register</Text>

      {/* Email input */}
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      {/* Password input (hidden with secureTextEntry) */}
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      {/* Register button triggers form submission */}
      <Button title="Register" onPress={handleRegister} />

      {/* Optional button to go back to Login screen */}
      <Button title="Back to Login" onPress={() => navigation.navigate('Login')} />
    </View>
  );
}

// Style definitions for layout and spacing
const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center' // Vertically center the form
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5
  }
});
