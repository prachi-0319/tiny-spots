import React, { useState, useEffect } from 'react';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Navbar from './components/Navbar';
import Discover from './components/Discover';
import Map from './components/Map';
import AddSpot from './components/AddSpot';
import Profile from './components/Profile';
import LandingPage from './components/LandingPage';
import { INITIAL_VENDORS, MOCK_USER } from './constants';
import { Vendor, Tab, Review, User } from './types';
import DetailModal from './components/DetailModal';

// ==========================================
// SUPABASE CONFIG
// ==========================================
const supabaseUrl = 'https://ilbhwypqiqyfavhezuic.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsYmh3eXBxaXF5ZmF2aGV6dWljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0NzY1NzQsImV4cCI6MjA4NjA1MjU3NH0.7ZHokCe1mFSiU6OncYdl2GptAP5F7oQRKuGbSiE5tu4';

// Safely initialize Supabase. 
// If the URL is the placeholder or invalid, we leave it null to trigger fallback/mock mode.
let supabase: any = null;

try {
  // Validate URL format to preventing crashing on invalid/empty URLs
  const isValidUrl = (url: string) => {
    try { return Boolean(new URL(url)); } catch (e) { return false; }
  };

  if (supabaseUrl && supabaseUrl !== 'https://ilbhwypqiqyfavhezuic.supabase.co' && isValidUrl(supabaseUrl)) {
    supabase = createClient(supabaseUrl, supabaseKey);
  } else {
    console.warn("Supabase URL not configured or invalid. Running in Mock Mode.");
  }
} catch (e) {
  console.warn("Supabase initialization failed. Running in Mock Mode.", e);
}

