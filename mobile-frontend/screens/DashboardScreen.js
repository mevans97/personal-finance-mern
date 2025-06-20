/**
 * File: DashboardScreen.js
 * -------------------------
 * This is the main dashboard component of the personal finance mobile app.
 * It provides a multi-tabbed interface for managing and visualizing user budgets
 * and monthly expenses. The screen includes the following core features:
 * 
 * - "View Budget" tab: Displays total spending and a pie chart breakdown of budgeted categories.
 * - "Manage Budget" tab: Allows users to add, edit, and delete budget items with category selection.
 * - "Track Spending" tab: Lists all user-recorded expenses in reverse chronological order.
 * - "Manage Spending" tab: Enables users to create, view, and delete individual expenses.
 * 
 * The component also performs secure API calls using JWTs stored in AsyncStorage to
 * fetch and persist user data via a Node.js + MongoDB backend.
 * 
 * Charts are rendered using the `react-native-chart-kit` package, and dropdowns
 * are provided via `@react-native-picker/picker`. Form inputs are controlled using
 * React state, and the UI is styled with React Native's StyleSheet API.
 */

// === 📦 Imports ===
import React, { useEffect, useState } from 'react'; // Import core React hooks
import {
  View, Text, FlatList, Button, Alert, StyleSheet,
  Modal, TextInput, TouchableOpacity, ScrollView, Dimensions
} from 'react-native'; // Import common UI components from React Native
import { Picker } from '@react-native-picker/picker'; // Dropdown selector
import { PieChart } from 'react-native-chart-kit'; // Library to render pie charts
import AsyncStorage from '@react-native-async-storage/async-storage'; // Local storage for authentication tokens
import axios from 'axios'; // HTTP client for API requests

