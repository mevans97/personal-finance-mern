/**
 * BudgetSetupScreen.js
 * ---------------------
 * This screen allows the user to create an initial monthly budget by entering spending amounts
 * for predefined categories. The budget is then submitted to the backend and saved in MongoDB.
 * 
 * Features:
 * - Fixed set of budget categories (Housing, Food, etc.)
 * - Dynamic form input for each category
 * - Form submission to backend with token-based authentication
 * - Navigation to Dashboard after saving
 */

import React, { useState } from 'react';
import {
  View, Text, TextInput, Button, Alert, StyleSheet, ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // For accessing stored JWT
import axios from 'axios'; // HTTP requests to backend

export default function BudgetSetupScreen({ navigation }) {
  // List of fixed budget categories
  const categories = [
    "Housing", "Food", "Transportation", "Utilities",
    "Healthcare", "Entertainment", "Savings", "Other"
  ];

  // State object holds entered values for each category
  const [categoryAmounts, setCategoryAmounts] = useState({
    Housing: '',
    Food: '',
    Transportation: '',
    Utilities: '',
    Healthcare: '',
    Entertainment: '',
    Savings: '',
    Other: ''
  });

  // Called when the user taps "Save Budget"
  const submitBudget = async () => {
    try {
      const token = await AsyncStorage.getItem('token'); // Get stored JWT

      // Filter out any empty categories and format for backend
      const items = Object.entries(categoryAmounts)
        .filter(([_, amount]) => amount) // Only include categories with input
        .map(([category, amount]) => ({
          name: category,
          amount: parseFloat(amount), // Convert from string to float
          category
        }));

      // Don't allow submitting an empty form
      if (items.length === 0) {
        Alert.alert('Please enter at least one category amount.');
        return;
      }

      // Send data to backend (POST to /api/budget)
      await axios.post('http://10.0.0.81:5000/api/budget', { items }, {
        headers: { Authorization: token }
      });

      Alert.alert('Budget saved successfully!');
      navigation.navigate('Dashboard'); // Redirect to dashboard
    } catch (err) {
      // Handle server or validation errors
      console.error("Submit error:", err.response?.data || err.message);
      Alert.alert('Error', err.response?.data?.message || 'Could not save budget');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Set Your Monthly Budget</Text>

      {/* Render input for each category dynamically */}
      {categories.map((category) => (
        <View key={category} style={styles.inputGroup}>
          <Text style={styles.label}>{category}</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder={`Enter amount for ${category}`}
            value={categoryAmounts[category]} // Current input value
            onChangeText={(text) =>
              setCategoryAmounts({ ...categoryAmounts, [category]: text }) // Update state
            }
          />
        </View>
      ))}

      <Button title="Save Budget" onPress={submitBudget} />
    </ScrollView>
  );
}

// Styles for UI layout
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  inputGroup: {
    marginBottom: 15
  },
  label: {
    fontSize: 16,
    marginBottom: 5
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 8
  }
});
