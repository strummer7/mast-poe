import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DishForm from '../components/DishForm';

const ChefScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Menu</Text>
      <DishForm />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default ChefScreen;