import { useState } from 'react';
import { Dish } from '../types';

const useMenu = () => {
  const [dishes, setDishes] = useState<Dish[]>([]);

  const addDish = (newDish: Dish) => {
    setDishes((prevDishes) => [...prevDishes, newDish]);
  };

  const updateDish = (updatedDish: Dish) => {
    setDishes((prevDishes) =>
      prevDishes.map((dish) =>
        dish.id === updatedDish.id ? updatedDish : dish
      )
    );
  };

  const getDishes = () => {
    return dishes;
  };

  const getTotalDishes = () => {
    return dishes.length;
  };

  return {
    dishes,
    addDish,
    updateDish,
    getDishes,
    getTotalDishes,
  };
};

export default useMenu;