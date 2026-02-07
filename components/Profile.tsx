import React, { useState } from 'react';
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

  const favoriteVendors = vendors.filter(v => favorites.includes(v.id));

  const handleSave = () => {
    onUpdateUser({
      ...user,
      ...formData
    });
    setIsEditing(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="absolute inset-0 z-50 bg-[#f8f8f8] flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 pb-2 flex justify-between items-center bg-white border-b-2 border-neo-black shrink-0">
        <h2 className="text-2xl font-bold">My Account</h2>
        <button 
          onClick={onClose}
          className="w-10 h-10 bg-neo-yellow border-2 border-neo-black rounded-full flex items-center justify-center shadow-hard hover:bg-yellow-400 active:shadow-none active:translate-y-[2px] transition-all"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* User Card */}
        <div className="bg-white border-2 border-neo-black rounded-3xl p-6 shadow-hard mb-8 flex flex-col items-center relative">
            <button 
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className="absolute top-4 right-4 p-2 bg-gray-100 rounded-lg border-2 border-neo-black hover:bg-neo-teal hover:text-white transition-colors"
            >
                {isEditing ? <Check size={16} /> : <Edit2 size={16} />}
            </button>

            <div className="w-24 h-24 bg-neo-teal rounded-full border-2 border-neo-black mb-4 overflow-hidden shadow-hard-sm">
                <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            </div>

            {isEditing ? (
                <div className="w-full space-y-3">
                     <input 
                        className="w-full text-center font-bold text-xl border-b-2 border-neo-black focus:outline-none focus:border-neo-orange bg-white text-gray-900 pb-1"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Name"
                     />
                     <input 
                        className="w-full text-center text-sm font-medium text-gray-500 border-b-2 border-neo-black focus:outline-none focus:border-neo-orange bg-white text-gray-900 pb-1"
                        value={formData.pronouns}
                        onChange={(e) => setFormData({...formData, pronouns: e.target.value})}
                        placeholder="Pronouns"
                     />
                     <input 
                        className="w-full text-center text-xs text-gray-400 border-b-2 border-neo-black focus:outline-none focus:border-neo-orange bg-white text-gray-900 pb-1"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="Email"
                     />
                </div>
            ) : (
                <>
                    <h3 className="text-xl font-bold">{user.name}</h3>
                    <p className="text-gray-500 font-medium text-sm">{user.pronouns}</p>
                    <p className="text-gray-400 text-xs mt-1">{user.email}</p>
                </>
            )}
        </div>

        {/* Favorites Section */}
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Heart className="fill-red-500 text-red-500" size={24} />
            Your Favorites ({favorites.length})
        </h3>

        {favoriteVendors.length === 0 ? (
            <div className="text-center py-10 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300">
                <p className="text-gray-500 font-bold">No favorites yet!</p>
                <p className="text-xs text-gray-400 mt-1">Go explore and heart some spots.</p>
            </div>
        ) : (
            <div className="space-y-4 pb-20">
                {favoriteVendors.map(vendor => (
                    <div 
                        key={vendor.id}
                        onClick={() => {
                            // Open modal but DON'T close profile. Modal z-index is higher.
                            onSelectVendor(vendor.id);
                        }}
                        className="bg-white border-2 border-neo-black rounded-xl p-3 shadow-hard-sm flex gap-3 cursor-pointer hover:bg-gray-50 active:scale-95 transition-all"
                    >
                        <img src={vendor.imageUrl} alt={vendor.name} className="w-20 h-20 rounded-lg object-cover border-2 border-neo-black shrink-0" />
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                                <h4 className="font-bold truncate">{vendor.name}</h4>
                                <span className={`${CATEGORY_COLORS[vendor.type]} text-[10px] px-2 py-0.5 rounded-full border border-neo-black font-bold`}>
                                    {vendor.type}
                                </span>
                            </div>
                            <div className="flex items-center text-gray-500 text-xs mt-1 mb-2">
                                <MapPin size={12} className="mr-1" />
                                <span className="truncate">{vendor.address}</span>
                            </div>
                            <div className="flex text-neo-orange">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={12} className={i < Math.round(vendor.rating) ? "fill-current" : "text-gray-200 fill-gray-200"} />
                                ))}
                            </div>
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