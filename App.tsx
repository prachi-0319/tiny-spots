
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Discover from './components/Discover';
import Map from './components/Map';
import AddSpot from './components/AddSpot';
import Profile from './components/Profile';
import LandingPage from './components/LandingPage';
import { INITIAL_VENDORS, MOCK_USER } from './constants';
import { Vendor, Tab, Review, User } from './types';
import DetailModal from './components/DetailModal';

const SUPABASE_URL: string = "https://ilbhwypqiqyfavhezuic.supabase.co";
const SUPABASE_KEY: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsYmh3eXBxaXF5ZmF2aGV6dWljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0NzY1NzQsImV4cCI6MjA4NjA1MjU3NH0.7ZHokCe1mFSiU6OncYdl2GptAP5F7oQRKuGbSiE5tu4";

declare global {
  interface Window {
    supabase: any;
  }
}

let supabase: any = null;

try {
  let validUrl = SUPABASE_URL;
  if (validUrl && !validUrl.startsWith("https://")) {
      validUrl = "https://" + validUrl.replace(/^http:\/\//, '');
  }

  if (window.supabase && window.supabase.createClient) {
      const hasValidKeys = validUrl && validUrl !== "YOUR_URL_GOES_HERE";
      if (hasValidKeys) {
          supabase = window.supabase.createClient(validUrl, SUPABASE_KEY);
      }
  }
} catch (e) {
  console.warn("Supabase init error:", e);
}

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('discover');
  const [vendors, setVendors] = useState<Vendor[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const fetchVendors = async () => {
      setIsLoading(true);
      try {
        if (!supabase) throw new Error("Mock Mode");

        const { data, error } = await supabase.from('vendors').select('*');
        if (error) throw error;
        
        console.log("Fetched Vendors from Supabase:", data);

        const mappedVendors: Vendor[] = data.map((v: any) => ({
          id: v.id,
          name: v.name,
          category: v.category || "Others",
          image_url: v.image_url || "https://images.unsplash.com/photo-1555939594-58d7cb561ad1",
          rating: v.rating || 4.5,
          description: v.description || "",
          coordinates: { 
            x: v.lat !== undefined ? v.lat : (Math.random() * 80 + 10), 
            y: v.lng !== undefined ? v.lng : (Math.random() * 70 + 15) 
          },
          location: v.location || "Unknown Location",
          timings: v.timings || "9am - 9pm",
          reviews: [] 
        }));
        setVendors(mappedVendors);
      } catch (err: any) {
        setVendors(INITIAL_VENDORS);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendors();
  }, []);

  const handleAddVendor = async (newSpot: any) => {
    if (!newSpot.name || !newSpot.category || !newSpot.location || !newSpot.image_url) {
      alert("Please fill in Name, Category, Location, and add a Photo!");
      return;
    }

    if (!supabase) {
      alert("Local Mode: Spot added to UI only.");
      setVendors(prev => [{ ...newSpot, id: Date.now().toString(), coordinates: { x: 50, y: 50 }, reviews: [] }, ...prev]);
      setActiveTab('discover');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('vendors')
        .insert([{
          name: newSpot.name,
          category: newSpot.category,
          description: newSpot.description || "",
          timings: newSpot.timings || "9am - 9pm",
          location: newSpot.location,
          image_url: newSpot.image_url,
          rating: 4.5,
          lat: Math.random() * 80 + 10,
          lng: Math.random() * 70 + 15
        }])
        .select();

      if (error) throw error;

      if (data && data[0]) {
        alert("Spot Saved to Database!");
        const savedVendor: Vendor = {
          id: data[0].id,
          name: data[0].name,
          category: data[0].category,
          image_url: data[0].image_url,
          rating: data[0].rating,
          description: data[0].description,
          location: data[0].location,
          timings: data[0].timings,
          coordinates: { x: data[0].lat, y: data[0].lng },
          reviews: []
        };
        setVendors(prev => [savedVendor, ...prev]);
        setActiveTab('discover');
      }
    } catch (err: any) {
      alert("Failed to save: " + err.message);
    }
  };

  const handleAuth = async (formData: any, isLogin: boolean): Promise<boolean> => {
    if (!isLogin) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
        if (!passwordRegex.test(formData.password)) {
            alert("Password must be 8+ chars with Uppercase, Lowercase, Number, and Special char.");
            return false;
        }
    }
    try {
        let user: User | null = null;
        if (!supabase || (isLogin && formData.email === 'test@test.com')) {
             if (isLogin) {
                 const demoUser = { ...MOCK_USER, id: 'demo-1', favorites: [] };
                 setCurrentUser(demoUser);
                 setFavorites([]);
                 return true;
             } else {
                 const demoUser: User = { id: Date.now().toString(), name: formData.name, email: formData.email, pronouns: formData.pronouns, avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${Date.now()}`, favorites: [] };
                 setCurrentUser(demoUser);
                 setFavorites([]);
                 return true;
             }
        }
        if (isLogin) {
            const { data, error } = await supabase.from('users').select('*').eq('email', formData.email).eq('password', formData.password).single();
            if (error) throw error;
            if (data) { user = { id: data.id, name: data.name, email: data.email, pronouns: data.pronouns, avatarUrl: data.avatar_url, favorites: data.favorites || [] }; }
            else { alert("Invalid email or password."); return false; }
        } else {
            const { data: existingUsers } = await supabase.from('users').select('email').eq('email', formData.email);
            if (existingUsers && existingUsers.length > 0) { alert("This email is already registered!"); return false; }
            const { data, error } = await supabase.from('users').insert([{ name: formData.name, email: formData.email, password: formData.password, pronouns: formData.pronouns || 'they/them', avatar_url: `https://api.dicebear.com/7.x/adventurer/svg?seed=${Math.random()}`, favorites: [] }]).select().single();
            if (error) throw error;
            if (data) { user = { id: data.id, name: data.name, email: data.email, pronouns: data.pronouns, avatarUrl: data.avatar_url, favorites: [] }; }
        }
        if (user) { setCurrentUser(user); setFavorites(user.favorites || []); return true; } 
        return false;
    } catch (err: any) {
        alert(`Authentication Error: ${err.message}`);
        return false;
    }
  };

  const handleUpdateUser = async (updatedUser: User) => {
    setCurrentUser(updatedUser);
    if (!supabase) return;
    try { await supabase.from('users').update({ name: updatedUser.name, pronouns: updatedUser.pronouns }).eq('id', updatedUser.id); } catch (e) {}
  };

  const handleSelectVendor = (id: string) => setSelectedVendorId(id);
  const handleCloseModal = () => setSelectedVendorId(null);

  const handleToggleFavorite = async (vendorId: string) => {
    if (!currentUser) return;
    const isFav = favorites.includes(vendorId);
    const newFavorites = isFav ? favorites.filter(id => id !== vendorId) : [...favorites, vendorId];
    setFavorites(newFavorites);
    setCurrentUser({ ...currentUser, favorites: newFavorites });
    if (!supabase) return;
    try { await supabase.from('users').update({ favorites: newFavorites }).eq('id', currentUser.id); } catch (e) {}
  };

  const handleAddReview = async (vendorId: string, review: Review) => {
    const vendor = vendors.find(v => v.id === vendorId);
    if (!vendor) return;

    // 1. Calculate new rating locally
    const currentCount = vendor.reviews ? vendor.reviews.length : 0;
    const newRating = parseFloat(((vendor.rating * currentCount + review.rating) / (currentCount + 1)).toFixed(1));

    // 2. Update local UI
    setVendors(prev => prev.map(v => {
      if (v.id === vendorId) {
        return { ...v, reviews: [review, ...v.reviews], rating: newRating };
      }
      return v;
    }));

    if (!supabase) return;

    try {
      // 3. Persist review
      const { error: revErr } = await supabase.from('reviews').insert([{
          vendor_id: vendorId,
          user_name: review.user,
          user_avatar: review.avatar,
          comment: review.comment,
          rating: review.rating,
          date: new Date().toISOString().split('T')[0]
      }]);
      if (revErr) throw revErr;

      // 4. Update vendor rating and count in DB
      const { error: vendErr } = await supabase.from('vendors').update({
          rating: newRating
      }).eq('id', vendorId);
      
      if (vendErr) throw vendErr;
      
    } catch (e: any) {
      alert("Error syncing review to database: " + e.message);
    }
  };

  const selectedVendor = vendors.find(v => v.id === selectedVendorId) || null;

  if (!currentUser) return <LandingPage onAuth={handleAuth} />;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center sm:py-8 font-sans text-neo-black">
      <div className="w-full max-w-md h-screen sm:h-[850px] sm:max-h-[95vh] bg-white sm:border-2 sm:border-neo-black sm:shadow-hard sm:rounded-3xl overflow-hidden flex flex-col relative">
        <header className="px-6 pt-6 pb-2 flex justify-between items-center z-20 bg-white shrink-0">
            <h1 className="text-3xl font-bold tracking-tight cursor-pointer select-none active:scale-95 transition-transform" onClick={() => setActiveTab('discover')}>
              tiny<span className="text-neo-orange">spots</span>.
            </h1>
            <button onClick={() => setIsProfileOpen(true)} className="w-10 h-10 bg-neo-teal border-2 border-neo-black rounded-full shadow-hard-sm flex items-center justify-center overflow-hidden hover:scale-105 active:shadow-none active:translate-y-[2px] transition-all">
               <img src={currentUser.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
            </button>
        </header>
        <main className="flex-1 relative overflow-hidden flex flex-col">
          {activeTab === 'discover' && <Discover vendors={vendors} onSelectVendor={handleSelectVendor} favorites={favorites} onToggleFavorite={handleToggleFavorite} />}
          {activeTab === 'map' && <Map vendors={vendors} onSelectVendor={handleSelectVendor} />}
          {activeTab === 'add' && <AddSpot onAddVendor={handleAddVendor} />}
        </main>
        <div className="p-4 pb-6 z-20 bg-white border-t-2 border-neo-black/10 shrink-0">
            <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        {isProfileOpen && <Profile user={currentUser} onUpdateUser={handleUpdateUser} onClose={() => setIsProfileOpen(false)} favorites={favorites} vendors={vendors} onSelectVendor={handleSelectVendor} />}
        {selectedVendor && <DetailModal vendor={selectedVendor} onClose={handleCloseModal} onAddReview={(review) => handleAddReview(selectedVendor.id, review)} isFavorite={favorites.includes(selectedVendor.id)} onToggleFavorite={() => handleToggleFavorite(selectedVendor.id)} />}
      </div>
    </div>
  );
};

export default App;
