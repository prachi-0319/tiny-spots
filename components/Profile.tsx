
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { X, Heart, MapPin, Edit2, Check, Star } from 'lucide-react';
import { Vendor, User } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface ProfileProps {
  user: User;
  onUpdateUser: (user: User) => void;
  onClose: () => void;
  favorites: string[];
  vendors: Vendor[];
  onSelectVendor: (id: string) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser, onClose, favorites, vendors, onSelectVendor }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    pronouns: user.pronouns,
    email: user.email
  });

  // FIX: Use robust comparison for ID types (Number vs String) to ensure list displays correctly
  const favoriteVendors = useMemo(() => {
    return vendors.filter(v => 
      favorites.some(favId => String(favId) === String(v.id))
    );
  }, [vendors, favorites]);

  const handleSave = () => {
    onUpdateUser({ ...user, ...formData });
    setIsEditing(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="absolute inset-0 z-50 bg-[#f8f8f8] flex flex-col overflow-hidden"
    >
      <div className="p-6 pb-2 flex justify-between items-center bg-white border-b-2 border-neo-black shrink-0">
        <h2 className="text-2xl font-bold">My Account</h2>
        <button onClick={onClose} className="w-10 h-10 bg-neo-yellow border-2 border-neo-black rounded-full flex items-center justify-center shadow-hard hover:bg-yellow-400 transition-all"><X size={20} /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
        <div className="bg-white border-2 border-neo-black rounded-3xl p-6 shadow-hard mb-8 flex flex-col items-center relative">
            <button onClick={() => isEditing ? handleSave() : setIsEditing(true)} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-lg border-2 border-neo-black hover:bg-neo-teal hover:text-white transition-colors">
                {isEditing ? <Check size={16} /> : <Edit2 size={16} />}
            </button>
            <div className="w-24 h-24 bg-neo-teal rounded-full border-2 border-neo-black mb-4 overflow-hidden shadow-hard-sm">
                <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            {isEditing ? (
                <div className="w-full space-y-3">
                     <input className="w-full text-center font-bold text-xl border-b-2 border-neo-black focus:outline-none bg-white text-neo-black" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                     <input className="w-full text-center text-sm border-b-2 border-neo-black focus:outline-none bg-white text-neo-black" value={formData.pronouns} onChange={(e) => setFormData({...formData, pronouns: e.target.value})} />
                </div>
            ) : (
                <div className="text-center">
                    <h3 className="text-xl font-bold text-neo-black">{user.name}</h3>
                    <p className="text-gray-500 font-medium text-sm">{user.pronouns}</p>
                    {/* RESTORED: Email address field */}
                    <p className="text-stone-500 text-xs mt-1 lowercase font-medium">{user.email}</p>
                </div>
            )}
        </div>

        {/* HEADER FIX: Always use calculated favoriteVendors.length for consistency */}
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Heart className="fill-red-500 text-red-500" size={24} /> 
            Favorites ({favoriteVendors.length})
        </h3>

        {favoriteVendors.length === 0 ? (
            <div className="text-center py-10 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300">
                <p className="text-gray-500 font-bold">No favorites yet!</p>
            </div>
        ) : (
            <div className="space-y-4 pb-20">
                {favoriteVendors.map(vendor => (
                    <div key={vendor.id} onClick={() => { onSelectVendor(vendor.id); onClose(); }} className="bg-white border-2 border-neo-black rounded-xl p-3 shadow-hard-sm flex gap-3 cursor-pointer hover:bg-gray-50 transition-all">
                        <img src={vendor.image_url} alt={vendor.name} className="w-20 h-20 rounded-lg object-cover border-2 border-neo-black shrink-0" />
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <div className="flex justify-between items-start">
                                <h4 className="font-bold truncate">{vendor.name}</h4>
                                <span className={`${CATEGORY_COLORS[vendor.category]} text-[10px] px-2 py-0.5 rounded-full border border-neo-black font-bold`}>{vendor.category}</span>
                            </div>
                            <div className="flex items-center text-gray-500 text-xs mt-1 mb-2"><MapPin size={12} className="mr-1" /><span className="truncate">{vendor.location}</span></div>
                            <div className="flex text-neo-orange">{[...Array(5)].map((_, i) => <Star key={i} size={12} className={i < Math.round(vendor.rating) ? "fill-current" : "text-gray-200 fill-gray-200"} />)}</div>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </motion.div>
  );
};

export default Profile;
