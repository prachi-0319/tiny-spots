import { Vendor } from './types';

export const INITIAL_VENDORS: Vendor[] = [
  {
    id: '1',
    name: "Raju's Chai Station",
    type: 'Chai',
    imageUrl: 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?q=80&w=2070&auto=format&fit=crop',
    rating: 4.8,
    description: "The best masala chai in the city. Served in traditional clay cups with a side of spicy bun maska.",
    coordinates: { x: 25, y: 30 },
    address: "Corner of 4th St & Main",
    timings: "Mon-Sat: 6am - 8pm",
    reviews: [
      { id: 'r1', user: 'Anya', avatar: 'https://i.pravatar.cc/150?u=a', comment: 'Spicy and perfect!', rating: 5 },
      { id: 'r2', user: 'Dev', avatar: 'https://i.pravatar.cc/150?u=b', comment: 'Crowded but worth it.', rating: 4 }
    ]
  },
  {
    id: '2',
    name: "Grandma's Knitwear",
    type: 'Thrift',
    imageUrl: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=2005&auto=format&fit=crop',
    rating: 4.5,
    description: "Hand-knitted scarves and beanies made with love. Find me under the big banyan tree.",
    coordinates: { x: 65, y: 55 },
    address: "Under the Banyan Tree, Park Lane",
    timings: "Wed-Sun: 10am - 5pm",
    reviews: [
      { id: 'r3', user: 'Liam', avatar: 'https://i.pravatar.cc/150?u=c', comment: 'So cozy.', rating: 5 }
    ]
  },
  {
    id: '3',
    name: "Midnight Tacos",
    type: 'Food',
    imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=1980&auto=format&fit=crop',
    rating: 4.9,
    description: "Spicy street tacos that only open after 10 PM. The salsa verde is legendary.",
    coordinates: { x: 80, y: 20 },
    address: "Night Market Alley, Stall 42",
    timings: "Daily: 10pm - 4am",
    reviews: [
      { id: 'r4', user: 'Sara', avatar: 'https://i.pravatar.cc/150?u=d', comment: 'Life changing tacos.', rating: 5 },
      { id: 'r5', user: 'Mike', avatar: 'https://i.pravatar.cc/150?u=e', comment: 'A bit too spicy for me.', rating: 4 }
    ]
  },
  {
    id: '4',
    name: "Abstract Street Art",
    type: 'Art',
    imageUrl: 'https://images.unsplash.com/photo-1549833772-5b96792bdf27?q=80&w=2070&auto=format&fit=crop',
    rating: 4.2,
    description: "Live spray painting sessions and custom canvas shoes. Bring your own shoes for a discount!",
    coordinates: { x: 35, y: 75 },
    address: "Behind the Old Cinema",
    timings: "Sat-Sun: 12pm - 8pm",
    reviews: [
      { id: 'r6', user: 'Zoe', avatar: 'https://i.pravatar.cc/150?u=f', comment: 'Love my new kicks!', rating: 5 }
    ]
  },
  {
    id: '5',
    name: "Bao Bun Cart",
    type: 'Food',
    imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=2229&auto=format&fit=crop',
    rating: 4.7,
    description: "Fluffy, steamed buns with savory fillings. The pork belly option sells out by 2 PM.",
    coordinates: { x: 50, y: 40 },
    address: "Financial District Plaza",
    timings: "Mon-Fri: 11am - 3pm",
    reviews: [
      { id: 'r7', user: 'Ken', avatar: 'https://i.pravatar.cc/150?u=g', comment: 'Softest buns ever.', rating: 5 }
    ]
  }
];

export const CATEGORY_COLORS: Record<string, string> = {
  'Food': 'bg-neo-orange',
  'Chai': 'bg-rose-400',
  'Thrift': 'bg-neo-teal',
  'Art': 'bg-purple-400',
  'Others': 'bg-neo-yellow'
};