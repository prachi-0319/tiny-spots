
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Star, MapPin, Info, Filter, Heart } from 'lucide-react';
import { Vendor, Category } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface DiscoverProps {
  vendors: Vendor[];
  onSelectVendor: (id: string) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

const Discover: React.FC<DiscoverProps> = ({ vendors, onSelectVendor, favorites, onToggleFavorite }) => {
  const [removedIds, setRemovedIds] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');

  const filteredVendors = useMemo(() => {
    return vendors.filter(v => {
      if (removedIds.includes(v.id)) return false;
      if (activeCategory !== 'All' && v.category !== activeCategory) return false;
      return true;
    });
  }, [vendors, removedIds, activeCategory]);

  const handleSwipe = (id: string) => {
    setTimeout(() => {
        setRemovedIds(prev => [...prev, id]);
    }, 200);
  };

  const resetDeck = () => setRemovedIds([]);

  const categories: (Category | 'All')[] = ['All', 'Food', 'Chai', 'Thrift', 'Shop', 'Others'];

  return (
    <div className="w-full flex-1 flex flex-col relative bg-transparent min-h-0">
      <div className="w-full px-4 pt-2 pb-2 overflow-x-auto no-scrollbar z-10 shrink-0">
        <div className="flex gap-3">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-full border-2 border-neo-black font-bold text-sm whitespace-nowrap transition-all shadow-hard-sm ${activeCategory === cat ? 'bg-neo-black text-white' : 'bg-white text-neo-black hover:bg-gray-100'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 relative w-full max-w-sm mx-auto flex items-center justify-center p-4 flex-shrink-0">
        {filteredVendors.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center z-0 w-full py-20">
            <div className="w-24 h-24 bg-neo-teal border-2 border-neo-black rounded-full flex items-center justify-center mb-6 shadow-hard animate-bounce"><Filter size={48} className="text-white" /></div>
            <h2 className="text-2xl font-bold mb-2 text-neo-black">No Spots Found!</h2>
            <button onClick={resetDeck} className="bg-neo-orange px-6 py-3 border-2 border-neo-black shadow-hard font-bold rounded-xl active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all">Reset Deck</button>
          </div>
        ) : (
          <div className="relative w-full h-[520px] flex-shrink-0">
             <AnimatePresence>
              {filteredVendors.map((vendor, index) => {
                 const isTop = index === filteredVendors.length - 1;
                 return <Card key={vendor.id} vendor={vendor} isTop={isTop} onSwipe={() => handleSwipe(vendor.id)} onSelect={() => onSelectVendor(vendor.id)} isFavorite={favorites.includes(vendor.id)} onToggleFavorite={() => onToggleFavorite(vendor.id)} dragConstraints={{ left: -300, right: 300, top: 0, bottom: 0 }} />;
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

interface CardProps { vendor: Vendor; isTop: boolean; onSwipe: () => void; onSelect: () => void; isFavorite: boolean; onToggleFavorite: () => void; dragConstraints: any; }

const Card: React.FC<CardProps> = ({ vendor, isTop, onSwipe, onSelect, isFavorite, onToggleFavorite, dragConstraints }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  
  return (
    <motion.div
      style={{ x: isTop ? x : 0, rotate: isTop ? rotate : 0, opacity: isTop ? opacity : 1, zIndex: isTop ? 10 : 0, scale: isTop ? 1 : 0.95, gridArea: '1 / 1' }}
      drag={isTop ? 'x' : false} dragConstraints={dragConstraints} onDragEnd={(e, info) => (info.offset.x > 100 || info.offset.x < -100) && onSwipe()}
      initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: isTop ? 1 : 0.95, opacity: 1, y: 0 }}
      exit={{ x: x.get() < 0 ? -500 : 500, opacity: 0, transition: { duration: 0.3 } }}
      className="absolute inset-0 bg-white border-2 border-neo-black rounded-3xl shadow-hard overflow-hidden cursor-grab active:cursor-grabbing select-none flex flex-col"
    >
      <div className="flex-[3.75] w-full relative overflow-hidden min-h-0 bg-gray-100">
        <img src={vendor.image_url || "https://images.unsplash.com/photo-1555939594-58d7cb561ad1"} alt={vendor.name} className="w-full h-full object-cover pointer-events-none" />
        <div className="absolute top-4 right-4 z-10">
            <span className={`${CATEGORY_COLORS[vendor.category] || 'bg-gray-300'} px-3 py-1 rounded-full border-2 border-neo-black font-bold text-sm shadow-hard-sm`}>
                {vendor.category || "Spot"}
            </span>
        </div>
      </div>
      <div className="flex-[1.25] p-4 flex flex-col justify-between items-center relative bg-white min-h-0">
        <div className="w-full">
            <div className="flex justify-between items-start mb-1">
                <h2 className="text-2xl font-bold leading-tight mr-2 line-clamp-1 text-neo-black">{vendor.name}</h2>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 bg-neo-yellow px-2 py-1 rounded border-2 border-neo-black shadow-hard-sm shrink-0">
                        <span className="font-bold text-sm">{vendor.rating}</span>
                        <Star size={14} fill="currentColor" />
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }} className="w-9 h-9 flex items-center justify-center rounded-full border-2 border-neo-black hover:bg-red-50 active:scale-95 transition-all">
                        <Heart size={18} className={isFavorite ? "fill-red-500 text-red-500" : "text-neo-black"} />
                    </button>
                </div>
            </div>
            <div className="flex items-center text-gray-600">
                <MapPin size={16} className="mr-1" />
                <span className="text-sm font-medium truncate">{vendor.location || "Unknown Location"}</span>
            </div>
        </div>
        {/* mb-8 applied for bottom clearance above the floating navbar */}
        <button onClick={(e) => { e.stopPropagation(); onSelect(); }} className="w-auto px-6 py-2 mt-2 mb-2 bg-neo-teal text-white font-bold text-sm rounded-xl border-2 border-neo-black shadow-hard active:translate-y-[2px] active:translate-x-[2px] active:shadow-none flex items-center justify-center gap-2 transition-all shrink-0">
            <Info size={16} /> View Details
        </button>
      </div>
    </motion.div>
  );
};

export default Discover;
