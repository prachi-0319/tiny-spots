export type Category = 'Food' | 'Chai' | 'Thrift' | 'Shop' | 'Others';

export interface User {
  id: string;
  name: string;
  email: string;
  pronouns: string;
  avatarUrl: string; // Changed from avatarSeed to match DB 'avatar_url'
  favorites?: string[]; // Array of Vendor IDs
  password?: string; // Only used for Auth logic
}

export interface Review {
  id: string;
  user: string;
  avatar: string;
  comment: string;
  rating: number;
  date: string;
  vendor_id?: string; // For Supabase relation
}

export interface Vendor {
  id: string;
  name: string;
  type: Category;
  imageUrl: string;
  rating: number;
  description: string;
  reviews: Review[];
  // Percentage based (0-100) for custom div map
  coordinates: { x: number; y: number }; 
  address: string;
  timings: string;
}

export type Tab = 'discover' | 'map' | 'add';