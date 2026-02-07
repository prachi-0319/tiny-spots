export type Category = 'Food' | 'Chai' | 'Thrift' | 'Art' | 'Others';

export interface Review {
  id: string;
  user: string;
  avatar: string;
  comment: string;
  rating: number;
  date: string;
}

export interface Vendor {
  id: string;
  name: string;
  type: Category;
  imageUrl: string;
  rating: number;
  description: string;
  reviews: Review[];
  // Changed back to percentage based (0-100) for custom div map
  coordinates: { x: number; y: number }; 
  address: string;
  timings: string;
}

export type Tab = 'discover' | 'map' | 'add';