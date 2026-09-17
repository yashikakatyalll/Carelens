/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Activity, 
  Camera, 
  History, 
  LayoutDashboard, 
  Sparkles, 
  AlertCircle, 
  ChevronRight, 
  Clock, 
  MessageSquare,
  BookOpen,
  User,
  Send,
  ExternalLink,
  MapPin, 
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Info,
  Plus,
  Trash2,
  TrendingUp,
  Lock,
  LogOut,
  Settings,
  UserPlus,
  Mail,
  Key,
  ShieldCheck,
  Search,
  RefreshCw,
  Lightbulb,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import Markdown from 'react-markdown';
import { cn } from './lib/utils';
import { 
  TriageLevel, 
  SymptomData, 
  TriageResult, 
  SkincareResult, 
  ScanHistory, 
  SYMPTOMS_LIST, 
  UserProfile,
  Clinic,
  EDUCATION_RESOURCES
} from './types';
import { analyzeTriage, analyzeSkincare, chatWithAI, getNearbyClinics } from './services/gemini';

// --- Mock Data for Dashboard ---
const IMPACT_STATS = [
  { name: 'Avoided ER', value: 68, color: '#10b981' },
  { name: 'Necessary ER', value: 32, color: '#ef4444' },
];

const WEEKLY_SCANS = [
  { day: 'Mon', count: 12 },
  { day: 'Tue', count: 18 },
  { day: 'Wed', count: 15 },
  { day: 'Thu', count: 22 },
  { day: 'Fri', count: 30 },
  { day: 'Sat', count: 25 },
  { day: 'Sun', count: 14 },
];

// --- Components ---

const SeverityBadge = ({ level }: { level: TriageLevel }) => {
  const configs = {
    low: { color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle2, label: 'Low Risk' },
    medium: { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: AlertTriangle, label: 'Medium Risk' },
    high: { color: 'bg-red-100 text-red-700 border-red-200', icon: AlertCircle, label: 'High Risk' },
  };
  const config = configs[level];
  const Icon = config.icon;

  return (
    <div className={cn("flex items-center gap-1.5 px-3 py-1 rounded-full border text-sm font-medium", config.color)}>
      <Icon size={14} />
      {config.label}
    </div>
  );
};

