
export type Category = 'Food' | 'Chai' | 'Thrift' | 'Shop' | 'Others';

export interface User {
  id: string;
  name: string;
  email: string;
  pronouns: string;
  avatarUrl: string;
  favorites?: string[];
  password?: string;
}

export interface Review {
  id: string;
  user: string;
  avatar: string;
  text: string; // Changed from 'comment'
  rating: number;
  date: string;
  vendor_id?: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: Category; 
  image_url: string; 
  rating: number;
  description: string;
  reviews: Review[];
  coordinates: { x: number; y: number }; 
  location: string; 
  timings: string;
}

export type Tab = 'discover' | 'map' | 'add';