// === 🧠 Main Component ===
export default function DashboardScreen() {
  // === 📊 State Variables ===
  const [items, setItems] = useState([]); // Stores budget items
  const [expenses, setExpenses] = useState([]); // Stores expense records
  const [loading, setLoading] = useState(true); // Whether data is loading
  const [activeTab, setActiveTab] = useState('view'); // Active tab indicator

  // === 💬 New Budget Item Form State ===
  const [newName, setNewName] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState('');

  // === 📝 Edit Budget Item Modal State ===
  const [modalVisible, setModalVisible] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [editName, setEditName] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editCategory, setEditCategory] = useState('');

  // === 💸 Expense Form State ===
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('');
  const [expenseNote, setExpenseNote] = useState('');

  // Get screen width for responsive chart rendering
  const screenWidth = Dimensions.get('window').width;

  // === 🔄 Load budget and expenses when component mounts ===
  useEffect(() => {
    fetchBudget();     // Load user's budget items
    fetchExpenses();   // Load user's expenses
  }, []);

  // === 📡 API: Fetch Budget Items ===
  const fetchBudget = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get('http://10.0.0.81:5000/api/budget', {
        headers: { Authorization: token }
      });
      if (res.data.exists) {
        setItems(res.data.budget.items);
      } else {
        Alert.alert('No budget found');
      }
    } catch (err) {
      Alert.alert('Error loading budget');
    } finally {
      setLoading(false);
    }
  };

  // === 📡 API: Fetch Expense Records ===
  const fetchExpenses = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get('http://10.0.0.81:5000/api/expenses', {
        headers: { Authorization: token }
      });
      setExpenses(res.data);
    } catch (err) {
      Alert.alert('Error loading expenses');
    }
  };

  // === 📡 API: Add Budget Item ===
  const addItem = async () => {
    if (!newName || !newAmount || !newCategory) {
      Alert.alert('All fields are required');
      return;
    }
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post('http://10.0.0.81:5000/api/budget/item', {
        name: newName,
        amount: parseFloat(newAmount),
        category: newCategory
      }, { headers: { Authorization: token } });

      // Clear input and refresh
      setNewName('');
      setNewAmount('');
      setNewCategory('');
      fetchBudget();
    } catch (err) {
      Alert.alert('Error adding item');
    }
  };

  // === ✏️ Open modal to edit item ===
  const handleEdit = (item) => {
    setEditItem(item);
    setEditName(item.name);
    setEditAmount(item.amount.toString());
    setEditCategory(item.category);
    setModalVisible(true);
  };

  // === 📡 API: Save Edited Item ===
  const saveChanges = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.put(`http://10.0.0.81:5000/api/budget/${editItem._id}`, {
        name: editName,
        amount: parseFloat(editAmount),
        category: editCategory
      }, { headers: { Authorization: token } });
      setModalVisible(false);
      fetchBudget();
    } catch (err) {
      Alert.alert('Error updating item');
    }
  };

  // === 📡 API: Delete Budget Item ===
  const handleDelete = async (itemId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.delete(`http://10.0.0.81:5000/api/budget/${itemId}`, {
        headers: { Authorization: token }
      });
      fetchBudget();
    } catch (err) {
      Alert.alert('Error deleting item');
    }
  };

  // === 📡 API: Add New Expense ===
  const addExpense = async () => {
    if (!expenseAmount || !expenseCategory) {
      Alert.alert('Amount and Category required');
      return;
    }
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post('http://10.0.0.81:5000/api/expenses', {
        amount: parseFloat(expenseAmount),
        category: expenseCategory,
        note: expenseNote
      }, { headers: { Authorization: token } });

      setExpenseAmount('');
      setExpenseCategory('');
      setExpenseNote('');
      fetchExpenses();
    } catch (err) {
      Alert.alert('Error saving expense');
    }
  };

  // === 📡 API: Delete Expense ===
  const deleteExpense = async (id) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.delete(`http://10.0.0.81:5000/api/expenses/${id}`, {
        headers: { Authorization: token }
      });
      fetchExpenses();
    } catch (err) {
      Alert.alert('Error deleting expense');
    }
  };

  // === 📊 Calculate Spending Totals ===
  const totalSpending = items.reduce((sum, item) => sum + item.amount, 0);
  const categoryTotals = items.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount;
    return acc;
  }, {});

  // Prepare pie chart data
  const chartKitData = Object.entries(categoryTotals).map(([category, amount], index) => ({
    name: category,
    population: amount,
    color: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'][index % 5],
    legendFontColor: '#333',
    legendFontSize: 12
  }));

  // === 🧱 UI Rendering ===
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Your Budget</Text>

      {/* === 🔘 Tab Selection === */}
      <View style={styles.tabContainer}>
        {['view', 'manage', 'trackSpending', 'manageSpending'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={activeTab === tab ? styles.activeTabText : styles.tabText}>
              {tab === 'view' ? 'View Budget' :
               tab === 'manage' ? 'Manage Budget' :
               tab === 'trackSpending' ? 'Track Spending' : 'Manage Spending'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* === 🔄 Tab Views === */}
      {loading ? <Text>Loading...</Text> : (
        <>
          {/* 📊 View Budget Tab */}
          {activeTab === 'view' && (
            <>
              <Text style={styles.totalSpending}>Total: ${totalSpending.toFixed(2)}</Text>
              {Object.entries(categoryTotals).map(([cat, val]) => (
                <Text key={cat}>{cat}: ${val.toFixed(2)}</Text>
              ))}
              {chartKitData.length > 0 && (
                <PieChart
                  data={chartKitData}
                  width={screenWidth - 32}
                  height={220}
                  chartConfig={{
                    backgroundColor: '#fff',
                    backgroundGradientFrom: '#fff',
                    backgroundGradientTo: '#fff',
                    color: () => `rgba(0,0,0,1)`
                  }}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  absolute
                />
              )}
            </>
          )}

          {/* ✍️ Manage Budget Tab */}
          {activeTab === 'manage' && (
            <>
              <TextInput style={styles.input} placeholder="Name" value={newName} onChangeText={setNewName} />
              <TextInput style={styles.input} placeholder="Amount" value={newAmount} onChangeText={setNewAmount} keyboardType="numeric" />
              <Picker selectedValue={newCategory} onValueChange={setNewCategory} style={styles.input}>
                <Picker.Item label="Select category" value="" />
                <Picker.Item label="Food" value="Food" />
                <Picker.Item label="Housing" value="Housing" />
                <Picker.Item label="Transportation" value="Transportation" />
                <Picker.Item label="Savings" value="Savings" />
                <Picker.Item label="Other" value="Other" />
              </Picker>
              <Button title="Add Item" onPress={addItem} />
              <FlatList data={items} keyExtractor={(item) => item._id} renderItem={({ item }) => (
                <View style={styles.itemBox}>
                  <Text>{item.name} - ${item.amount} ({item.category})</Text>
                  <Button title="Edit" onPress={() => handleEdit(item)} />
                  <Button title="Delete" color="red" onPress={() => handleDelete(item._id)} />
                </View>
              )} scrollEnabled={false} />
            </>
          )}

          {/* 📆 Track Spending Tab */}
          {activeTab === 'trackSpending' && (
            <>
              <Text style={styles.sectionTitle}>Spending History</Text>
              {expenses.map(exp => (
                <View key={exp._id} style={styles.itemBox}>
                  <Text>{exp.category} - ${exp.amount}</Text>
                  <Text>{new Date(exp.date).toDateString()}</Text>
                  {exp.note && <Text>Note: {exp.note}</Text>}
                </View>
              ))}
            </>
          )}

          {/* 🧾 Manage Spending Tab */}
          {activeTab === 'manageSpending' && (
            <>
              <TextInput style={styles.input} placeholder="Amount" value={expenseAmount} onChangeText={setExpenseAmount} keyboardType="numeric" />
              <Picker selectedValue={expenseCategory} onValueChange={setExpenseCategory} style={styles.input}>
                <Picker.Item label="Select category" value="" />
                <Picker.Item label="Food" value="Food" />
                <Picker.Item label="Housing" value="Housing" />
                <Picker.Item label="Transportation" value="Transportation" />
                <Picker.Item label="Savings" value="Savings" />
                <Picker.Item label="Other" value="Other" />
              </Picker>
              <TextInput style={styles.input} placeholder="Note (optional)" value={expenseNote} onChangeText={setExpenseNote} />
              <Button title="Save Expense" onPress={addExpense} />
              {expenses.map(item => (
                <View key={item._id} style={styles.itemBox}>
                  <Text>{item.category} - ${item.amount}</Text>
                  <Text>{new Date(item.date).toDateString()}</Text>
                  <Text>{item.note}</Text>
                  <Button title="Delete" color="red" onPress={() => deleteExpense(item._id)} />
                </View>
              ))}
            </>
          )}
        </>
      )}

      {/* ✏️ Modal for editing budget items */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput value={editName} onChangeText={setEditName} placeholder="Name" style={styles.input} />
            <TextInput value={editAmount} onChangeText={setEditAmount} placeholder="Amount" keyboardType="numeric" style={styles.input} />
            <TextInput value={editCategory} onChangeText={setEditCategory} placeholder="Category" style={styles.input} />
            <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={{ textAlign: 'center', marginTop: 10, color: 'gray' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

// === 🎨 Styles ===
const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flexGrow: 1 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: { borderBottomWidth: 1, marginBottom: 10, padding: 8 },
  itemBox: { backgroundColor: '#f9f9f9', padding: 10, borderRadius: 6, marginBottom: 10 },
  tabContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', marginBottom: 20 },
  tab: { backgroundColor: '#eee', padding: 10, borderRadius: 6, margin: 5 },
  activeTab: { backgroundColor: '#007bff' },
  tabText: { color: '#333' },
  activeTabText: { color: '#fff', fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
  totalSpending: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  modalContainer: { flex: 1, justifyContent: 'center', backgroundColor: '#000000aa' },
  modalContent: { backgroundColor: '#fff', margin: 20, padding: 20, borderRadius: 10 },
  saveButton: { backgroundColor: '#007bff', padding: 10, borderRadius: 6 },
  saveButtonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});
