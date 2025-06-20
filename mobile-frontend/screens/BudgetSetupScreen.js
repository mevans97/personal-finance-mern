// BudgetSetupScreen.js

import React, { useState } from 'react';
import {
  View, Text, TextInput, Button, Alert, StyleSheet, ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function BudgetSetupScreen({ navigation }) {
  // Define our fixed category list
  const categories = [
    "Housing", "Food", "Transportation", "Utilities",
    "Healthcare", "Entertainment", "Savings", "Other"
  ];

  // State to store the amount for each category
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

  // Function to handle form submission
  const submitBudget = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      // Prepare items for POST: only include categories with values
      const items = Object.entries(categoryAmounts)
        .filter(([_, amount]) => amount)
        .map(([category, amount]) => ({
          name: category,
          amount: parseFloat(amount),
          category
        }));

      if (items.length === 0) {
        Alert.alert('Please enter at least one category amount.');
        return;
      }

      await axios.post('http://10.0.0.81:5000/api/budget', { items }, {
        headers: { Authorization: token }
      });

      Alert.alert('Budget saved successfully!');
      navigation.navigate('Dashboard');
    } catch (err) {
      console.error("Submit error:", err.response?.data || err.message);
      Alert.alert('Error', err.response?.data?.message || 'Could not save budget');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Set Your Monthly Budget</Text>

      {categories.map((category) => (
        <View key={category} style={styles.inputGroup}>
          <Text style={styles.label}>{category}</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder={`Enter amount for ${category}`}
            value={categoryAmounts[category]}
            onChangeText={(text) =>
              setCategoryAmounts({ ...categoryAmounts, [category]: text })
            }
          />
        </View>
      ))}

      <Button title="Save Budget" onPress={submitBudget} />
    </ScrollView>
  );
}

// Styles
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
