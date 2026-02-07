import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Star, MapPin, X, Heart, Info, Filter } from 'lucide-react';
import { Vendor, Category } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface DiscoverProps {
  vendors: Vendor[];
  onSelectVendor: (id: string) => void;
}

const Discover: React.FC<DiscoverProps> = ({ vendors, onSelectVendor }) => {
  const [removedIds, setRemovedIds] = useState<string[]>([]);
  const [swipedDirection, setSwipedDirection] = useState<'left' | 'right' | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');

  // Filter vendors based on category and removed IDs
  const filteredVendors = useMemo(() => {
    return vendors.filter(v => {
      if (removedIds.includes(v.id)) return false;
      if (activeCategory !== 'All' && v.type !== activeCategory) return false;
      return true;
    });
  }, [vendors, removedIds, activeCategory]);

  const handleSwipe = (direction: 'left' | 'right', id: string) => {
    setSwipedDirection(direction);
    setTimeout(() => {
        setRemovedIds(prev => [...prev, id]);
        setSwipedDirection(null);
    }, 200);
  };

  const resetDeck = () => {
    setRemovedIds([]);
  };

  const categories: (Category | 'All')[] = ['All', 'Food', 'Chai', 'Thrift', 'Art', 'Others'];

  return (
    <div className="w-full h-full flex flex-col relative bg-[#f8f8f8]">
       {/* Background Decoration */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#1A1A1A 2px, transparent 2px)', backgroundSize: '20px 20px' }}>
      </div>

      {/* Category Filter Bar */}
      <div className="w-full px-4 pt-2 pb-2 overflow-x-auto no-scrollbar z-10 shrink-0">
        <div className="flex gap-3">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`
                px-4 py-2 rounded-full border-2 border-neo-black font-bold text-sm whitespace-nowrap transition-all shadow-hard-sm
                ${activeCategory === cat 
                  ? 'bg-neo-black text-white' 
                  : 'bg-white text-neo-black hover:bg-gray-100'}
              `}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Card Deck Container */}
      <div className="flex-1 relative w-full max-w-sm mx-auto flex items-center justify-center p-4">
        {filteredVendors.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center z-0 w-full">
            <div className="w-24 h-24 bg-neo-teal border-2 border-neo-black rounded-full flex items-center justify-center mb-6 shadow-hard animate-bounce">
                <Filter size={48} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No Spots Found!</h2>
            <p className="text-gray-600 mb-6 px-8">Try changing the category filter or reset the deck to see more gems.</p>
            <button 
              onClick={resetDeck}
              className="bg-neo-orange px-6 py-3 border-2 border-neo-black shadow-hard font-bold rounded-xl active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all"
            >
              Reset Deck
            </button>
          </div>
        ) : (
          <div className="relative w-full h-full max-h-[600px]">
             <AnimatePresence>
              {filteredVendors.map((vendor, index) => {
                 // Only render the top 2 cards for performance
                 const distanceFromTop = filteredVendors.length - 1 - index;
                 if (distanceFromTop > 1) return null;
                 
                 const isTop = index === filteredVendors.length - 1;
                 
                 return (
                   <Card
                     key={vendor.id}
                     vendor={vendor}
                     isTop={isTop}
                     onSwipe={(dir) => handleSwipe(dir, vendor.id)}
                     onSelect={() => onSelectVendor(vendor.id)}
                     dragConstraints={{ left: -300, right: 300, top: 0, bottom: 0 }}
                   />
                 );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Controls (Visual Only) */}
      <div className="h-16 shrink-0 flex justify-center gap-8 pointer-events-none pb-2">
        <div className={`
             w-14 h-14 bg-white border-2 border-neo-black rounded-full flex items-center justify-center shadow-hard
             transition-transform duration-200
             ${swipedDirection === 'left' ? 'scale-125 bg-red-100' : ''}
        `}>
             <X size={28} className="text-red-500" />
        </div>
        <div className={`
             w-14 h-14 bg-white border-2 border-neo-black rounded-full flex items-center justify-center shadow-hard
             transition-transform duration-200
             ${swipedDirection === 'right' ? 'scale-125 bg-green-100' : ''}
        `}>
             <Heart size={28} className="text-green-500 fill-green-500" />
        </div>
      </div>
    </div>
  );
};

interface CardProps {
  vendor: Vendor;
  isTop: boolean;
  onSwipe: (dir: 'left' | 'right') => void;
  onSelect: () => void;
  dragConstraints: any;
}

const Card: React.FC<CardProps> = ({ vendor, isTop, onSwipe, onSelect, dragConstraints }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  
  const leftColor = useTransform(x, [-150, 0], [1, 0]);
  const rightColor = useTransform(x, [0, 150], [0, 1]);

  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.x > 100) {
      onSwipe('right');
    } else if (info.offset.x < -100) {
      onSwipe('left');
    }
  };

  return (
    <motion.div
      style={{ 
        x: isTop ? x : 0, 
        rotate: isTop ? rotate : 0, 
        opacity: isTop ? opacity : 1,
        zIndex: isTop ? 10 : 0,
        scale: isTop ? 1 : 0.95,
        gridArea: '1 / 1'
      }}
      drag={isTop ? 'x' : false}
      dragConstraints={dragConstraints}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: isTop ? 1 : 0.95, opacity: 1, y: 0 }}
      exit={{ x: x.get() < 0 ? -500 : 500, opacity: 0, transition: { duration: 0.3 } }}
      className="absolute inset-0 bg-white border-2 border-neo-black rounded-3xl shadow-hard overflow-hidden cursor-grab active:cursor-grabbing select-none flex flex-col"
    >
      {isTop && (
         <>
           <motion.div style={{ opacity: rightColor }} className="absolute inset-0 bg-green-400 mix-blend-multiply z-20 pointer-events-none" />
           <motion.div style={{ opacity: leftColor }} className="absolute inset-0 bg-red-400 mix-blend-multiply z-20 pointer-events-none" />
         </>
      )}

      {/* Image Section - Flexible height */}
      <div className="flex-[3] w-full relative overflow-hidden min-h-0 bg-gray-100">
        <img 
            src={vendor.imageUrl} 
            alt={vendor.name} 
            className="w-full h-full object-cover pointer-events-none"
        />
        <div className="absolute top-4 right-4 z-10">
            <span className={`${CATEGORY_COLORS[vendor.type] || 'bg-gray-300'} px-3 py-1 rounded-full border-2 border-neo-black font-bold text-sm shadow-hard-sm`}>
                {vendor.type}
            </span>
        </div>
      </div>

      {/* Content Section - Flexible height with scrollable description */}
      <div className="flex-[2] p-4 flex flex-col justify-between relative bg-white min-h-0">
        <div className="overflow-hidden flex flex-col h-full">
            <div className="flex justify-between items-start mb-1 shrink-0">
                <h2 className="text-xl font-bold leading-tight mr-2 line-clamp-1">{vendor.name}</h2>
                <div className="flex items-center gap-1 bg-neo-yellow px-2 py-1 rounded border-2 border-neo-black shadow-hard-sm shrink-0">
                    <span className="font-bold text-sm">{vendor.rating}</span>
                    <Star size={14} fill="currentColor" />
                </div>
            </div>
            
            <div className="flex items-center text-gray-600 mb-2 shrink-0">
                <MapPin size={16} className="mr-1" />
                <span className="text-xs font-medium truncate">{vendor.address}</span>
            </div>

            <div className="overflow-y-auto pr-1">
                <p className="text-gray-700 text-sm leading-relaxed">
                    {vendor.description}
                </p>
                <p className="text-xs font-bold text-neo-teal mt-2">
                    Open: {vendor.timings}
                </p>
            </div>
        </div>

        <button 
            onClick={(e) => { e.stopPropagation(); onSelect(); }}
            className="w-full mt-3 bg-neo-teal text-white font-bold py-3 rounded-xl border-2 border-neo-black shadow-hard active:translate-y-[2px] active:translate-x-[2px] active:shadow-none flex items-center justify-center gap-2 transition-all shrink-0"
        >
            <Info size={20} />
            View Details
        </button>
      </div>
    </motion.div>
  );
};

export default Discover;