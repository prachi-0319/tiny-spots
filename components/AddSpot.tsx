
import React, { useState, useMemo, useRef } from 'react';
import { MapPin, Check, Clock, Upload, Info, Wand2, X, Image as ImageIcon } from 'lucide-react';
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
  
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isFormValid = useMemo(() => {
    return formData.name.trim() !== '' && 
           formData.category !== undefined && 
           formData.location.trim() !== '' &&
           formData.image_url.trim() !== '';
  }, [formData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    onAddVendor(formData);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image_url: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSurpriseMe = () => {
    if (!formData.name || !formData.category) {
      alert("Please enter a Spot Name and select a Category first to generate a contextual image!");
      return;
    }
    
    setIsGenerating(true);
    // Generate a contextual prompt for Pollinations
    const prompt = `realistic photo of a ${formData.category.toLowerCase()} street food stall vendor named ${formData.name}, cinematic lighting, vibrant atmosphere`;
    const encodedPrompt = encodeURIComponent(prompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=600&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`;
    
    setFormData(prev => ({ ...prev, image_url: imageUrl }));
    
    // Simulate generation feel
    setTimeout(() => {
        setIsGenerating(false);
    }, 1000);
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image_url: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const categories = Object.keys(CATEGORY_COLORS) as Category[];

  return (
    <div className="w-full p-6 space-y-8">
      <h2 className="text-3xl font-bold">Share a <span className="text-neo-teal">Tiny Spot</span></h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Input */}
        <div>
          <label className="font-bold text-lg mb-2 flex items-center gap-2"><Info size={18} /> Spot Name</label>
          <input 
            required 
            type="text" 
            value={formData.name} 
            onChange={(e) => setFormData({...formData, name: e.target.value})} 
            placeholder="e.g. Grandma's Dumplings" 
            className="w-full p-4 bg-white border-2 border-neo-black rounded-xl shadow-hard outline-none focus:ring-2 ring-neo-teal/30"
          />
        </div>

        {/* Category Selector */}
        <div>
          <label className="font-bold text-lg mb-3 block">Category</label>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button 
                key={cat} 
                type="button" 
                onClick={() => setFormData({...formData, category: cat})} 
                className={`px-4 py-2 border-2 border-neo-black rounded-full font-bold text-sm transition-all ${formData.category === cat ? `${CATEGORY_COLORS[cat]} shadow-hard-sm -translate-y-[2px]` : 'bg-white'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Image Handling Upgrade */}
        <div>
          <label className="font-bold text-lg mb-3 flex items-center gap-2"><ImageIcon size={18} /> Add a Photo</label>
          
          {!formData.image_url ? (
            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center p-6 bg-white border-2 border-neo-black border-dashed rounded-2xl hover:bg-stone-50 transition-colors"
              >
                <Upload size={32} className="mb-2 text-neo-teal" />
                <span className="font-bold text-sm">Upload Photo</span>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
              </button>
              <button 
                type="button"
                onClick={handleSurpriseMe}
                disabled={isGenerating}
                className="flex flex-col items-center justify-center p-6 bg-neo-yellow border-2 border-neo-black rounded-2xl shadow-hard hover:bg-neo-yellow/90 transition-all active:translate-y-1 active:shadow-none"
              >
                <Wand2 size={32} className="mb-2 text-neo-black" />
                <span className="font-bold text-sm">{isGenerating ? 'Cooking...' : 'Surprise Me'}</span>
              </button>
            </div>
          ) : (
            <div className="relative w-full aspect-video border-2 border-neo-black rounded-2xl overflow-hidden shadow-hard">
                <img 
                  src={formData.image_url} 
                  alt="Spot preview" 
                  className={`w-full h-full object-cover transition-opacity duration-300 ${isGenerating ? 'opacity-50' : 'opacity-100'}`} 
                />
                <button 
                  type="button" 
                  onClick={removeImage} 
                  className="absolute top-2 right-2 p-1 bg-white border-2 border-neo-black rounded-full shadow-hard-sm hover:bg-red-50"
                >
                  <X size={20} />
                </button>
                {isGenerating && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                        <div className="w-8 h-8 border-4 border-white border-t-neo-black rounded-full animate-spin"></div>
                    </div>
                )}
            </div>
          )}
        </div>

        {/* Location & Timings */}
        <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="font-bold text-sm mb-1 flex items-center gap-2"><MapPin size={16} /> Location</label>
              <input 
                required 
                type="text" 
                value={formData.location} 
                onChange={(e) => setFormData({...formData, location: e.target.value})} 
                placeholder="Street name or landmark" 
                className="w-full p-3 bg-white border-2 border-neo-black rounded-xl outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-sm mb-1 flex items-center gap-2"><Clock size={16} /> Opening Hours</label>
              <input 
                required 
                type="text" 
                value={formData.timings} 
                onChange={(e) => setFormData({...formData, timings: e.target.value})} 
                placeholder="e.g. 9am - 9pm" 
                className="w-full p-3 bg-white border-2 border-neo-black rounded-xl outline-none"
              />
            </div>
        </div>

        {/* Description */}
        <div>
          <label className="font-bold text-sm mb-1 block">Quick Note</label>
          <textarea 
            required 
            value={formData.description} 
            onChange={(e) => setFormData({...formData, description: e.target.value})} 
            placeholder="What's the vibe? (e.g. Best chai under $1!)" 
            rows={3} 
            className="w-full p-3 bg-white border-2 border-neo-black rounded-xl outline-none resize-none"
          />
        </div>

        {/* Final Submit */}
        <button 
            type="submit" 
            disabled={!isFormValid}
            className={`w-full py-4 rounded-2xl border-2 border-neo-black font-bold text-xl shadow-hard transition-all ${isFormValid ? 'bg-neo-orange hover:bg-neo-orange/90 active:translate-y-1 active:shadow-none' : 'bg-stone-200 text-stone-400 opacity-60 cursor-not-allowed'}`}
        >
          <Check className="inline-block mr-2" size={24} /> Share Spot
        </button>
      </form>
    </div>
  );
};

export default AddSpot;
