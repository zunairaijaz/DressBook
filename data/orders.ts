import { Order } from '../types';
import { products } from './products';

export const orders: Order[] = [
  {
    id: 'WU88191111',
    date: 'January 22, 2024',
    datetime: '2024-01-22',
    status: 'Delivered',
    total: 193.00,
    customer: {
      name: 'Jane Doe',
      email: 'jane.doe@example.com'
    },
    items: [
      { ...products[1], quantity: 1 }, // Kettle
    ],
  },
  {
    id: 'WU88191112',
    date: 'December 5, 2023',
    datetime: '2023-12-05',
    status: 'Shipped',
    total: 349.99,
    customer: {
        name: 'John Smith',
        email: 'john.smith@example.com'
    },
    items: [
      { ...products[4], quantity: 1 }, // Headphones
    ],
  },
  {
    id: 'WU88191113',
    date: 'October 15, 2023',
    datetime: '2023-10-15',
    status: 'Processing',
    total: 420.00,
     customer: {
        name: 'Emily White',
        email: 'emily.white@example.com'
    },
    items: [
      { ...products[6], quantity: 1 }, // Dutch Oven
    ],
  },
  {
    id: 'WU88191114',
    date: 'August 1, 2023',
    datetime: '2023-08-01',
    status: 'Delivered',
    total: 1478.00,
     customer: {
        name: 'Michael Brown',
        email: 'michael.brown@example.com'
    },
    items: [
      { ...products[2], quantity: 1 }, // Aeron Chair
      { ...products[0], quantity: 1 }, // Puzzle
    ],
  },
   {
    id: 'WU88191115',
    date: 'July 12, 2023',
    datetime: '2023-07-12',
    status: 'Cancelled',
    total: 350.00,
     customer: {
        name: 'Sarah Green',
        email: 'sarah.green@example.com'
    },
    items: [
      { ...products[3], quantity: 1 }, // Vitamix
    ],
  },
];
