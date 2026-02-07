import React from 'react';
import { Map as MapIcon, Compass, PlusCircle } from 'lucide-react';
import { Tab } from '../types';

interface NavbarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const navItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'discover', label: 'Discover', icon: <Compass size={24} /> },
    { id: 'map', label: 'Map', icon: <MapIcon size={24} /> },
    { id: 'add', label: 'Add Spot', icon: <PlusCircle size={24} /> },
  ];

  return (
    <nav className="bg-white border-2 border-neo-black rounded-xl shadow-hard flex justify-around p-2">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`
              flex flex-col items-center justify-center px-4 py-2 rounded-lg transition-all duration-200
              ${isActive ? 'bg-neo-yellow translate-y-[2px] shadow-none' : 'hover:bg-gray-100'}
              border-2 border-transparent ${isActive ? 'border-neo-black' : ''}
            `}
          >
            <div className={`${isActive ? 'scale-110' : ''} transition-transform`}>
                {item.icon}
            </div>
            <span className="text-xs font-bold mt-1">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default Navbar;