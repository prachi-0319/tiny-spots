
import { Vendor, User } from './types';

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Alex Explorer',
  email: 'alex@tinyspots.com',
  pronouns: 'they/them',
  avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix'
};

export const INITIAL_VENDORS: Vendor[] = [
  {
    id: '1',
    name: "Raju's Chai Station",
    category: 'Chai',
    image_url: 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?q=80&w=2070&auto=format&fit=crop',
    rating: 4.8,
    description: "The best masala chai in the city. Served in traditional clay cups with a side of spicy bun maska.",
    coordinates: { x: 25, y: 30 },
    location: "Corner of 4th St & Main",
    timings: "6am - 8pm",
    reviews: []
  }
];

export const CATEGORY_COLORS: Record<string, string> = {
  'Food': 'bg-neo-orange',
  'Chai': 'bg-rose-400',
  'Thrift': 'bg-neo-teal',
  'Shop': 'bg-purple-400',
  'Others': 'bg-neo-yellow'
};
