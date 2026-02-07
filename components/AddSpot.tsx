import React, { useState, useRef } from 'react';
import { Camera, MapPin, Check, Clock, Upload } from 'lucide-react';
import { Vendor, Category } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface AddSpotProps {
  onAddVendor: (vendor: Vendor) => void;
}

const AddSpot: React.FC<AddSpotProps> = ({ onAddVendor }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Food' as Category,
    description: '',
    location: '',
    timings: '',
    imageUrl: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) return;

    const newVendor: Vendor = {
        id: Date.now().toString(),
        name: formData.name,
        type: formData.category,
        description: formData.description,
        address: formData.location,
        timings: formData.timings || "9am - 9pm",
        rating: 5.0,
        reviews: [],
        imageUrl: formData.imageUrl,
        coordinates: { x: Math.random() * 80 + 10, y: Math.random() * 70 + 15 }
    };
    onAddVendor(newVendor);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const url = URL.createObjectURL(e.target.files[0]);
        setFormData({ ...formData, imageUrl: url });
    }
  };

  const handleFakeUpload = () => {
    setFormData({...formData, imageUrl: `https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=1000&random=${Date.now()}`});
  };

  const categories = Object.keys(CATEGORY_COLORS) as Category[];

  return (
    <div className="w-full h-full overflow-y-auto p-6 pb-24">
      <h2 className="text-3xl font-bold mb-6">Found a <span className="text-neo-teal">Gem?</span></h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Input */}
        <div className="space-y-2">
            <label className="font-bold text-lg">Spot Name</label>
            <input 
                required
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g. Aunty's Momos" 
                className="w-full p-4 bg-white border-2 border-neo-black rounded-xl shadow-hard focus:outline-none focus:bg-neo-yellow focus:ring-0 transition-colors placeholder:text-gray-400 font-medium"
            />
        </div>

        {/* Category Dropdown */}
        <div className="space-y-2">
            <label className="font-bold text-lg">Category</label>
            <div className="grid grid-cols-3 gap-3">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        type="button"
                        onClick={() => setFormData({...formData, category: cat})}
                        className={`
                            py-2 px-1 border-2 border-neo-black rounded-lg text-sm font-bold shadow-sm transition-all
                            ${formData.category === cat ? `${CATEGORY_COLORS[cat]} shadow-hard transform -translate-y-1` : 'bg-white hover:bg-gray-100'}
                        `}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>

        {/* Location Input */}
        <div className="space-y-2">
            <label className="font-bold text-lg">Where is it?</label>
            <div className="relative">
                <input 
                    required
                    type="text" 
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="Near the old post office..." 
                    className="w-full p-4 pr-12 bg-white border-2 border-neo-black rounded-xl shadow-hard focus:outline-none focus:bg-neo-yellow transition-colors font-medium"
                />
                <MapPin className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
        </div>

         {/* Timings Input */}
         <div className="space-y-2">
            <label className="font-bold text-lg">When is it open?</label>
            <div className="relative">
                <input 
                    required
                    type="text" 
                    value={formData.timings}
                    onChange={(e) => setFormData({...formData, timings: e.target.value})}
                    placeholder="e.g. Mon-Sat: 10am - 9pm" 
                    className="w-full p-4 pr-12 bg-white border-2 border-neo-black rounded-xl shadow-hard focus:outline-none focus:bg-neo-yellow transition-colors font-medium"
                />
                <Clock className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
        </div>

        {/* Description Input */}
        <div className="space-y-2">
            <label className="font-bold text-lg">Why is it cool?</label>
            <textarea 
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Best spicy chutney in town..." 
                className="w-full p-4 bg-white border-2 border-neo-black rounded-xl shadow-hard focus:outline-none focus:bg-neo-yellow transition-colors resize-none font-medium"
            />
        </div>

        {/* Photo Input (Required) */}
        <div className="space-y-2">
            <label className="font-bold text-lg">Photo <span className="text-red-500">*</span></label>
            <div className="flex gap-2 items-stretch h-14">
                <input 
                    type="file" 
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                />
                <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 bg-white border-2 border-neo-black rounded-xl shadow-hard hover:bg-gray-50 active:shadow-none active:translate-y-[2px] transition-all flex items-center justify-center gap-2 font-bold"
                >
                    <Upload size={20} />
                    {formData.imageUrl ? "Change Photo" : "Upload Photo"}
                </button>
                <button 
                    type="button"
                    onClick={handleFakeUpload}
                    className="bg-neo-yellow border-2 border-neo-black rounded-xl px-4 font-bold text-xs shadow-hard hover:bg-yellow-300 active:shadow-none active:translate-y-[2px] transition-all"
                >
                    Gen Random
                </button>
            </div>
             {/* Preview */}
             {formData.imageUrl && (
                <div className="mt-2 w-full h-32 rounded-xl border-2 border-neo-black overflow-hidden relative">
                    <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 bg-neo-teal text-white text-xs font-bold px-2 py-1 rounded border border-neo-black shadow-sm">Preview</div>
                </div>
            )}
        </div>

        {/* Submit Button */}
        <button 
            type="submit"
            disabled={!formData.imageUrl}
            className={`w-full py-4 bg-neo-orange border-2 border-neo-black rounded-xl shadow-hard text-xl font-bold flex items-center justify-center gap-2 transition-all
              ${!formData.imageUrl ? 'opacity-50 cursor-not-allowed shadow-none' : 'hover:bg-[#ff9500] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]'}
            `}
        >
            <Check size={28} strokeWidth={3} />
            Share Spot
        </button>
      </form>
    </div>
  );
};

export default AddSpot;