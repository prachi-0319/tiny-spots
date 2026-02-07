import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Discover from './components/Discover';
import Map from './components/Map';
import AddSpot from './components/AddSpot';
import Profile from './components/Profile';
import { INITIAL_VENDORS } from './constants';
import { Vendor, Tab, Review } from './types';
import DetailModal from './components/DetailModal';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('discover');
  const [vendors, setVendors] = useState<Vendor[]>(INITIAL_VENDORS);
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleAddVendor = (newVendor: Vendor) => {
    setVendors(prev => [newVendor, ...prev]);
    setActiveTab('discover');
  };

  const handleSelectVendor = (id: string) => {
    setSelectedVendorId(id);
  };

  const handleCloseModal = () => {
    setSelectedVendorId(null);
  };

  const handleToggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  const handleAddReview = (vendorId: string, review: Review) => {
    setVendors(prev => prev.map(v => {
      if (v.id === vendorId) {
        return {
          ...v,
          reviews: [review, ...v.reviews],
          // Recalculate rating roughly
          rating: parseFloat(((v.rating * v.reviews.length + review.rating) / (v.reviews.length + 1)).toFixed(1))
        };
      }
      return v;
    }));
  };

  const selectedVendor = vendors.find(v => v.id === selectedVendorId) || null;

  return (
    // Desktop/Laptop Layout Wrapper
    <div className="min-h-screen bg-gray-100 flex items-center justify-center sm:py-8 font-sans">
      
      {/* Mobile App Container */}
      <div className="w-full max-w-md h-screen sm:h-[850px] sm:max-h-[95vh] bg-white sm:border-2 sm:border-neo-black sm:shadow-hard sm:rounded-3xl overflow-hidden flex flex-col relative">
        
        {/* Header */}
        <header className="px-6 pt-6 pb-2 flex justify-between items-center z-20 bg-white shrink-0">
            <h1 
              className="text-3xl font-bold tracking-tight cursor-pointer select-none active:scale-95 transition-transform"
              onClick={() => setActiveTab('discover')}
            >
              tiny<span className="text-neo-orange">spots</span>.
            </h1>
            <button 
              onClick={() => setIsProfileOpen(true)}
              className="w-10 h-10 bg-neo-teal border-2 border-neo-black rounded-full shadow-hard-sm flex items-center justify-center overflow-hidden hover:scale-105 active:shadow-none active:translate-y-[2px] transition-all"
            >
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Profile" className="w-full h-full" />
            </button>
        </header>

        {/* Main Content Area - flex-1 and scrollable */}
        <main className="flex-1 relative overflow-hidden flex flex-col">
          {activeTab === 'discover' && (
            <Discover 
              vendors={vendors} 
              onSelectVendor={handleSelectVendor}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />
          )}
          {activeTab === 'map' && (
            <Map 
              vendors={vendors} 
              onSelectVendor={handleSelectVendor} 
            />
          )}
          {activeTab === 'add' && (
            <AddSpot onAddVendor={handleAddVendor} />
          )}
        </main>

        {/* Bottom Navigation */}
        <div className="p-4 pb-6 z-20 bg-white border-t-2 border-neo-black/10 shrink-0">
            <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* Profile Overlay */}
        {isProfileOpen && (
          <Profile 
            onClose={() => setIsProfileOpen(false)} 
            favorites={favorites}
            vendors={vendors}
            onSelectVendor={handleSelectVendor}
          />
        )}

        {/* Detail Modal */}
        {selectedVendor && (
          <DetailModal 
            vendor={selectedVendor} 
            onClose={handleCloseModal}
            onAddReview={(review) => handleAddReview(selectedVendor.id, review)}
          />
        )}
      </div>
    </div>
  );
};

export default App;