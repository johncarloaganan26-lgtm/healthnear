/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { Search, Map as MapIcon, List, Settings2, ShieldAlert, Heart, ChevronRight, Activity, Phone, Navigation, X as XIcon, MapPin, LocateFixed, Building2, Pill, Stethoscope, Beaker, Dog, Thermometer, Sun, Moon, User, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useGeolocation } from './hooks/useGeolocation';
import { HealthcareFacility, FilterState, UserLocation } from './types';
import { fetchNearbyHealthcare, calculateDistance } from './services/healthcareService';
import MapDisplay from './components/MapDisplay';
import FacilityCard from './components/FacilityCard';
import FilterDrawer from './components/FilterDrawer';
import EmergencyFAB from './components/EmergencyFAB';
import AuthScreen from './components/AuthScreen';
import { translations, languages, type LanguageCode } from './translations';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const { location: userLocation, error: geoError, loading: geoLoading, refresh: refreshGeo } = useGeolocation();
  const [facilities, setFacilities] = useState<HealthcareFacility[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<HealthcareFacility | null>(null);
  const [activeTab, setActiveTab] = useState<'map' | 'list'>('list');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isHome, setIsHome] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [savedFacilities, setSavedFacilities] = useState<HealthcareFacility[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [pendingSave, setPendingSave] = useState<HealthcareFacility | null>(null);
  const [currentLang, setCurrentLang] = useState<LanguageCode>('en');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const t = translations[currentLang];
  
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    maxDistance: 10,
    minRating: 0,
    openOnly: false,
  });

  const [lastFetchLocation, setLastFetchLocation] = useState<UserLocation | null>(null);

  // Fetch facilities when location changes
  useEffect(() => {
    if (userLocation && !isHome) {
      if (!lastFetchLocation) {
        loadData(userLocation);
      } else {
        const distanceMoved = calculateDistance(
          userLocation.lat, 
          userLocation.lon, 
          lastFetchLocation.lat, 
          lastFetchLocation.lon
        );
        // Only refresh if moved more than 500 meters (0.5km)
        if (distanceMoved > 0.5) {
          loadData(userLocation);
        }
      }
    }
  }, [userLocation, isHome, lastFetchLocation]);

  // Load saved facilities from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('healthpulse_saved');
    if (saved) {
      try {
        setSavedFacilities(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved facilities", e);
      }
    }
  }, []);

  // Save to localStorage when changed
  useEffect(() => {
    localStorage.setItem('healthpulse_saved', JSON.stringify(savedFacilities));
  }, [savedFacilities]);

  const loadData = async (loc: UserLocation) => {
    setIsLoading(true);
    setLastFetchLocation(loc);
    const data = await fetchNearbyHealthcare(loc, filters.maxDistance * 1000);
    const withDistance = data.map(f => ({
      ...f,
      distance: calculateDistance(loc.lat, loc.lon, f.lat, f.lon)
    })).sort((a, b) => (a.distance || 0) - (b.distance || 0));
    
    setFacilities(withDistance);
    setIsLoading(false);
  };

  const filteredFacilities = useMemo(() => {
    return facilities.filter(f => {
      const matchCategory = filters.category === 'all' || f.category === filters.category;
      const matchDistance = (f.distance || 0) <= filters.maxDistance;
      const matchRating = (f.rating || 0) >= filters.minRating;
      const matchSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          f.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchDistance && matchRating && matchSearch;
    });
  }, [facilities, filters, searchQuery]);

  const handleToggleSave = (fac: HealthcareFacility) => {
    if (!isLoggedIn) {
      setPendingSave(fac);
      setIsAuthOpen(true);
      return;
    }

    setSavedFacilities(prev => {
      const isExist = prev.some(f => f.id === fac.id);
      if (isExist) {
        return prev.filter(f => f.id === fac.id ? false : true);
      } else {
        return [...prev, fac];
      }
    });
  };

  const onAuthSuccess = () => {
    setIsLoggedIn(true);
    setIsAuthOpen(false);
    if (pendingSave) {
      handleToggleSave(pendingSave);
      setPendingSave(null);
    }
  };

  const handleNearMe = () => {
    setIsHome(false);
    setActiveTab('map');
  };

  const handleDirections = (fac: HealthcareFacility) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${fac.lat},${fac.lon}&travelmode=driving`;
    window.open(url, '_blank');
  };

  const currentView = useMemo(() => {
    if (isHome) return 'home';
    return activeTab;
  }, [isHome, activeTab]);

  if (geoError && !isHome) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-medical-surface p-6 text-center">
        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mb-6 border border-rose-100">
          <ShieldAlert size={40} />
        </div>
        <h2 className="text-2xl font-black text-medical-text tracking-tight">Location Access Required</h2>
        <p className="text-slate-500 mt-3 max-w-md font-medium leading-relaxed">
          {geoError}
        </p>
        <p className="text-sm text-medical-primary mt-4 font-bold">
          Tip: Try opening the app in a new tab if permissions don't appear.
        </p>
        <div className="flex gap-4 mt-8 w-full max-w-sm">
          <button 
            onClick={() => setIsHome(true)}
            className="flex-1 py-4 px-6 bg-white border border-medical-border text-medical-text rounded-2xl font-bold transition-all active:scale-95"
          >
            {t.backHome}
          </button>
          <button 
            onClick={() => refreshGeo()}
            className="flex-1 py-4 px-6 bg-medical-primary text-white rounded-2xl font-bold natural-shadow transition-all active:scale-95"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (geoLoading && !isHome) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-medical-surface p-6 text-center">
        <div className="relative">
          <Activity className="animate-spin text-medical-primary mb-6" size={56} />
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-medical-primary rounded-full blur-xl -z-10"
          />
        </div>
        <h2 className="text-2xl font-black text-medical-text tracking-tight">Locating Facilities...</h2>
        <p className="text-slate-500 mt-3 max-w-sm font-medium leading-relaxed">
          Please allow location access if prompted. We're searching for healthcare near your current pulse.
        </p>

        <div className="mt-10 p-6 bg-white border border-medical-border rounded-[2rem] max-w-sm w-full natural-shadow">
          <p className="text-xs font-bold text-medical-accent uppercase tracking-[0.2em] mb-4">Taking too long?</p>
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => refreshGeo()}
              className="w-full py-4 bg-medical-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              Refresh GPS
            </button>
            <button 
              onClick={() => setIsHome(true)}
              className="w-full py-4 text-medical-text font-bold hover:bg-medical-surface rounded-2xl transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen flex flex-col overflow-hidden max-w-7xl mx-auto border-x natural-shadow relative transition-colors duration-300 ${
      isDarkMode ? 'bg-[#121412] border-dark-border text-dark-text dark' : 'bg-medical-surface border-medical-border text-medical-text'
    }`}>
      <AuthScreen 
        isOpen={isAuthOpen}
        onClose={() => {
          setIsAuthOpen(false);
          setPendingSave(null);
        }}
        onSuccess={onAuthSuccess}
        isDarkMode={isDarkMode}
        t={t}
      />

      {/* Global Header */}
      <header className={`px-6 py-4 flex items-center justify-between z-[1000] sticky top-0 backdrop-blur-md border-b transition-colors ${
        isDarkMode ? 'bg-dark-surface/80 border-dark-border' : 'bg-white/80 border-medical-border'
      }`}>
        <div 
          onClick={() => setIsHome(true)}
          className="flex items-center gap-3 text-medical-primary cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div className="bg-medical-primary/15 p-2 rounded-xl text-medical-primary border border-medical-primary/10">
            <Activity size={20} />
          </div>
          <span className="font-bold tracking-tight text-xl hidden sm:block italic">HealthPulse</span>
        </div>

        {!isHome && (
          <div className="flex-1 max-w-xl mx-6 group relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A7C091] group-focus-within:text-medical-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder={t.searchPlaceholder}
              className={`w-full pl-10 pr-10 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-medical-primary transition-all outline-none ${
                isDarkMode ? 'bg-dark-bg border-dark-border text-dark-text' : 'bg-[#FDFCF8] border-medical-border text-medical-text'
              }`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleNearMe()}
            />
          </div>
        )}

        <div className="flex items-center gap-4 sm:gap-8 ml-auto">
          <div className="relative">
            <button 
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="p-1 transition-all active:scale-90 text-xl sm:text-2xl hover:opacity-70"
              aria-label="Change Language"
            >
              {languages.find(l => l.code === currentLang)?.flag}
            </button>
            <AnimatePresence>
              {isLangMenuOpen && (
                <>
                  <div className="fixed inset-0 z-[1001]" onClick={() => setIsLangMenuOpen(false)} />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className={cn(
                      "absolute right-0 mt-3 w-48 sm:w-56 rounded-[1.5rem] sm:rounded-[2rem] natural-shadow z-[1002] p-2 sm:p-3 overflow-hidden border",
                      isDarkMode ? "bg-dark-surface border-dark-border" : "bg-white border-medical-border"
                    )}
                  >
                    {languages.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setCurrentLang(lang.code);
                          setIsLangMenuOpen(false);
                        }}
                        className={cn(
                          "w-full text-left px-3 py-3 sm:px-4 sm:py-4 rounded-xl sm:rounded-2xl flex items-center gap-3 sm:gap-4 transition-colors",
                          currentLang === lang.code 
                            ? "bg-medical-primary/10 text-medical-primary font-bold" 
                            : isDarkMode ? "hover:bg-dark-bg text-dark-text" : "hover:bg-medical-surface text-medical-text"
                        )}
                      >
                        <span className="text-xl sm:text-2xl">{lang.flag}</span>
                        <span className="text-sm sm:text-base">{lang.name}</span>
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-1 transition-all active:scale-90 text-medical-primary hover:text-medical-accent`}
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
          </button>

          <button 
            onClick={() => setIsFilterOpen(true)}
            className={`p-2 rounded-xl transition-all active:scale-90 ${
              isDarkMode ? 'bg-dark-border text-medical-accent hover:bg-medical-text' : 'bg-medical-border/50 text-medical-text hover:bg-medical-border'
            }`}
          >
            <Settings2 size={20} />
          </button>

          <button 
            onClick={() => isLoggedIn ? setIsLoggedIn(false) : setIsAuthOpen(true)}
            className={`p-1 transition-all active:scale-90 text-medical-primary hover:text-medical-accent`}
            aria-label="User Account"
          >
            {isLoggedIn ? <ShieldCheck size={22} /> : <User size={22} />}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {isHome ? (
            <motion.div
              key="home"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`h-full flex flex-col p-4 sm:p-8 transition-colors max-w-full lg:max-w-6xl mx-auto w-full ${
                isDarkMode ? 'bg-[#121412]' : 'bg-medical-surface'
              }`}
            >
              <div className="flex-1 flex flex-col items-center justify-center py-12 space-y-12 w-full">
                <div className="space-y-6">
                  <h1 className={`text-4xl sm:text-7xl font-black leading-tight sm:leading-[1.1] tracking-tight transition-colors text-center max-w-4xl mx-auto ${
                    isDarkMode ? 'text-dark-text' : 'text-medical-text'
                  }`}>
                    {t.homeTitle}<br/><span className="text-medical-accent">{t.homeSubtitle}</span>
                  </h1>
                  <p className={`text-lg sm:text-2xl font-medium opacity-60 text-center max-w-2xl mx-auto ${isDarkMode ? 'text-dark-text' : 'text-medical-text'}`}>
                    Precision healthcare tracking, exactly where you need it.
                  </p>
                </div>

                {/* Home Search Bar Centered */}
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-3xl">
                  <div className="relative flex-1 group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#A7C091] group-focus-within:text-medical-primary transition-colors" size={24} />
                    <input 
                      type="text" 
                      placeholder={t.searchPlaceholder}
                      className={`w-full pl-14 pr-6 py-6 border-2 border-transparent focus:border-medical-primary rounded-[2rem] text-xl focus:ring-0 transition-all outline-none natural-shadow placeholder:text-medical-accent/40 ${
                        isDarkMode ? 'bg-dark-surface text-dark-text' : 'bg-white text-medical-text'
                      }`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleNearMe()}
                    />
                  </div>
                  <button 
                    onClick={handleNearMe}
                    className="px-10 py-6 bg-medical-primary text-white rounded-[2rem] flex items-center justify-center gap-3 text-lg font-bold natural-shadow hover:bg-[#5A7A50] transition-all active:scale-95 group"
                  >
                    <LocateFixed size={24} className="group-hover:rotate-12 transition-transform" />
                    {t.nearMe}
                  </button>
                </div>
              </div>

              <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2 pb-8">
                <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 mt-4 transition-colors ${
                  isDarkMode ? 'text-medical-accent' : 'text-medical-accent/80'
                }`}>
                  {t.quickAccess}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {[
                    { label: t.hospitals, icon: <Building2 size={24} />, category: 'hospital', color: 'text-blue-500', bg: isDarkMode ? 'bg-blue-500/10' : 'bg-blue-50' },
                    { label: t.pharmacies, icon: <Pill size={22} />, category: 'pharmacy', color: 'text-green-500', bg: isDarkMode ? 'bg-green-500/10' : 'bg-green-50' },
                    { label: t.dental, icon: <Activity size={22} />, category: 'dentist', color: 'text-cyan-500', bg: isDarkMode ? 'bg-cyan-500/10' : 'bg-cyan-50' },
                    { label: t.clinics, icon: <Stethoscope size={22} />, category: 'clinic', color: 'text-medical-primary', bg: isDarkMode ? 'bg-medical-primary/10' : 'bg-medical-surface' },
                    { label: t.labs, icon: <Beaker size={22} />, category: 'laboratory', color: 'text-purple-500', bg: isDarkMode ? 'bg-purple-500/10' : 'bg-purple-50' },
                    { label: t.veterinary, icon: <Dog size={22} />, category: 'vet', color: 'text-orange-500', bg: isDarkMode ? 'bg-orange-500/10' : 'bg-orange-50' },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => {
                        setFilters({ ...filters, category: item.category as any });
                        handleNearMe();
                      }}
                      className={`p-4 sm:p-6 border transition-all rounded-3xl flex flex-col items-start text-left gap-4 group active:scale-95 touch-manipulation ${
                        isDarkMode ? 'bg-dark-surface border-dark-border hover:border-medical-primary' : 'bg-white border-medical-border hover:border-medical-primary hover:shadow-md'
                      }`}
                    >
                      <div className={`p-3 rounded-2xl ${item.bg} ${item.color} group-hover:scale-110 transition-transform`}>
                        {item.icon}
                      </div>
                      <span className={`text-sm font-bold tracking-tight ${isDarkMode ? 'text-dark-text' : 'text-medical-text'}`}>{item.label}</span>
                    </button>
                  ))}
                </div>

                <div className="pt-8">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-medical-accent mb-4 flex items-center gap-2">
                    <Heart size={16} className="text-medical-emergency" />
                    {t.savedLocations} ({savedFacilities.length})
                  </h3>
                  <div className="space-y-3">
                    {savedFacilities.length > 0 ? (
                      <div className="flex flex-col gap-3">
                        {savedFacilities.map(fac => (
                          <div 
                            key={fac.id}
                            className={`p-4 rounded-2xl border transition-all flex items-center justify-between group cursor-pointer ${
                              isDarkMode ? 'bg-dark-surface border-dark-border hover:border-medical-primary' : 'bg-white border-medical-border hover:border-medical-primary'
                            }`}
                            onClick={() => {
                              setSelectedFacility(fac);
                              setIsHome(false);
                              setActiveTab('map');
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-xl ${
                                fac.category === 'pharmacy' ? 'bg-green-50 text-green-600' :
                                fac.category === 'hospital' ? 'bg-blue-50 text-blue-600' :
                                'bg-medical-surface text-medical-primary'
                              }`}>
                                <Activity size={18} />
                              </div>
                              <div>
                                <h4 className="font-bold text-sm tracking-tight">{fac.name}</h4>
                                <p className="text-[10px] uppercase font-bold text-medical-accent tracking-tighter">{fac.category}</p>
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleSave(fac);
                              }}
                              className="p-2 text-medical-emergency bg-rose-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-100"
                            >
                              <XIcon size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={`p-4 border border-dashed rounded-2xl flex items-center justify-center text-sm font-medium ${
                        isDarkMode ? 'bg-dark-surface border-dark-border text-medical-accent/50' : 'bg-[#FDFCF8] border-medical-border text-medical-accent'
                      }`}>
                        {t.noSavedLocations}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col lg:flex-row overflow-hidden"
            >
              {/* Results List Section */}
              <div className={`flex-1 lg:flex-none lg:w-[400px] xl:w-[450px] overflow-y-auto custom-scrollbar transition-colors border-r ${
                isDarkMode ? 'bg-dark-bg border-dark-border' : 'bg-medical-surface border-medical-border'
              } ${activeTab === 'list' ? 'flex flex-col' : 'hidden lg:flex lg:flex-col'}`}>
                <div className={`sticky top-0 backdrop-blur-md px-4 py-4 border-b z-10 flex justify-between items-center px-6 transition-colors ${
                  isDarkMode ? 'bg-dark-surface/90 border-dark-border text-dark-text' : 'bg-white/90 border-medical-border text-medical-accent'
                }`}>
                  <span className="text-xs font-bold uppercase tracking-widest">
                    {filteredFacilities.length} {t.resultsNearYou}
                  </span>
                  <button 
                    onClick={() => setIsHome(true)}
                    className="text-xs font-bold text-medical-primary uppercase tracking-tight hover:underline"
                  >
                    {t.backHome}
                  </button>
                </div>
                {filteredFacilities.length > 0 ? (
                  <div className="p-4 space-y-4">
                    {filteredFacilities.map(f => (
                      <FacilityCard 
                        key={f.id} 
                        facility={f} 
                        isDarkMode={isDarkMode}
                        isSaved={savedFacilities.some(sf => sf.id === f.id)}
                        isSelected={selectedFacility?.id === f.id}
                        onClick={() => {
                          setSelectedFacility(f);
                        }}
                        onDirections={handleDirections}
                        onToggleSave={handleToggleSave}
                        t={t}
                      />
                    ))}
                  </div>
                ) : (
                  <div className={`p-12 text-center transition-colors ${isDarkMode ? 'text-medical-accent/60' : 'text-medical-accent'}`}>
                    <p className="font-medium">{t.noResults}</p>
                  </div>
                )}
              </div>

              {/* Map Section */}
              <div className={`flex-1 relative ${activeTab === 'map' ? 'block' : 'hidden lg:block'}`}>
                {userLocation ? (
                  <MapDisplay 
                    userLocation={userLocation}
                    facilities={filteredFacilities}
                    selectedFacility={selectedFacility}
                    onSelectFacility={setSelectedFacility}
                    isDarkMode={isDarkMode}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center p-12 text-center text-slate-500">
                    Location required to view map
                  </div>
                )}
              </div>

              {/* View Toggle (Mobile Only) */}
              <div className={`lg:hidden absolute bottom-6 left-1/2 -translate-x-1/2 p-1.5 backdrop-blur-md shadow-2xl rounded-[1.5rem] border z-[1001] flex gap-1 items-center transition-colors ${
                isDarkMode ? 'bg-dark-surface/95 border-dark-border' : 'bg-white/95 border-medical-border'
              }`}>
                <button
                  onClick={() => setActiveTab('list')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all active:scale-95 ${
                    activeTab === 'list' ? 'bg-medical-primary text-white shadow-lg' : isDarkMode ? 'text-dark-text hover:bg-dark-bg' : 'text-medical-text hover:bg-medical-surface'
                  }`}
                >
                  <List size={16} />
                  {t.listView}
                </button>
                <div className={`w-[1px] h-4 mx-1 ${isDarkMode ? 'bg-dark-border' : 'bg-medical-border'}`} />
                <button
                  onClick={() => setActiveTab('map')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all active:scale-95 ${
                    activeTab === 'map' ? 'bg-medical-primary text-white shadow-lg' : isDarkMode ? 'text-dark-text hover:bg-dark-bg' : 'text-medical-text hover:bg-medical-surface'
                  }`}
                >
                  <MapIcon size={16} />
                  {t.mapView}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <FilterDrawer 
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onUpdateFilters={setFilters}
        isDarkMode={isDarkMode}
        t={t}
      />

      <EmergencyFAB 
        onClick={() => {
          setFilters({ ...filters, category: 'emergency' });
          handleNearMe();
        }} 
        isDarkMode={isDarkMode}
      />

      {/* Floating Selected Details */}
      <AnimatePresence>
        {selectedFacility && activeTab === 'map' && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className={`absolute bottom-24 left-4 right-4 backdrop-blur-md p-6 rounded-[2rem] natural-shadow z-[1000] border transition-colors ${
              isDarkMode ? 'bg-dark-surface/95 border-dark-border text-dark-text' : 'bg-white/95 border-medical-border'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold tracking-tight">{selectedFacility.name}</h3>
                <p className="text-xs text-medical-accent uppercase tracking-widest font-bold mt-1">{selectedFacility.category}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleSave(selectedFacility)}
                  className={cn(
                    "p-2 rounded-full transition-all active:scale-90",
                    savedFacilities.some(sf => sf.id === selectedFacility.id)
                      ? "text-medical-emergency bg-rose-50"
                      : "text-medical-accent hover:bg-medical-surface"
                  )}
                >
                  <Heart size={20} className={savedFacilities.some(sf => sf.id === selectedFacility.id) ? "fill-current" : ""} />
                </button>
                <button 
                  onClick={() => setSelectedFacility(null)}
                  className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-dark-bg' : 'hover:bg-medical-surface'}`}
                >
                  <XIcon size={20} className="text-medical-accent" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <a 
                href={`tel:${selectedFacility.phone}`}
                className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all border active:scale-95 ${
                  isDarkMode ? 'bg-dark-bg border-dark-border text-medical-primary hover:bg-black/20' : 'bg-medical-surface border-medical-border text-medical-primary hover:bg-white'
                }`}
              >
                <Phone size={18} />
                {t.call}
              </a>
              <button 
                onClick={() => handleDirections(selectedFacility)}
                className="flex items-center justify-center gap-2 py-4 bg-medical-primary text-white rounded-2xl font-bold natural-shadow transition-all hover:bg-[#5A7A50] active:scale-95"
              >
                <Navigation size={18} />
                {t.directions}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
