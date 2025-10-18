import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface DishItemProps {
  name: string;
  description: string;
  course: 'starter' | 'main' | 'dessert';
  price: number;
}

const DishItem: React.FC<DishItemProps> = ({ name, description, course, price }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.description}>{description}</Text>
      <Text style={styles.course}>{course.charAt(0).toUpperCase() + course.slice(1)}</Text>
      <Text style={styles.price}>${price.toFixed(2)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  course: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  price: {
    fontSize: 16,
    color: '#000',
  },
});

export default DishItem;