const AuthView = ({ mode, setMode, email, setEmail, password, setPassword, onAuth }: any) => (
  <div className="min-h-screen bg-pastel-blue/30 flex items-center justify-center p-6 relative overflow-hidden">
    {/* Whimsical Background Blobs */}
    <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-pastel-pink/40 rounded-full blur-3xl animate-pulse" />
    <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-pastel-purple/40 rounded-full blur-3xl animate-pulse delay-700" />
    <div className="absolute top-[20%] right-[10%] w-48 h-48 bg-pastel-yellow/30 rounded-full blur-2xl animate-bounce duration-[5000ms]" />

    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-xl w-full max-w-md rounded-bubble-lg bubble-shadow border border-white/50 overflow-hidden relative z-10"
    >
      <div className="p-10 text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-pastel-blue rounded-bubble flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-blue-100/50">
          <Activity size={48} />
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2 font-display">CareLens</h1>
        <p className="text-slate-500 mb-8 font-medium">Your magical health companion ✨</p>
        
        <div className="flex bg-pastel-blue/50 p-1.5 rounded-bubble mb-8 border border-blue-100/50">
          <button 
            onClick={() => setMode('login')}
            className={cn("flex-1 py-3 rounded-bubble text-sm font-bold transition-all", mode === 'login' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700")}
          >
            Login
          </button>
          <button 
            onClick={() => setMode('signup')}
            className={cn("flex-1 py-3 rounded-bubble text-sm font-bold transition-all", mode === 'signup' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700")}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={onAuth} className="space-y-5 text-left">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-4">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-300" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hello@magic.com"
                className="w-full bg-white/50 border border-blue-100 rounded-bubble pl-14 pr-6 py-4 text-sm focus:ring-4 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-300"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-4">Password</label>
            <div className="relative">
              <Key className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-300" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/50 border border-blue-100 rounded-bubble pl-14 pr-6 py-4 text-sm focus:ring-4 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-300"
                required
              />
            </div>
          </div>
          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-400 text-white font-bold py-5 rounded-bubble hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2 mt-6"
          >
            {mode === 'login' ? 'Welcome Back!' : 'Start Your Journey'}
            <ChevronRight size={20} />
          </button>
        </form>
      </div>
      <div className="bg-pastel-blue/20 p-6 text-center border-t border-blue-50/50">
        <p className="text-xs text-slate-400 font-medium">
          Safe & Secure • <span className="text-blue-500 hover:underline cursor-pointer">Privacy First</span>
        </p>
      </div>
    </motion.div>
  </div>
);

const ProfileSetupView = ({ onSave }: { onSave: (p: UserProfile) => void }) => (
  <div className="min-h-screen bg-pastel-pink/20 flex items-center justify-center p-6 relative overflow-hidden">
    <div className="absolute top-[-5%] right-[-5%] w-72 h-72 bg-pastel-blue/30 rounded-full blur-3xl animate-pulse" />
    <div className="absolute bottom-[-5%] left-[-5%] w-72 h-72 bg-pastel-yellow/30 rounded-full blur-3xl animate-pulse delay-1000" />

    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="bg-white/90 backdrop-blur-xl w-full max-w-2xl rounded-bubble-lg bubble-shadow border border-white/50 overflow-hidden relative z-10"
    >
      <div className="p-12">
        <div className="flex items-center gap-5 mb-10">
          <div className="w-16 h-16 bg-pastel-pink text-pink-500 rounded-bubble flex items-center justify-center shadow-inner">
            <User size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight font-display">Tell us about you!</h2>
            <p className="text-slate-500 font-medium">We'll use this to personalize your care 🌸</p>
          </div>
        </div>

        <form 
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            onSave({
              age: formData.get('age') as string,
              gender: formData.get('gender') as string,
              race: formData.get('race') as string,
              healthHistory: formData.get('healthHistory') as string,
            });
          }}
          className="space-y-8"
        >
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-4">How old are you?</label>
              <input name="age" type="number" required className="w-full bg-pastel-blue/20 border border-blue-50 rounded-bubble px-6 py-4 text-sm focus:ring-4 focus:ring-blue-100 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-4">Gender</label>
              <select name="gender" required className="w-full bg-pastel-blue/20 border border-blue-50 rounded-bubble px-6 py-4 text-sm focus:ring-4 focus:ring-blue-100 outline-none transition-all appearance-none">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-4">Race/Ethnicity</label>
              <input name="race" type="text" required placeholder="e.g., Asian" className="w-full bg-pastel-blue/20 border border-blue-50 rounded-bubble px-6 py-4 text-sm focus:ring-4 focus:ring-blue-100 outline-none transition-all" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-4">Health History</label>
            <textarea name="healthHistory" required placeholder="Any allergies or chronic conditions we should know about? 📝" className="w-full h-40 bg-pastel-blue/20 border border-blue-50 rounded-bubble px-6 py-5 text-sm focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-none" />
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-pink-400 to-pink-300 text-white font-bold py-5 rounded-bubble hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-pink-100">
            Let's Go! ✨
          </button>
        </form>
      </div>
    </motion.div>
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState<'triage' | 'skincare' | 'dashboard' | 'history' | 'education' | 'settings'>('triage');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  
  const [history, setHistory] = useState<ScanHistory[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [image, setImage] = useState<string | null>(null);
  const [symptoms, setSymptoms] = useState<SymptomData>({
    painLevel: 1,
    duration: 'Less than 24 hours',
    symptoms: [],
    additionalInfo: '',
  });
  const [result, setResult] = useState<TriageResult | SkincareResult | null>(null);
  
  // New State
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [clinics, setClinics] = useState<Clinic[]>([
    { name: "City Urgent Care", type: "Urgent Care", distance: "0.8 miles", address: "123 Medical Plaza", uri: "#", waitTime: "20 mins" },
    { name: "Memorial Hospital ER", type: "Hospital", distance: "2.4 miles", address: "456 Health Blvd", uri: "#", waitTime: "1 hr 15 mins" },
    { name: "Family Health Center", type: "Clinic", distance: "1.1 miles", address: "789 Care Lane", uri: "#", waitTime: "15 mins" }
  ]);
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFetchingClinics, setIsFetchingClinics] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [manualLocation, setManualLocation] = useState('');
  const [educationSearch, setEducationSearch] = useState('');
  const [educationCategory, setEducationCategory] = useState('All');
  const [bookmarkedResources, setBookmarkedResources] = useState<string[]>([]);

  // Load data from localStorage
  useEffect(() => {
    const savedAuth = localStorage.getItem('carelens_auth');
    if (savedAuth) {
      const authData = JSON.parse(savedAuth);
      setIsLoggedIn(authData.isLoggedIn);
      setIsProfileComplete(authData.isProfileComplete);
    }

    const savedHistory = localStorage.getItem('carelens_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    
    const savedProfile = localStorage.getItem('carelens_profile');
    if (savedProfile) setProfile(JSON.parse(savedProfile));

    const savedBookmarks = localStorage.getItem('carelens_bookmarks');
    if (savedBookmarks) setBookmarkedResources(JSON.parse(savedBookmarks));
  }, []);

  // Fetch location and clinics
  const fetchClinics = useCallback(async () => {
    console.log("Starting clinic fetch...");
    
    if (!navigator.geolocation) {
      console.log("Geolocation not supported");
      setLocationError("Please enter your location manually:");
      return;
    }

    setIsFetchingClinics(true);
    console.log("Requesting user geolocation...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        console.log("✓ Location granted:", {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
        try {
          setLocationError(null);
          const fetchedClinics = await getNearbyClinics(position.coords.latitude, position.coords.longitude);
          console.log("✓ Clinics fetched successfully:", fetchedClinics.length, "clinics");
          setClinics(fetchedClinics);
        } catch (error: any) {
          console.error("✗ Failed to fetch clinics from API:", error?.message || error);
          setLocationError("Unable to fetch live clinic data. Showing nearby options:");
        } finally {
          setIsFetchingClinics(false);
        }
      },
      (error) => {
        console.error("✗ Geolocation error:", {
          code: error.code,
          message: error.message,
          PERMISSION_DENIED: error.PERMISSION_DENIED,
          POSITION_UNAVAILABLE: error.POSITION_UNAVAILABLE,
          TIMEOUT: error.TIMEOUT
        });
        
        setIsFetchingClinics(false);
        
        if (error.code === error.PERMISSION_DENIED) {
          setLocationError("Location access denied. Please enter your city or zip code:");
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setLocationError("Location services unavailable. Please enter your city or zip code:");
        } else if (error.code === error.TIMEOUT) {
          setLocationError("Location request timed out. Please enter your city or zip code:");
        } else {
          setLocationError("Couldn't detect location. Please enter your city or zip code:");
        }
      },
      { 
        timeout: 8000, 
        enableHighAccuracy: false,
        maximumAge: 300000 // Cache location for 5 minutes
      }
    );
  }, []);

  useEffect(() => {
    // Fetch clinics on component mount
    fetchClinics();
  }, [fetchClinics]);

  const handleManualLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualLocation.trim()) return;
    
    setIsFetchingClinics(true);
    setLocationError(null);
    try {
      // We'll pass 0,0 and let the model find it by name if we had a geocoder, 
      // but for now we'll just use the manual location in the prompt if we update the service.
      // Let's update getNearbyClinics to accept a string location too.
      const fetchedClinics = await getNearbyClinics(0, 0, manualLocation);
      setClinics(fetchedClinics);
    } catch (error) {
      console.error("Manual location fetch failed:", error);
      setLocationError("Could not find clinics for that location");
    } finally {
      setIsFetchingClinics(false);
    }
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authPassword) return;
    
    // Simulated auth
    setIsLoggedIn(true);
    const isComplete = !!localStorage.getItem('carelens_profile');
    setIsProfileComplete(isComplete);
    
    localStorage.setItem('carelens_auth', JSON.stringify({ 
      isLoggedIn: true, 
      isProfileComplete: isComplete 
    }));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('carelens_auth');
    setActiveTab('triage');
  };

  const saveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem('carelens_profile', JSON.stringify(newProfile));
    setIsProfileComplete(true);
    localStorage.setItem('carelens_auth', JSON.stringify({ 
      isLoggedIn: true, 
      isProfileComplete: true 
    }));
    if (activeTab === 'settings') setActiveTab('triage');
  };

  const toggleBookmark = (title: string) => {
    const newBookmarks = bookmarkedResources.includes(title)
      ? bookmarkedResources.filter(t => t !== title)
      : [...bookmarkedResources, title];
    setBookmarkedResources(newBookmarks);
    localStorage.setItem('carelens_bookmarks', JSON.stringify(newBookmarks));
  };

  const filteredEducation = EDUCATION_RESOURCES.filter(res => {
    const matchesSearch = res.title.toLowerCase().includes(educationSearch.toLowerCase()) ||
      res.category.toLowerCase().includes(educationSearch.toLowerCase()) ||
      res.description.toLowerCase().includes(educationSearch.toLowerCase());
    const matchesCategory = educationCategory === 'All' || res.category === educationCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', ...Array.from(new Set(EDUCATION_RESOURCES.map(r => r.category)))];

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = { role: 'user' as const, text: chatInput };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');

    try {
      const response = await chatWithAI(chatInput, chatMessages);
      setChatMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      console.error("Chat failed:", error);
      setChatMessages(prev => [...prev, { role: 'model', text: "I'm sorry, I'm having trouble connecting right now." }]);
    }
  };

  const saveToHistory = (newEntry: ScanHistory) => {
    const updated = [newEntry, ...history];
    setHistory(updated);
    localStorage.setItem('carelens_history', JSON.stringify(updated));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setCurrentStep(2);
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = async () => {
    if (!image || !profile) {
      if (!profile) setActiveTab('settings');
      return;
    }
    setIsAnalyzing(true);
    try {
      if (activeTab === 'triage') {
        const res = await analyzeTriage(image, symptoms, profile);
        setResult(res);
        saveToHistory({
          id: Date.now().toString(),
          timestamp: Date.now(),
          type: 'triage',
          imageUrl: image,
          result: res,
          symptoms: symptoms,
        });
      } else {
        const res = await analyzeSkincare(image, profile, symptoms.additionalInfo);
        setResult(res);
        saveToHistory({
          id: Date.now().toString(),
          timestamp: Date.now(),
          type: 'skincare',
          imageUrl: image,
          result: res,
        });
      }
      setCurrentStep(3);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg = { role: 'user' as const, text: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    
    try {
      const response = await chatWithAI(chatInput, chatMessages);
      setChatMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      console.error("Chat failed:", error);
    }
  };

  const resetFlow = () => {
    setImage(null);
    setSymptoms({ painLevel: 1, duration: 'Less than 24 hours', symptoms: [], additionalInfo: '' });
    setResult(null);
    setCurrentStep(1);
  };

  if (!isLoggedIn) {
    return (
      <AuthView 
        mode={authMode} 
        setMode={setAuthMode} 
        email={authEmail} 
        setEmail={setAuthEmail} 
        password={authPassword} 
        setPassword={setAuthPassword} 
        onAuth={handleAuth} 
      />
    );
  }

  if (!isProfileComplete) {
    return <ProfileSetupView onSave={saveProfile} />;
  }

  return (
    <div className="min-h-screen bg-[#fafafc] text-slate-800 font-sans selection:bg-blue-100 selection:text-blue-600">
      {/* Whimsical Background Blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-pastel-blue/20 rounded-full blur-[100px] -z-10 pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[35rem] h-[35rem] bg-pastel-pink/20 rounded-full blur-[100px] -z-10 pointer-events-none" />
      <div className="fixed top-[20%] right-[-5%] w-[25rem] h-[25rem] bg-pastel-yellow/20 rounded-full blur-[80px] -z-10 pointer-events-none" />

      {/* Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/70 backdrop-blur-xl border-t border-white/50 px-6 py-4 z-50 md:top-0 md:bottom-auto md:border-t-0 md:border-b shadow-sm">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="hidden md:flex items-center gap-3 mr-8 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-300 rounded-bubble flex items-center justify-center text-white shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform">
              <Activity size={22} />
            </div>
            <span className="font-display font-black text-2xl tracking-tight text-slate-900">CareLens</span>
          </div>
          
          <div className="flex flex-1 justify-around md:justify-start md:gap-10">
            <NavButton 
              active={activeTab === 'triage'} 
              onClick={() => { setActiveTab('triage'); resetFlow(); }} 
              icon={<Activity size={22} />} 
              label="Triage" 
              color="blue"
            />
            <NavButton 
              active={activeTab === 'skincare'} 
              onClick={() => { setActiveTab('skincare'); resetFlow(); }} 
              icon={<Sparkles size={22} />} 
              label="Skin" 
              color="purple"
            />
            <NavButton 
              active={activeTab === 'dashboard'} 
              onClick={() => setActiveTab('dashboard')} 
              icon={<LayoutDashboard size={22} />} 
              label="Stats" 
              color="emerald"
            />
            <NavButton 
              active={activeTab === 'education'} 
              onClick={() => setActiveTab('education')} 
              icon={<BookOpen size={22} />} 
              label="Learn" 
              color="amber"
            />
            <NavButton 
              active={activeTab === 'history'} 
              onClick={() => setActiveTab('history')} 
              icon={<History size={22} />} 
              label="History" 
              color="indigo"
            />
            <NavButton 
              active={activeTab === 'settings'} 
              onClick={() => setActiveTab('settings')} 
              icon={<Settings size={22} />} 
              label="Settings" 
              color="slate"
            />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 pt-6 pb-24 md:pt-24">
        <AnimatePresence mode="wait">
          {activeTab === 'triage' && (
            <motion.div 
              key="triage"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <header className="mb-10 text-center md:text-left">
                <h1 className="text-4xl font-black text-slate-900 font-display">Medical Triage</h1>
                <p className="text-slate-500 mt-2 font-medium">Let's see how you're feeling today 🩺</p>
              </header>

              {currentStep === 1 && (
                <div className="bg-white/80 backdrop-blur-xl rounded-bubble-lg p-12 bubble-shadow border border-white/50 flex flex-col items-center text-center relative overflow-hidden">
                  <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-pastel-blue/30 rounded-full blur-2xl" />
                  <div className="w-24 h-24 bg-pastel-blue text-blue-500 rounded-bubble flex items-center justify-center mb-8 shadow-inner">
                    <Camera size={48} />
                  </div>
                  <h2 className="text-2xl font-black mb-3 font-display">Snap a Photo</h2>
                  <p className="text-slate-500 mb-10 max-w-sm font-medium">
                    Take a clear photo of the area. Good lighting makes for better magic! ✨
                  </p>
                  <label className="w-full max-w-xs bg-gradient-to-r from-blue-500 to-blue-400 hover:scale-[1.02] active:scale-[0.98] text-white font-bold py-5 px-8 rounded-bubble cursor-pointer transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-100">
                    <Plus size={24} />
                    Select Image
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                  <div className="mt-10 flex items-start gap-4 p-6 bg-pastel-yellow/40 rounded-bubble border border-pastel-yellow text-left max-w-lg">
                    <Info className="text-amber-600 shrink-0 mt-0.5" size={20} />
                    <p className="text-xs text-amber-800 leading-relaxed font-medium">
                      <strong>Friendly Reminder:</strong> This is just a helpful guide, not a doctor's diagnosis. If it's an emergency, please call for help right away! 🚑
                    </p>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-8">
                  <div className="bg-white/80 backdrop-blur-xl rounded-bubble-lg p-8 bubble-shadow border border-white/50">
                    <div className="flex items-center gap-6 mb-10">
                      <div className="relative">
                        <img src={image!} alt="Preview" className="w-28 h-28 rounded-bubble object-cover border-4 border-white shadow-lg" />
                        <button onClick={() => setCurrentStep(1)} className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-blue-500 hover:text-blue-600 transition-colors">
                          <RefreshCw size={18} />
                        </button>
                      </div>
                      <div>
                        <h3 className="font-black text-xl font-display">Looking Good!</h3>
                        <p className="text-slate-500 font-medium">Now, tell us a bit more...</p>
                      </div>
                    </div>

                    <div className="space-y-10">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-6 flex justify-between items-center">
                          <span className="font-display">How's the pain?</span>
                          <span className="bg-pastel-blue text-blue-600 px-4 py-1 rounded-full text-sm font-black">{symptoms.painLevel}/10</span>
                        </label>
                        <input 
                          type="range" min="1" max="10" 
                          value={symptoms.painLevel} 
                          onChange={(e) => setSymptoms({...symptoms, painLevel: parseInt(e.target.value)})}
                          className="w-full h-3 bg-pastel-blue rounded-full appearance-none cursor-pointer accent-blue-500"
                        />
                        <div className="flex justify-between text-[10px] text-slate-400 mt-3 font-black uppercase tracking-widest">
                          <span>Just a tickle</span>
                          <span>Ouchie</span>
                          <span>Super Sore</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-6 font-display">How long has it been?</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {['< 24 Hours', '1-3 Days', '4-7 Days', '1 Week+'].map((d) => (
                            <button
                              key={d}
                              onClick={() => setSymptoms({...symptoms, duration: d})}
                              className={cn(
                                "py-4 px-4 rounded-bubble border-2 text-sm font-bold transition-all",
                                symptoms.duration === d 
                                  ? "bg-pastel-blue border-blue-300 text-blue-700 shadow-inner" 
                                  : "bg-white border-slate-100 text-slate-500 hover:border-blue-200"
                              )}
                            >
                              {d}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-6 font-display">Any other symptoms?</label>
                        <div className="flex flex-wrap gap-3">
                          {SYMPTOMS_LIST.map((s) => (
                            <button
                              key={s}
                              onClick={() => {
                                const newSymptoms = symptoms.symptoms.includes(s)
                                  ? symptoms.symptoms.filter(item => item !== s)
                                  : [...symptoms.symptoms, s];
                                setSymptoms({...symptoms, symptoms: newSymptoms});
                              }}
                              className={cn(
                                "px-6 py-3 rounded-full border-2 text-sm font-bold transition-all",
                                symptoms.symptoms.includes(s)
                                  ? "bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-100"
                                  : "bg-white border-slate-100 text-slate-500 hover:border-blue-200"
                              )}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-6 font-display">Anything else to share?</label>
                        <textarea 
                          value={symptoms.additionalInfo}
                          onChange={(e) => setSymptoms({...symptoms, additionalInfo: e.target.value})}
                          placeholder="Tell us the story... 📖"
                          className="w-full h-32 bg-pastel-blue/20 border border-blue-50 rounded-bubble p-6 text-sm focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-none placeholder:text-slate-300"
                        />
                      </div>
                    </div>

                    <button 
                      onClick={startAnalysis}
                      disabled={isAnalyzing}
                      className="w-full mt-12 bg-gradient-to-r from-blue-500 to-blue-400 hover:scale-[1.02] active:scale-[0.98] disabled:bg-slate-200 text-white font-black py-5 px-8 rounded-bubble transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-100"
                    >
                      {isAnalyzing ? (
                        <>
                          <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                          Consulting the AI...
                        </>
                      ) : (
                        <>
                          Run AI Triage ✨
                          <ChevronRight size={24} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 3 && result && 'level' in result && (
                <div className="space-y-6">
                  <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <SeverityBadge level={result.level} />
                        <span className="text-xs text-slate-400 font-medium uppercase tracking-widest">
                          Confidence: {Math.round(result.confidence * 100)}%
                        </span>
                      </div>
                      <button onClick={resetFlow} className="text-slate-400 hover:text-slate-600">
                        <Plus className="rotate-45" size={24} />
                      </button>
                    </div>
                    
                    <div className="p-8 space-y-8">
                      <section>
                        <h3 className="text-xl font-bold mb-3">AI Assessment</h3>
                        <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
                          <Markdown>{result.explanation}</Markdown>
                        </div>
                      </section>

                      <section className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                          <ShieldCheck className="text-blue-600" size={20} />
                          Recommended Next Step
                        </h3>
                        <p className="text-slate-700 font-medium mb-4">{result.recommendation}</p>
                        <ul className="space-y-2">
                          {result.nextSteps.map((step, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                              {step}
                            </li>
                          ))}
                        </ul>
                      </section>

                      <section>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800">
                            <MapPin className="text-blue-600" size={20} />
                            Nearby Care Options
                          </h3>
                          <button 
                            onClick={fetchClinics}
                            disabled={isFetchingClinics}
                            className="text-blue-600 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50 transition-all disabled:opacity-50"
                            title="Refresh Location"
                          >
                            <RefreshCw size={18} className={cn(isFetchingClinics && "animate-spin")} />
                          </button>
                        </div>
                        
                        {locationError && (
                          <div className="mb-4 p-4 bg-amber-50 border border-amber-100 rounded-2xl space-y-3">
                            <div className="flex items-center gap-3 text-amber-800 text-xs">
                              <AlertTriangle size={16} className="shrink-0" />
                              <p>{locationError}. Enter your city or zip code manually:</p>
                            </div>
                            <form onSubmit={handleManualLocation} className="flex gap-2">
                              <input 
                                type="text"
                                value={manualLocation}
                                onChange={(e) => setManualLocation(e.target.value)}
                                placeholder="City or Zip Code"
                                className="flex-1 bg-white border border-amber-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                              />
                              <button 
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 transition-all"
                              >
                                Find
                              </button>
                            </form>
                          </div>
                        )}

                        <div className="space-y-3">
                          {isFetchingClinics ? (
                            <div className="flex items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-100">
                              <div className="w-6 h-6 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mr-3" />
                              <span className="text-slate-500 font-medium">Finding nearby clinics...</span>
                            </div>
                          ) : clinics.length > 0 ? (
                            clinics.map((clinic, i) => (
                              <a 
                                key={i} 
                                href={clinic.uri} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-blue-200 transition-colors group"
                              >
                                <div>
                                  <h4 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">{clinic.name}</h4>
                                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                    <span className="bg-slate-100 px-2 py-0.5 rounded uppercase font-bold tracking-tighter">{clinic.type}</span>
                                    <span>{clinic.address}</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="flex items-center gap-1 text-blue-600 font-bold text-sm mb-1">
                                    <Clock size={14} />
                                    {clinic.waitTime}
                                  </div>
                                  <ExternalLink size={16} className="text-slate-300 group-hover:text-blue-600 transition-colors ml-auto" />
                                </div>
                              </a>
                            ))
                          ) : (
                            <p className="text-slate-400 text-sm text-center p-4">No clinics found nearby.</p>
                          )}
                        </div>
                      </section>

                      <section className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-200">
                        <div className="flex items-start gap-4">
                          <div className="bg-white/20 p-3 rounded-xl">
                            <Calendar size={24} />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">Smart Scheduling</h3>
                            <p className="text-blue-100 text-sm mt-1">
                              Based on your condition and availability, we recommend:
                            </p>
                            <div className="mt-4 p-3 bg-white/10 rounded-xl border border-white/20 font-medium">
                              {result.suggestedAction}
                            </div>
                          </div>
                        </div>
                      </section>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'skincare' && (
            <motion.div 
              key="skincare"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <header className="mb-10 text-center md:text-left">
                <h1 className="text-4xl font-black text-slate-900 font-display">Skin Health</h1>
                <p className="text-slate-500 mt-2 font-medium">Let's get that glow! ✨</p>
              </header>

              {currentStep === 1 && (
                <div className="bg-white/80 backdrop-blur-xl rounded-bubble-lg p-12 bubble-shadow border border-white/50 flex flex-col items-center text-center relative overflow-hidden">
                  <div className="absolute top-[-10%] left-[-10%] w-32 h-32 bg-pastel-purple/30 rounded-full blur-2xl" />
                  <div className="w-24 h-24 bg-pastel-purple text-purple-500 rounded-bubble flex items-center justify-center mb-8 shadow-inner">
                    <Sparkles size={48} />
                  </div>
                  <h2 className="text-2xl font-black mb-3 font-display">Skin Analysis</h2>
                  <p className="text-slate-500 mb-10 max-w-sm font-medium">
                    Upload a photo of your concern. Our AI will help you find the perfect routine! 🌸
                  </p>
                  <label className="w-full max-w-xs bg-gradient-to-r from-purple-500 to-purple-400 hover:scale-[1.02] active:scale-[0.98] text-white font-bold py-5 px-8 rounded-bubble cursor-pointer transition-all flex items-center justify-center gap-3 shadow-xl shadow-purple-100">
                    <Plus size={24} />
                    Upload Photo
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>
              )}

              {currentStep === 2 && (
                <div className="bg-white/80 backdrop-blur-xl rounded-bubble-lg p-10 bubble-shadow border border-white/50 text-center">
                  <div className="relative inline-block mb-8">
                    <img src={image!} alt="Preview" className="w-56 h-56 rounded-bubble object-cover border-8 border-white shadow-2xl" />
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-pastel-purple rounded-full flex items-center justify-center text-purple-600 shadow-lg animate-bounce">
                      <Sparkles size={24} />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black mb-3 font-display">Ready to Glow?</h3>
                  <p className="text-slate-500 mb-10 font-medium">Our magic AI is ready to analyze your skin patterns.</p>
                  <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                    <button onClick={() => setCurrentStep(1)} className="flex-1 py-4 px-8 rounded-bubble border-2 border-slate-100 font-bold text-slate-500 hover:bg-slate-50 transition-all">Cancel</button>
                    <button 
                      onClick={startAnalysis} 
                      disabled={isAnalyzing}
                      className="flex-[2] bg-gradient-to-r from-purple-500 to-purple-400 hover:scale-[1.02] active:scale-[0.98] disabled:bg-slate-200 text-white font-black py-4 px-8 rounded-bubble transition-all flex items-center justify-center gap-3 shadow-xl shadow-purple-100"
                    >
                      {isAnalyzing ? (
                        <>
                          <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>Analyze Skin ✨</>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 3 && result && 'condition' in result && (
                <div className="space-y-6">
                  <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200">
                    <div className="p-8 space-y-8">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 shrink-0">
                          <Sparkles size={32} />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold">{result.condition}</h2>
                          <p className="text-slate-500">AI Skin Analysis Result</p>
                        </div>
                      </div>

                      <section>
                        <h3 className="text-lg font-bold mb-3">Detailed Analysis</h3>
                        <p className="text-slate-600 leading-relaxed">{result.analysis}</p>
                      </section>

                      <div className="grid md:grid-cols-2 gap-6">
                        <section className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
                          <h3 className="font-bold mb-4 text-purple-900">Suggested Routine</h3>
                          <div className="space-y-4">
                            {result.routine.map((step, i) => (
                              <div key={i} className="flex gap-3">
                                <span className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs font-bold text-purple-600 shrink-0 shadow-sm">{i + 1}</span>
                                <p className="text-sm text-purple-800">{step}</p>
                              </div>
                            ))}
                          </div>
                        </section>

                        <section className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                          <h3 className="font-bold mb-4 text-slate-900">Recommended Products</h3>
                          <div className="flex flex-wrap gap-2">
                            {result.productCategories.map((cat, i) => (
                              <span key={i} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 shadow-sm">
                                {cat}
                              </span>
                            ))}
                          </div>
                        </section>
                      </div>

                      <button onClick={resetFlow} className="w-full py-4 px-6 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all">
                        New Analysis
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-10"
            >
              <header className="text-center md:text-left">
                <h1 className="text-4xl font-black text-slate-900 font-display">Health Dashboard</h1>
                <p className="text-slate-500 mt-2 font-medium">Real-time insights from your magical journey ✨</p>
              </header>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <StatCard 
                  label="Total Scans" 
                  value={history.length.toString()} 
                  icon={<ShieldCheck className="text-blue-500" size={24} />} 
                />
                <StatCard 
                  label="Triage Cases" 
                  value={history.filter(h => h.type === 'triage').length.toString()} 
                  icon={<Activity className="text-emerald-500" size={24} />} 
                />
                <StatCard 
                  label="Skin Analysis" 
                  value={history.filter(h => h.type === 'skincare').length.toString()} 
                  icon={<TrendingUp className="text-purple-500" size={24} />} 
                />
                <StatCard 
                  label="High Risk" 
                  value={history.filter(h => h.type === 'triage' && (h.result as TriageResult).level === 'high').length.toString()} 
                  icon={<AlertTriangle className="text-pink-500" size={24} />} 
                />
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white/80 backdrop-blur-xl p-8 rounded-bubble-lg bubble-shadow border border-white/50">
                  <h3 className="font-black text-slate-800 mb-8 font-display flex items-center gap-2">
                    <TrendingUp size={20} className="text-blue-500" />
                    Weekly Activity
                  </h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={WEEKLY_SCANS}>
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} />
                        <Tooltip cursor={{fill: '#f1f5f9', radius: 12}} contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px 20px'}} />
                        <Bar dataKey="scans" fill="#3b82f6" radius={[12, 12, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xl p-8 rounded-bubble-lg bubble-shadow border border-white/50">
                  <h3 className="font-black text-slate-800 mb-8 font-display flex items-center gap-2">
                    <Activity size={20} className="text-emerald-500" />
                    Triage Impact
                  </h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Low Risk', value: history.filter(h => h.type === 'triage' && (h.result as TriageResult).level === 'low').length || 1 },
                            { name: 'Medium Risk', value: history.filter(h => h.type === 'triage' && (h.result as TriageResult).level === 'medium').length || 1 },
                            { name: 'High Risk', value: history.filter(h => h.type === 'triage' && (h.result as TriageResult).level === 'high').length || 1 },
                          ]}
                          innerRadius={60}
                          outerRadius={85}
                          paddingAngle={8}
                          dataKey="value"
                          stroke="none"
                        >
                          <Cell fill="#10b981" />
                          <Cell fill="#f59e0b" />
                          <Cell fill="#f43f5e" />
                        </Pie>
                        <Tooltip contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px 20px'}} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-500 to-blue-400 rounded-bubble-lg p-10 text-white relative overflow-hidden shadow-2xl shadow-blue-100">
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                  <div className="w-20 h-20 bg-white/20 rounded-bubble flex items-center justify-center shrink-0">
                    <Sparkles size={40} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black mb-3 font-display">Smart Health Insight</h3>
                    <p className="text-blue-50 font-medium max-w-xl text-lg leading-relaxed">
                      {history.length > 0 
                        ? `Based on your ${history.length} scans, you've primarily focused on ${history.filter(h => h.type === 'triage').length > history.filter(h => h.type === 'skincare').length ? 'symptom triage' : 'skincare'}. Keep tracking to see long-term patterns! 🌸`
                        : "Start scanning to see personalized health insights and trends here. Your journey to wellness begins today! ✨"}
                    </p>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-300/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
              </div>
            </motion.div>
          )}

          {activeTab === 'education' && (
            <motion.div 
              key="education"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-10 pb-12"
            >
              <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 text-center md:text-left">
                <div>
                  <h1 className="text-4xl font-black text-slate-900 font-display">Education Hub</h1>
                  <p className="text-slate-500 mt-2 text-lg font-medium">Verified medical resources to empower your health journey 📖</p>
                </div>
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="text"
                    value={educationSearch}
                    onChange={(e) => setEducationSearch(e.target.value)}
                    placeholder="Search topics..."
                    className="w-full bg-white rounded-bubble px-12 py-4 text-sm bubble-shadow border-none focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>
              </header>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setEducationCategory(cat)}
                    className={cn(
                      "px-4 py-2 rounded-full text-xs font-bold transition-all border",
                      educationCategory === cat 
                        ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100" 
                        : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Quick Tips Section */}
              <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-400 p-8 rounded-bubble-lg text-white shadow-xl shadow-blue-100 flex flex-col justify-between relative overflow-hidden group">
                  <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                  <Lightbulb className="mb-6 text-blue-100" size={40} />
                  <div>
                    <h3 className="font-black text-xl mb-2 font-display">Stay Hydrated</h3>
                    <p className="text-blue-50 text-sm font-medium leading-relaxed">Proper hydration speeds up skin recovery and boosts your immune system. 💧</p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-400 p-8 rounded-bubble-lg text-white shadow-xl shadow-emerald-100 flex flex-col justify-between relative overflow-hidden group">
                  <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                  <ShieldCheck className="mb-6 text-emerald-100" size={40} />
                  <div>
                    <h3 className="font-black text-xl mb-2 font-display">SPF Daily</h3>
                    <p className="text-emerald-50 text-sm font-medium leading-relaxed">Sunscreen is the #1 defense against premature aging and skin cancer. ☀️</p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-400 p-8 rounded-bubble-lg text-white shadow-xl shadow-purple-100 flex flex-col justify-between relative overflow-hidden group">
                  <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                  <Clock className="mb-6 text-purple-100" size={40} />
                  <div>
                    <h3 className="font-black text-xl mb-2 font-display">Rest & Recover</h3>
                    <p className="text-purple-50 text-sm font-medium leading-relaxed">Your body does most of its healing work while you sleep. Aim for 7-9 hours. 🌙</p>
                  </div>
                </div>
              </section>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEducation.map((res, i) => (
                  <motion.a 
                    key={i} 
                    href={res.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    whileHover={{ y: -8 }}
                    className="bg-white/80 backdrop-blur-xl rounded-bubble-lg bubble-shadow border border-white/50 hover:border-blue-200 transition-all group overflow-hidden flex flex-col"
                  >
                    <div className="h-56 overflow-hidden relative">
                      <img 
                        src={res.image} 
                        alt={res.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 left-4">
                        <span className={cn(
                          "px-4 py-1.5 backdrop-blur-md text-[10px] font-black uppercase rounded-full tracking-widest shadow-lg",
                          res.category === 'First Aid' ? "bg-pink-500/90 text-white" :
                          res.category === 'Dermatology' ? "bg-purple-500/90 text-white" :
                          res.category === 'Prevention' ? "bg-amber-500/90 text-white" :
                          res.category === 'Wellness' ? "bg-emerald-500/90 text-white" :
                          res.category === 'Lifestyle' ? "bg-indigo-500/90 text-white" :
                          "bg-white/90 text-blue-600"
                        )}>
                          {res.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-8 flex-1 flex flex-col">
                      <div className="flex justify-between items-start gap-3 mb-4">
                        <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-500 transition-colors line-clamp-2 font-display leading-tight">{res.title}</h3>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleBookmark(res.title);
                          }}
                          className="w-10 h-10 bg-pastel-blue rounded-bubble flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform shrink-0"
                        >
                          {bookmarkedResources.includes(res.title) ? <BookmarkCheck className="text-blue-600" size={20} /> : <Bookmark size={20} />}
                        </button>
                      </div>
                      <p className="text-slate-500 text-sm font-medium line-clamp-3 mb-6 flex-1">{res.description}</p>
                      <div className="flex items-center gap-2 text-blue-500 font-black text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
                        Read Article <ExternalLink size={14} />
                      </div>
                    </div>
                  </motion.a>
                ))}
              </div>

              {filteredEducation.length === 0 && (
                <div className="text-center py-20 bg-white/80 backdrop-blur-xl rounded-bubble-lg bubble-shadow border border-white/50">
                  <div className="w-20 h-20 bg-pastel-blue rounded-bubble flex items-center justify-center text-blue-300 mx-auto mb-6 shadow-inner">
                    <Search size={40} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 font-display">No magic found!</h3>
                  <p className="text-slate-500 mt-2 font-medium">Try searching for something else like "burns" or "SPF". 🌸</p>
                  <button 
                    onClick={() => setEducationSearch('')}
                    className="mt-8 text-blue-500 font-black hover:underline uppercase tracking-widest text-sm"
                  >
                    Clear search
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div 
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <header className="mb-10 flex justify-between items-end">
                <div>
                  <h1 className="text-4xl font-black text-slate-900 font-display">Settings</h1>
                  <p className="text-slate-500 mt-2 font-medium">Manage your magical profile 🌸</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-6 py-3 bg-pastel-pink text-pink-600 rounded-bubble font-black hover:bg-pink-100 transition-all shadow-sm"
                >
                  <LogOut size={20} />
                  Logout
                </button>
              </header>

              <div className="bg-white/80 backdrop-blur-xl rounded-bubble-lg p-10 bubble-shadow border border-white/50">
                <div className="flex items-center gap-5 mb-10">
                  <div className="w-16 h-16 bg-pastel-blue text-blue-500 rounded-bubble flex items-center justify-center shadow-inner">
                    <User size={32} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 font-display">Health Profile</h2>
                    <p className="text-slate-500 font-medium text-sm">Keep your info up to date for better care.</p>
                  </div>
                </div>

                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    saveProfile({
                      age: formData.get('age') as string,
                      gender: formData.get('gender') as string,
                      race: formData.get('race') as string,
                      healthHistory: formData.get('healthHistory') as string,
                    });
                  }}
                  className="space-y-8"
                >
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-4">Age</label>
                      <input 
                        name="age" 
                        type="number" 
                        defaultValue={profile?.age}
                        required
                        className="w-full bg-pastel-blue/20 border border-blue-50 rounded-bubble px-6 py-4 text-sm focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-4">Gender</label>
                      <select 
                        name="gender" 
                        defaultValue={profile?.gender}
                        required
                        className="w-full bg-pastel-blue/20 border border-blue-50 rounded-bubble px-6 py-4 text-sm focus:ring-4 focus:ring-blue-100 outline-none transition-all appearance-none"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Non-binary">Non-binary</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-4">Race/Ethnicity</label>
                      <input 
                        name="race" 
                        type="text" 
                        defaultValue={profile?.race}
                        required
                        placeholder="e.g., Asian"
                        className="w-full bg-pastel-blue/20 border border-blue-50 rounded-bubble px-6 py-4 text-sm focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-4">Health History</label>
                    <textarea 
                      name="healthHistory" 
                      defaultValue={profile?.healthHistory}
                      required
                      placeholder="List any chronic conditions, allergies, or regular medications..."
                      className="w-full h-40 bg-pastel-blue/20 border border-blue-50 rounded-bubble px-6 py-5 text-sm focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-400 text-white font-black py-5 rounded-bubble hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-blue-100"
                  >
                    Update Profile ✨
                  </button>
                </form>
              </div>

              <div className="bg-white/80 backdrop-blur-xl rounded-bubble-lg p-10 bubble-shadow border border-white/50">
                <div className="flex items-center gap-5 mb-10">
                  <div className="w-16 h-16 bg-slate-100 text-slate-500 rounded-bubble flex items-center justify-center shadow-inner">
                    <Lock size={32} />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 font-display">Security</h2>
                </div>
                <div className="space-y-5">
                  <div className="flex justify-between items-center p-6 bg-slate-50/50 rounded-bubble border border-slate-100">
                    <div>
                      <p className="text-sm font-black text-slate-900 font-display">Email Address</p>
                      <p className="text-xs text-slate-500 font-medium">{authEmail}</p>
                    </div>
                    <button className="text-blue-500 text-xs font-black hover:underline uppercase tracking-widest">Change</button>
                  </div>
                  <div className="flex justify-between items-center p-6 bg-slate-50/50 rounded-bubble border border-slate-100">
                    <div>
                      <p className="text-sm font-black text-slate-900 font-display">Password</p>
                      <p className="text-xs text-slate-500 font-medium">••••••••••••</p>
                    </div>
                    <button className="text-blue-500 text-xs font-black hover:underline uppercase tracking-widest">Reset</button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          {activeTab === 'history' && (
            <motion.div 
              key="history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <header className="mb-10 flex justify-between items-end">
                <div>
                  <h1 className="text-4xl font-black text-slate-900 font-display">Scan History</h1>
                  <p className="text-slate-500 mt-2 font-medium">Review your past magical assessments 📖</p>
                </div>
                <button 
                  onClick={() => {
                    setHistory([]);
                    localStorage.removeItem('carelens_history');
                  }}
                  className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                >
                  <Trash2 size={24} />
                </button>
              </header>

              {history.length === 0 ? (
                <div className="bg-white/80 backdrop-blur-xl rounded-bubble-lg p-16 text-center bubble-shadow border border-white/50">
                  <div className="w-24 h-24 bg-pastel-blue/50 rounded-bubble flex items-center justify-center text-blue-400 mx-auto mb-8 shadow-inner">
                    <History size={48} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 font-display">No magic yet!</h3>
                  <p className="text-slate-500 mt-3 font-medium">Your triage and skincare history will appear here once you start scanning.</p>
                  <button 
                    onClick={() => setActiveTab('triage')}
                    className="mt-10 px-10 py-5 bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-bubble font-black hover:scale-[1.05] active:scale-[0.95] transition-all shadow-xl shadow-blue-100"
                  >
                    Start First Scan ✨
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {history.map((item) => (
                    <motion.div 
                      key={item.id} 
                      whileHover={{ scale: 1.02 }}
                      className="bg-white/80 backdrop-blur-xl rounded-bubble p-5 bubble-shadow border border-white/50 flex gap-6 items-center transition-all group"
                    >
                      <img src={item.imageUrl} alt="Scan" className="w-24 h-24 rounded-bubble object-cover border-4 border-white shadow-md shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center shadow-sm",
                            item.type === 'triage' ? "bg-pastel-blue text-blue-500" : "bg-pastel-purple text-purple-500"
                          )}>
                            {item.type === 'triage' ? <Activity size={16} /> : <Sparkles size={16} />}
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            {new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <h4 className="font-black text-lg text-slate-900 truncate font-display">
                          {item.type === 'triage' ? (item.result as TriageResult).recommendation : (item.result as SkincareResult).condition}
                        </h4>
                        <div className="mt-3">
                          {item.type === 'triage' && (
                            <SeverityBadge level={(item.result as TriageResult).level} />
                          )}
                          {item.type === 'skincare' && (
                            <span className="text-xs text-purple-600 font-black bg-pastel-purple px-4 py-1.5 rounded-full border border-purple-100">
                              Skincare Analysis ✨
                            </span>
                          )}
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          setResult(item.result);
                          setImage(item.imageUrl);
                          if (item.symptoms) setSymptoms(item.symptoms);
                          setActiveTab(item.type as any);
                          setCurrentStep(3);
                        }}
                        className="p-4 text-slate-300 group-hover:text-blue-500 group-hover:bg-pastel-blue/50 rounded-full transition-all"
                      >
                        <ChevronRight size={32} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* AI Chatbot */}
      <div className="fixed bottom-24 right-6 z-50 md:bottom-8">
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20, transformOrigin: 'bottom right' }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="bg-white/90 backdrop-blur-xl w-[calc(100vw-3rem)] md:w-96 h-[32rem] rounded-bubble-lg bubble-shadow border border-white/50 flex flex-col mb-6 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-500 to-blue-400 p-6 text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-bubble flex items-center justify-center">
                    <Activity size={20} />
                  </div>
                  <div>
                    <h3 className="font-black font-display">CareLens AI</h3>
                    <p className="text-[10px] text-blue-100 font-bold uppercase tracking-widest">Online & Ready ✨</p>
                  </div>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <Plus className="rotate-45" size={24} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-pastel-blue/10">
                {chatMessages.length === 0 && (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 bg-white rounded-bubble flex items-center justify-center text-blue-400 mx-auto mb-4 shadow-sm">
                      <MessageSquare size={32} />
                    </div>
                    <p className="text-slate-500 text-sm font-medium">Hello! How can I help you today? 🌸</p>
                  </div>
                )}
                {chatMessages.map((msg, i) => (
                  <div key={i} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
                    <div className={cn(
                      "max-w-[85%] p-4 rounded-bubble text-sm font-medium shadow-sm",
                      msg.role === 'user' 
                        ? "bg-blue-500 text-white rounded-tr-none" 
                        : "bg-white text-slate-700 rounded-tl-none border border-blue-50"
                    )}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-blue-50 flex gap-2">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-pastel-blue/20 border-none rounded-full px-5 py-3 text-sm focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                />
                <button type="submit" className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center hover:scale-110 active:scale-90 transition-all shadow-lg shadow-blue-100">
                  <Send size={20} />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
        
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-400 text-white rounded-bubble flex items-center justify-center shadow-2xl shadow-blue-200 hover:scale-110 active:scale-90 transition-all relative group"
        >
          <div className="absolute inset-0 bg-blue-400 rounded-bubble animate-ping opacity-20 group-hover:opacity-40 transition-opacity" />
          {isChatOpen ? <Plus className="rotate-45" size={32} /> : <MessageSquare size={32} />}
        </button>
      </div>
    </div>
  );
}

function NavButton({ active, onClick, icon, label, color = 'blue' }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, color?: string }) {
  const colorConfigs: Record<string, string> = {
    blue: "text-blue-500 md:bg-pastel-blue/50",
    purple: "text-purple-500 md:bg-pastel-purple/50",
    emerald: "text-emerald-500 md:bg-pastel-green/50",
    amber: "text-amber-500 md:bg-pastel-yellow/50",
    indigo: "text-indigo-500 md:bg-pastel-purple/50",
    slate: "text-slate-500 md:bg-slate-100/50",
  };

  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col md:flex-row items-center gap-1.5 md:gap-3 px-4 py-2 rounded-bubble transition-all relative group",
        active ? colorConfigs[color] : "text-slate-400 hover:text-slate-600 hover:bg-slate-50/50"
      )}
    >
      <motion.div
        animate={active ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
        transition={{ duration: 0.5 }}
      >
        {icon}
      </motion.div>
      <span className="text-[10px] md:text-sm font-black uppercase md:capitalize tracking-widest md:tracking-tight font-display">{label}</span>
      {active && (
        <motion.div 
          layoutId="nav-active" 
          className="absolute -bottom-1 md:bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-current rounded-full md:hidden" 
        />
      )}
    </button>
  );
}

function StatCard({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white/80 backdrop-blur-xl p-6 rounded-bubble bubble-shadow border border-white/50 group hover:scale-105 transition-all">
      <div className="flex justify-between items-start mb-4">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none font-display">{label}</span>
        <div className="p-2 bg-pastel-blue rounded-bubble group-hover:rotate-12 transition-transform">
          {icon}
        </div>
      </div>
      <div className="text-3xl font-black text-slate-900 font-display">{value}</div>
    </div>
  );
}
