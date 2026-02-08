import React, { useState } from 'react';
import { User } from '../types';

interface LandingPageProps {
  onAuth: (data: any, isLogin: boolean) => Promise<boolean>;
}

const LandingPage: React.FC<LandingPageProps> = ({ onAuth }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    pronouns: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
        const success = await onAuth(formData, isLogin);
        if (!success) {
            // App.tsx handles generic network/connection alerts.
            // We can handle specific form logic here if needed, but alerting is mostly delegated.
        }
    } catch (err) {
        setError("Something went wrong.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neo-yellow flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-sm bg-white border-2 border-black rounded-3xl p-8 shadow-hard-lg">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              tiny<span className="text-neo-orange">spots</span>.
            </h1>
            <p className="text-gray-600 font-medium">Discover the hidden gems in your city.</p>
        </div>

        <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-xl border-2 border-black">
            <button 
                onClick={() => { setIsLogin(true); setError(null); }}
                className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${isLogin ? 'bg-white border-2 border-black shadow-hard-sm' : 'text-gray-500 hover:text-black'}`}
            >
                Login
            </button>
            <button 
                onClick={() => { setIsLogin(false); setError(null); }}
                className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${!isLogin ? 'bg-white border-2 border-black shadow-hard-sm' : 'text-gray-500 hover:text-black'}`}
            >
                Create Profile
            </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
                <>
                    <div>
                        <label className="block font-bold text-sm mb-1 text-black">Name</label>
                        <input 
                            required 
                            type="text" 
                            className="w-full p-3 bg-white text-black border-2 border-black placeholder-gray-400 rounded-xl focus:bg-neo-yellow/20 outline-none transition-colors"
                            placeholder="Alex Explorer"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block font-bold text-sm mb-1 text-black">Pronouns</label>
                        <input 
                            type="text" 
                            className="w-full p-3 bg-white text-black border-2 border-black placeholder-gray-400 rounded-xl focus:bg-neo-yellow/20 outline-none transition-colors"
                            placeholder="they/them"
                            value={formData.pronouns}
                            onChange={e => setFormData({...formData, pronouns: e.target.value})}
                        />
                    </div>
                </>
            )}
            
            <div>
                <label className="block font-bold text-sm mb-1 text-black">Email</label>
                <input 
                    required 
                    type="email" 
                    className="w-full p-3 bg-white text-black border-2 border-black placeholder-gray-400 rounded-xl focus:bg-neo-yellow/20 outline-none transition-colors"
                    placeholder="hello@tinyspots.com"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                />
            </div>
            
            <div>
                <label className="block font-bold text-sm mb-1 text-black">Password</label>
                <input 
                    required 
                    type="password" 
                    className="w-full p-3 bg-white text-black border-2 border-black placeholder-gray-400 rounded-xl focus:bg-neo-yellow/20 outline-none transition-colors"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                />
            </div>

            {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}

            <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-neo-teal text-white font-bold py-4 rounded-xl border-2 border-black shadow-hard active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isLoading 
                    ? (isLogin ? "Logging in..." : "Creating Profile...") 
                    : (isLogin ? "Let's Go!" : "Join the Club")
                }
            </button>
        </form>
      </div>
    </div>
  );
};

export default LandingPage;