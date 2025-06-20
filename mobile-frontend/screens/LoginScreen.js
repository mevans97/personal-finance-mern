import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

 const handleLogin = async () => {
  try {
    const res = await axios.post('http://10.0.0.81:5000/api/auth/login', {
      email,
      password,
    });

    const token = res.data.token;
    await AsyncStorage.setItem('token', token);

    // Check if user has a budget
    const budgetRes = await axios.get('http://10.0.0.81:5000/api/budget', {
      headers: { Authorization: token }
    });

    if (budgetRes.data.exists) {
      navigation.navigate('Dashboard');
    } else {
      navigation.navigate('BudgetSetup');
    }

  } catch (err) {
    Alert.alert('Login Failed', err.response?.data?.message || 'Try again');
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} style={styles.input} />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Register Instead" onPress={() => navigation.navigate('Register')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, marginBottom: 10, padding: 10, borderRadius: 5 }
});
