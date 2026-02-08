
import React, { useState, useRef } from 'react';
import { MapPin, Check, Clock, Upload, Info } from 'lucide-react';
import { Category } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface AddSpotProps { onAddVendor: (vendor: any) => void; }

const AddSpot: React.FC<AddSpotProps> = ({ onAddVendor }) => {
  const [formData, setFormData] = useState({ 
    name: '', 
    category: 'Food' as Category, 
    description: '', 
    location: '', 
    timings: '', 
    image_url: '' 
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddVendor(formData);
  };

  const handleFakeUpload = () => setFormData({...formData, image_url: `https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=1000&random=${Date.now()}`});

  const categories = Object.keys(CATEGORY_COLORS) as Category[];

  return (
    <div className="w-full h-full overflow-y-auto p-6 pb-32 no-scrollbar">
      <h2 className="text-3xl font-bold mb-6">Found a <span className="text-neo-teal">Gem?</span></h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="font-bold text-lg flex items-center gap-2 mb-2"><Info size={20} /> Spot Name</label>
          <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Aunty's Momos" className="w-full p-4 bg-white text-neo-black border-2 border-neo-black rounded-xl shadow-hard outline-none" />
        </div>
        
        <div>
          <label className="font-bold text-lg mb-2 block">Category</label>
          <div className="grid grid-cols-3 gap-3">
            {categories.map(cat => (
              <button key={cat} type="button" onClick={() => setFormData({...formData, category: cat})} className={`py-2 px-1 border-2 border-neo-black rounded-lg text-sm font-bold transition-all ${formData.category === cat ? `${CATEGORY_COLORS[cat]} shadow-hard transform -translate-y-1` : 'bg-white'}`}>{cat}</button>
            ))}
          </div>
        </div>

        <div>
          <label className="font-bold text-lg flex items-center gap-2 mb-2"><MapPin size={20} /> Location</label>
          <input required type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} placeholder="Street name or landmark..." className="w-full p-4 bg-white text-neo-black border-2 border-neo-black rounded-xl shadow-hard outline-none" />
        </div>

        <div>
          <label className="font-bold text-lg flex items-center gap-2 mb-2"><Clock size={20} /> Timings</label>
          <input required type="text" value={formData.timings} onChange={(e) => setFormData({...formData, timings: e.target.value})} placeholder="e.g. 10am - 8pm" className="w-full p-4 bg-white text-neo-black border-2 border-neo-black rounded-xl shadow-hard outline-none" />
        </div>

        <div>
          <label className="font-bold text-lg flex items-center gap-2 mb-2">Description</label>
          <textarea required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="What makes this spot special?" rows={3} className="w-full p-4 bg-white text-neo-black border-2 border-neo-black rounded-xl shadow-hard outline-none resize-none" />
        </div>

        <div>
          <label className="font-bold text-lg mb-2 block">Photo URL <span className="text-red-500">*</span></label>
          <div className="flex gap-2 h-14">
            <input required type="text" value={formData.image_url} onChange={(e) => setFormData({...formData, image_url: e.target.value})} placeholder="Paste image link" className="flex-1 p-3 bg-white text-neo-black border-2 border-neo-black rounded-xl shadow-hard text-xs outline-none" />
            <button type="button" onClick={handleFakeUpload} className="bg-neo-yellow border-2 border-neo-black rounded-xl px-4 font-bold text-xs shadow-hard active:translate-y-[2px] transition-all">Random</button>
          </div>
        </div>

        <button type="submit" className="w-full py-4 bg-neo-orange border-2 border-neo-black rounded-xl shadow-hard text-xl font-bold flex items-center justify-center gap-2 hover:bg-orange-400 active:translate-y-[2px] active:shadow-none transition-all">
          <Check size={28} /> Share Spot
        </button>
      </form>
    </div>
  );
};

export default AddSpot;
