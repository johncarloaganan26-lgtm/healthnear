/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { X, Check } from 'lucide-react';
import { FilterState, HealthcareCategory } from '../types';
import { Translation } from '../translations';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onUpdateFilters: (filters: FilterState) => void;
  isDarkMode?: boolean;
  t: Translation;
}

export default function FilterDrawer({ isOpen, onClose, filters, onUpdateFilters, isDarkMode, t }: FilterDrawerProps) {
  const categories: { label: string; value: HealthcareCategory | 'all' }[] = [
    { label: t.allServices, value: 'all' },
    { label: t.hospitals, value: 'hospital' },
    { label: t.pharmacies, value: 'pharmacy' },
    { label: t.dental, value: 'dentist' },
    { label: t.clinics, value: 'clinic' },
    { label: t.labs, value: 'laboratory' },
    { label: t.veterinary, value: 'vet' },
    { label: t.emergency, value: 'emergency' },
  ];

  const distances = [1, 5, 10, 20];
  const ratings = [3, 4, 4.5];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[1001]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed right-0 top-0 bottom-0 w-full max-w-sm shadow-2xl z-[1002] flex flex-col border-l transition-colors ${
              isDarkMode ? 'bg-dark-surface border-dark-border text-dark-text' : 'bg-[#FDFCF8] border-medical-border text-medical-text'
            }`}
          >
            <div className={`p-6 border-b flex items-center justify-between transition-colors ${
              isDarkMode ? 'bg-dark-surface border-dark-border' : 'bg-white border-medical-border'
            }`}>
              <h2 className="text-xl font-bold tracking-tight">{t.filterBy}</h2>
              <button 
                onClick={onClose}
                className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-dark-bg' : 'hover:bg-medical-surface'}`}
              >
                <X size={20} className="text-medical-accent" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Category */}
              <section>
                <h3 className="text-xs font-bold uppercase tracking-widest text-medical-accent mb-4">{t.categories}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => onUpdateFilters({ ...filters, category: cat.value })}
                      className={`px-4 py-2.5 text-sm rounded-xl border transition-all flex items-center justify-between ${
                        filters.category === cat.value
                        ? 'bg-medical-primary text-white border-medical-primary font-bold'
                        : isDarkMode 
                          ? 'bg-dark-bg border-dark-border text-dark-text hover:border-medical-accent' 
                          : 'bg-white border-medical-border text-medical-text hover:border-medical-accent'
                      }`}
                    >
                      {cat.label}
                      {filters.category === cat.value && <Check size={14} />}
                    </button>
                  ))}
                </div>
              </section>

              {/* Distance */}
              <section>
                <h3 className="text-xs font-bold uppercase tracking-widest text-medical-accent mb-4">{t.maxDistance}</h3>
                <div className={`flex gap-2 p-1 rounded-xl ${isDarkMode ? 'bg-dark-bg' : 'bg-medical-border/30'}`}>
                  {distances.map((d) => (
                    <button
                      key={d}
                      onClick={() => onUpdateFilters({ ...filters, maxDistance: d })}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                        filters.maxDistance === d
                        ? isDarkMode ? 'bg-medical-primary text-white' : 'bg-white text-medical-primary shadow-sm'
                        : 'text-medical-text opacity-60 hover:opacity-100'
                      }`}
                    >
                      {d} {t.km}
                    </button>
                  ))}
                </div>
              </section>

              {/* Rating */}
              <section>
                <h3 className="text-xs font-bold uppercase tracking-widest text-medical-accent mb-4">{t.minRating}</h3>
                <div className="flex gap-2">
                  {ratings.map((r) => (
                    <button
                      key={r}
                      onClick={() => onUpdateFilters({ ...filters, minRating: r })}
                      className={`flex-1 py-2 text-sm rounded-xl border transition-all ${
                        filters.minRating === r
                        ? 'bg-medical-primary text-white border-medical-primary font-bold'
                        : isDarkMode
                          ? 'bg-dark-bg border-dark-border text-dark-text hover:border-medical-accent'
                          : 'bg-white border-medical-border text-medical-text hover:border-medical-accent'
                      }`}
                    >
                      {r}+ ⭐
                    </button>
                  ))}
                </div>
              </section>

              {/* Status */}
              <section>
                <label className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer group transition-colors ${
                  isDarkMode ? 'bg-dark-bg border-dark-border shadow-inner' : 'bg-[#F4F7F2] border-medical-border'
                }`}>
                  <div className={`w-12 h-6 rounded-full transition-colors relative ${filters.openOnly ? 'bg-medical-primary' : isDarkMode ? 'bg-slate-700' : 'bg-slate-300'}`}>
                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${filters.openOnly ? 'translate-x-6' : ''}`} />
                  </div>
                  <span className="text-sm font-bold tracking-tight">{t.openNow} Only</span>
                  <input 
                    type="checkbox" 
                    className="hidden"
                    checked={filters.openOnly}
                    onChange={(e) => onUpdateFilters({ ...filters, openOnly: e.target.checked })}
                  />
                </label>
              </section>
            </div>

            <div className={`p-6 border-t font-sans transition-colors ${
              isDarkMode ? 'bg-dark-surface border-dark-border' : 'bg-white border-medical-border'
            }`}>
              <button 
                onClick={onClose}
                className="w-full py-4 bg-medical-primary text-white rounded-2xl font-bold shadow-lg shadow-medical-primary/20 hover:bg-[#5A7A50] active:scale-[0.98] transition-all"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
