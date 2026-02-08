
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Star, MapPin, Clock, Send, Heart } from 'lucide-react';
import { Vendor, Review } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface DetailModalProps { vendor: Vendor; onClose: () => void; onAddReview: (review: Review) => void; isFavorite: boolean; onToggleFavorite: () => void; }

const DetailModal: React.FC<DetailModalProps> = ({ vendor, onClose, onAddReview, isFavorite, onToggleFavorite }) => {
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;
    onAddReview({ id: Date.now().toString(), user: "You", avatar: "https://i.pravatar.cc/150?img=12", comment: newReviewText, rating: newReviewRating, date: "Just now" });
    setNewReviewText('');
    setNewReviewRating(5);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center pointer-events-none">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black pointer-events-auto" />
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-white w-full max-w-md h-[90vh] sm:h-[800px] sm:rounded-3xl rounded-t-3xl border-t-2 sm:border-2 border-neo-black flex flex-col pointer-events-auto overflow-hidden relative shadow-2xl">
        <div className="absolute top-4 right-4 z-20 flex gap-2">
            <button onClick={onToggleFavorite} className="w-10 h-10 bg-white border-2 border-neo-black rounded-full flex items-center justify-center shadow-hard hover:bg-red-50 transition-all"><Heart size={20} className={isFavorite ? "fill-red-500 text-red-500" : "text-neo-black"} /></button>
            <button onClick={onClose} className="w-10 h-10 bg-white border-2 border-neo-black rounded-full flex items-center justify-center shadow-hard transition-all"><X size={20} /></button>
        </div>
        <div className="h-56 relative shrink-0">
            <img src={vendor.image_url} alt={vendor.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <div>
                    <span className={`${CATEGORY_COLORS[vendor.category]} text-neo-black text-xs font-bold px-3 py-1 rounded-full border-2 border-neo-black shadow-hard-sm mb-2 inline-block`}>{vendor.category}</span>
                    <h2 className="text-2xl font-bold text-white tracking-wide">{vendor.name}</h2>
                </div>
            </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
            {/* Rating & Location Row */}
            <div className="flex gap-3">
                <div className="flex-1 bg-neo-yellow border-2 border-neo-black p-2 rounded-xl shadow-hard-sm flex flex-col items-center justify-center">
                    <div className="flex items-center gap-1 font-black text-xl">{vendor.rating} <Star size={18} fill="black" /></div>
                    <span className="text-[10px] font-bold uppercase">Rating</span>
                </div>
                <div className="flex-[2] bg-white border-2 border-neo-black p-3 rounded-xl shadow-hard-sm flex flex-col justify-center">
                     <div className="flex items-center gap-2 mb-1"><MapPin size={16} /><span className="font-bold text-sm">Location</span></div>
                     <span className="text-xs text-gray-600 truncate">{vendor.location}</span>
                </div>
            </div>

            {/* TIMINGS SECTION - Placed immediately above About */}
            <div className="w-full p-3 bg-white border-2 border-neo-black rounded-xl shadow-hard-sm flex items-center gap-3">
                <div className="w-10 h-10 bg-neo-teal/10 border-2 border-neo-black rounded-lg flex items-center justify-center shrink-0">
                    <Clock size={20} className="text-neo-teal" />
                </div>
                <div>
                    <p className="text-[10px] font-bold uppercase text-gray-400 leading-none mb-1">Open Hours</p>
                    <p className="text-sm font-bold text-neo-black">{vendor.timings || "Mon-Sun: 10am - 9pm"}</p>
                </div>
            </div>

            {/* About Section */}
            <div>
                <h3 className="font-bold text-lg mb-2">About</h3>
                <p className="text-gray-700 leading-relaxed text-sm border-l-4 border-neo-teal pl-4">{vendor.description}</p>
            </div>

            {/* Reviews Section */}
            <div>
                <h3 className="font-bold text-lg mb-4">Reviews ({vendor.reviews?.length || 0})</h3>
                <form onSubmit={handleSubmitReview} className="bg-white border-2 border-neo-black rounded-xl p-4 shadow-hard-sm mb-4">
                    <div className="flex gap-2 mb-3">
                        {[1, 2, 3, 4, 5].map(star => <button key={star} type="button" onClick={() => setNewReviewRating(star)}><Star size={20} className={star <= newReviewRating ? "fill-neo-orange text-neo-orange" : "text-gray-300"} /></button>)}
                    </div>
                    <div className="flex gap-2">
                        <input type="text" value={newReviewText} onChange={(e) => setNewReviewText(e.target.value)} placeholder="How was it?" className="flex-1 bg-white text-gray-900 border-2 border-neo-black rounded-lg px-3 py-2 text-sm outline-none" />
                        <button type="submit" disabled={!newReviewText.trim()} className="bg-neo-teal text-white p-2 rounded-lg border-2 border-neo-black shadow-hard-sm active:translate-y-[1px] disabled:opacity-50"><Send size={18} /></button>
                    </div>
                </form>

                <div className="space-y-4">
                    {vendor.reviews && vendor.reviews.map(review => (
                        <div key={review.id} className="flex gap-3 border-b border-gray-100 pb-3">
                            <img src={review.avatar} alt={review.user} className="w-8 h-8 rounded-full border border-neo-black" />
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-bold text-xs">{review.user}</span>
                                    <span className="text-[10px] text-gray-400">{review.date}</span>
                                </div>
                                <div className="flex text-neo-orange mb-1">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={10} className={i < review.rating ? "fill-current" : "text-gray-200 fill-gray-200"} />)}
                                </div>
                                <p className="text-xs text-gray-600 line-clamp-2">{review.comment}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DetailModal;
