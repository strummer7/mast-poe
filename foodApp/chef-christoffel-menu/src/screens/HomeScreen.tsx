import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useMenu } from '../hooks/useMenu';
import DishItem from '../components/DishItem';

const HomeScreen = () => {
  const { menuItems } = useMenu();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>
        Total Menu Items: {menuItems.length}
      </Text>
      <FlatList
        data={menuItems}
        renderItem={({ item }) => <DishItem dish={item} />}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default HomeScreen;