const App: React.FC = () => {
  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // App State
  const [activeTab, setActiveTab] = useState<Tab>('discover');
  const [vendors, setVendors] = useState<Vendor[]>([]); // Start empty
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // 1. FETCH VENDORS ON LOAD
  useEffect(() => {
    const fetchVendors = async () => {
      setIsLoading(true);
      try {
        if (!supabase) throw new Error("Mock Mode");

        const { data, error } = await supabase.from('vendors').select('*');
        if (error || !data || data.length === 0) throw error;

        // Map snake_case from DB to camelCase for App
        const mappedVendors: Vendor[] = data.map((v: any) => ({
          id: v.id,
          name: v.name,
          type: v.type,
          imageUrl: v.image_url,
          rating: v.rating,
          description: v.description,
          coordinates: v.coordinates, // Assumed stored as jsonb {x,y}
          address: v.address,
          timings: v.timings,
          reviews: [] // Reviews fetched on demand or joined if small
        }));
        setVendors(mappedVendors);
      } catch (err) {
        console.log('Using Mock Data for Vendors (Supabase disconnected or empty).');
        setVendors(INITIAL_VENDORS);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendors();
  }, []);

  // 2. FETCH REVIEWS WHEN VENDOR SELECTED
  useEffect(() => {
    if (!selectedVendorId) return;

    const fetchReviews = async () => {
        if (!supabase) return; // Keep existing mock reviews if no DB

        try {
            const { data, error } = await supabase
                .from('reviews')
                .select('*')
                .eq('vendor_id', selectedVendorId)
                .order('date', { ascending: false }); 

            if (data && !error && data.length > 0) {
                 const mappedReviews: Review[] = data.map((r: any) => ({
                    id: r.id,
                    user: r.user_name,
                    avatar: r.user_avatar,
                    comment: r.comment,
                    rating: r.rating,
                    date: r.date,
                    vendor_id: r.vendor_id
                 }));

                 setVendors(prev => prev.map(v => 
                    v.id === selectedVendorId ? { ...v, reviews: mappedReviews } : v
                 ));
            }
        } catch (err) {
            console.log("Could not fetch reviews, using default/mock.");
        }
    };

    fetchReviews();
  }, [selectedVendorId]);


  // 3. AUTHENTICATION HANDLER
  const handleAuth = async (formData: any, isLogin: boolean): Promise<boolean> => {
    try {
        let user: User | null = null;

        // --- MOCK FALLBACK (If no DB or specific demo email) ---
        if (!supabase || (isLogin && formData.email === 'test@test.com')) {
             if (isLogin) {
                 // Demo login
                 const demoUser = { ...MOCK_USER, id: 'demo-1', favorites: [] };
                 setCurrentUser(demoUser);
                 setFavorites([]);
                 return true;
             } else {
                 // Demo signup
                 const demoUser: User = {
                    id: Date.now().toString(),
                    name: formData.name,
                    email: formData.email,
                    pronouns: formData.pronouns,
                    avatarSeed: 'Felix',
                    favorites: []
                 };
                 setCurrentUser(demoUser);
                 setFavorites([]);
                 return true;
             }
        }
        
        // --- REAL DB AUTH ---
        if (isLogin) {
            // Login: Check exact match
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('email', formData.email)
                .eq('password', formData.password) // Simple check (in real app use Auth service)
                .single();
            
            if (data && !error) {
                user = {
                    id: data.id,
                    name: data.name,
                    email: data.email,
                    pronouns: data.pronouns,
                    avatarSeed: data.avatar_seed,
                    favorites: data.favorites || []
                };
            }
        } else {
            // Signup: Insert new user
            const newUser = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                pronouns: formData.pronouns || 'they/them',
                avatar_seed: Math.random().toString(36).substring(7),
                favorites: []
            };

            const { data, error } = await supabase
                .from('users')
                .insert([newUser])
                .select()
                .single();
            
            if (data && !error) {
                 user = {
                    id: data.id,
                    name: data.name,
                    email: data.email,
                    pronouns: data.pronouns,
                    avatarSeed: data.avatar_seed,
                    favorites: []
                };
            }
        }

        if (user) {
            setCurrentUser(user);
            setFavorites(user.favorites || []);
            return true;
        } 
        
        return false;
    } catch (err) {
        console.error("Auth error", err);
        return false;
    }
  };


  const handleUpdateUser = async (updatedUser: User) => {
    setCurrentUser(updatedUser);
    
    if (!supabase) return;

    // Persist to Supabase
    try {
        await supabase.from('users').update({
            name: updatedUser.name,
            pronouns: updatedUser.pronouns
        }).eq('id', updatedUser.id);
    } catch (e) { /* Ignore fallback */ }
  };

  const handleAddVendor = async (newVendor: Vendor) => {
    // Optimistic Update
    setVendors(prev => [newVendor, ...prev]);
    setActiveTab('discover');

    if (!supabase) return;

    // Persist to DB
    try {
        await supabase.from('vendors').insert([{
            name: newVendor.name,
            type: newVendor.type,
            image_url: newVendor.imageUrl,
            rating: newVendor.rating,
            description: newVendor.description,
            coordinates: newVendor.coordinates,
            address: newVendor.address,
            timings: newVendor.timings
        }]);
    } catch (e) { console.warn("Could not save vendor to DB"); }
  };

  const handleSelectVendor = (id: string) => {
    setSelectedVendorId(id);
  };

  const handleCloseModal = () => {
    setSelectedVendorId(null);
  };

  const handleToggleFavorite = async (vendorId: string) => {
    if (!currentUser) return;

    // 1. Calculate new state
    const isFav = favorites.includes(vendorId);
    const newFavorites = isFav 
        ? favorites.filter(id => id !== vendorId)
        : [...favorites, vendorId];
    
    // 2. Optimistic Update
    setFavorites(newFavorites);
    setCurrentUser({ ...currentUser, favorites: newFavorites });

    if (!supabase) return;

    // 3. Persist to Supabase
    try {
        await supabase.from('users').update({
            favorites: newFavorites
        }).eq('id', currentUser.id);
    } catch (e) {
        console.warn("Could not sync favorites");
    }
  };

  const handleAddReview = async (vendorId: string, review: Review) => {
    // Optimistic Update
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

    if (!supabase) return;

    // Persist to Supabase
    try {
        await supabase.from('reviews').insert([{
            vendor_id: vendorId,
            user_name: review.user,
            user_avatar: review.avatar,
            comment: review.comment,
            rating: review.rating,
            date: new Date().toISOString().split('T')[0] // Simple date YYYY-MM-DD
        }]);
    } catch (e) { console.warn("Could not save review"); }
  };

  const selectedVendor = vendors.find(v => v.id === selectedVendorId) || null;

  // If not logged in, show Landing Page
  if (!currentUser) {
    return <LandingPage onAuth={handleAuth} />;
  }

  // Loading Screen
  if (isLoading && vendors.length === 0) {
      return (
          <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans">
              <div className="w-full max-w-md bg-white border-2 border-neo-black rounded-3xl p-8 shadow-hard text-center">
                  <h1 className="text-4xl font-bold animate-bounce text-neo-orange mb-4">...</h1>
                  <p className="font-bold text-gray-500">Finding the best spots...</p>
              </div>
          </div>
      );
  }

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
               <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.avatarSeed}`} alt="Profile" className="w-full h-full" />
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
            user={currentUser}
            onUpdateUser={handleUpdateUser}
            onClose={() => setIsProfileOpen(false)} 
            favorites={favorites}
            vendors={vendors}
            onSelectVendor={handleSelectVendor}
          />
        )}

        {/* Detail Modal - Rendered last to appear on top of Profile if needed */}
        {selectedVendor && (
          <DetailModal 
            vendor={selectedVendor} 
            onClose={handleCloseModal}
            onAddReview={(review) => handleAddReview(selectedVendor.id, review)}
            isFavorite={favorites.includes(selectedVendor.id)}
            onToggleFavorite={() => handleToggleFavorite(selectedVendor.id)}
          />
        )}
      </div>
    </div>
  );
};

export default App;