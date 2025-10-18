export interface Dish {
  id: string;
  name: string;
  description: string;
  course: 'starter' | 'main' | 'dessert';
  price: number;
}

export interface Menu {
  dishes: Dish[];
  totalItems: number;
}