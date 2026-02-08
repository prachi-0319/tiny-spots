
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { Vendor } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface MapProps { vendors: Vendor[]; onSelectVendor: (id: string) => void; }

const Map: React.FC<MapProps> = ({ vendors, onSelectVendor }) => {
  const constraintsRef = useRef(null);
  return (
    <div className="w-full h-full bg-[#E5E0D8] relative overflow-hidden cursor-move touch-none" ref={constraintsRef}>
      <motion.div drag dragConstraints={{ left: -200, right: 0, top: -200, bottom: 0 }} className="w-[150%] h-[150%] relative -left-[25%] -top-[25%]">
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: `linear-gradient(#1A1A1A 1px, transparent 1px), linear-gradient(90deg, #1A1A1A 1px, transparent 1px)`, backgroundSize: '40px 40px' }}></div>
          {vendors.map((vendor, index) => {
            if (!vendor || !vendor.coordinates) return null;
            return (
              <motion.div key={vendor.id} className="absolute z-10 flex flex-col items-center cursor-pointer group" style={{ left: `${vendor.coordinates.x}%`, top: `${vendor.coordinates.y}%` }}
                initial={{ scale: 0, y: 20 }} animate={{ scale: 1, y: 0 }} transition={{ delay: index * 0.1, type: 'spring' }} whileHover={{ scale: 1.2, y: -10 }} onClick={() => onSelectVendor(vendor.id)}>
                <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 bg-white border-2 border-neo-black px-2 py-1 rounded shadow-hard whitespace-nowrap z-20 pointer-events-none transition-opacity">
                  <span className="font-bold text-xs">{vendor.name}</span>
                  <div className={`w-2 h-2 rounded-full mt-1 ${CATEGORY_COLORS[vendor.category]} inline-block ml-1 border border-black`}></div>
                </div>
                <div className={`${CATEGORY_COLORS[vendor.category]} p-2 rounded-full border-2 border-neo-black shadow-hard group-active:shadow-none group-active:translate-y-[2px] transition-all`}><MapPin size={24} className="text-neo-black" /></div>
              </motion.div>
            );
          })}
      </motion.div>
    </div>
  );
};

export default Map;
