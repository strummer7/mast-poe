import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { Dish } from '../types';
import DishItem from './DishItem';

interface DishListProps {
  dishes: Dish[];
}

const DishList: React.FC<DishListProps> = ({ dishes }) => {
  return (
    <View>
      <Text>Total Menu Items: {dishes.length}</Text>
      <FlatList
        data={dishes}
        renderItem={({ item }) => <DishItem dish={item} />}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default DishList;