import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Button, Picker } from 'react-native';

const DishForm = ({ onAddDish }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('starters');
  const [price, setPrice] = useState('');

  const handleSubmit = () => {
    if (name && description && price) {
      onAddDish({ name, description, course, price });
      setName('');
      setDescription('');
      setCourse('starters');
      setPrice('');
    }
  };

  return (
    <View style={styles.form}>
      <Text style={styles.label}>Dish Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
      />
      <Text style={styles.label}>Course</Text>
      <Picker
        selectedValue={course}
        style={styles.picker}
        onValueChange={(itemValue) => setCourse(itemValue)}
      >
        <Picker.Item label="Starters" value="starters" />
        <Picker.Item label="Mains" value="mains" />
        <Picker.Item label="Desserts" value="desserts" />
      </Picker>
      <Text style={styles.label}>Price</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <Button title="Add Dish" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    padding: 20,
  },
  label: {
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  picker: {
    height: 50,
    width: '100%',
  },
});

export default DishForm;