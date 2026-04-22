/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Star, MapPin, Clock, Phone, Navigation, Heart } from 'lucide-react';
import { HealthcareFacility } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Translation } from '../translations';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface FacilityCardProps {
  key?: string | number;
  facility: HealthcareFacility;
  isSelected?: boolean;
  isDarkMode?: boolean;
  isSaved?: boolean;
  onClick: () => void;
  onDirections?: (healthcareFacility: HealthcareFacility) => void;
  onToggleSave?: (healthcareFacility: HealthcareFacility) => void;
  t: Translation;
}

export default function FacilityCard({ facility, isSelected, isDarkMode, isSaved, onClick, onDirections, onToggleSave, t }: FacilityCardProps) {
  const categoryColors = {
    hospital: 'text-blue-600 bg-blue-50 border-blue-200',
    pharmacy: 'text-green-600 bg-green-50 border-green-200',
    emergency: 'text-medical-emergency bg-rose-50 border-medical-emergency',
    dentist: 'text-cyan-600 bg-cyan-50 border-cyan-200',
    clinic: 'text-medical-primary bg-medical-surface border-medical-primary',
    laboratory: 'text-purple-600 bg-purple-50 border-purple-200',
    vet: 'text-orange-600 bg-orange-50 border-orange-200',
  };

  const categoryLabels: Record<string, string> = {
    hospital: t.hospitals,
    pharmacy: t.pharmacies,
    clinic: t.clinics,
    laboratory: t.labs,
    vet: t.veterinary,
    emergency: t.emergency,
    dentist: 'Dental'
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className={cn(
        "p-4 sm:p-6 rounded-[2rem] natural-shadow border transition-all cursor-pointer group active:scale-[0.98] relative",
        isDarkMode 
          ? "bg-dark-surface border-dark-border hover:border-medical-primary" 
          : "bg-white border-transparent hover:border-medical-primary",
        isSelected && (isDarkMode ? "border-medical-primary bg-dark-bg" : "border-medical-primary bg-[#FDFCF8]")
      )}
      id={`facility-card-${facility.id}`}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleSave?.(facility);
        }}
        className={cn(
          "absolute top-4 right-4 p-2 rounded-full transition-all active:scale-90 z-10",
          isSaved 
            ? "text-medical-emergency bg-rose-50 border border-rose-100" 
            : "text-medical-accent hover:bg-medical-surface"
        )}
      >
        <Heart size={20} className={isSaved ? "fill-current" : ""} />
      </button>

      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 pr-10">
          <h3 className={cn(
            "font-bold text-lg leading-tight mb-1 transition-colors",
            isDarkMode ? "text-dark-text" : "text-medical-text"
          )}>
            {facility.name}
          </h3>
          <span className={cn(
            "inline-block px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider border",
            categoryColors[facility.category as keyof typeof categoryColors] || 'text-slate-600 bg-slate-50 border-slate-200'
          )}>
            {categoryLabels[facility.category] || facility.category}
          </span>
        </div>
        <div className={cn(
          "p-2.5 rounded-2xl transition-colors",
          isDarkMode ? "bg-dark-bg text-medical-primary" : "bg-medical-surface text-medical-primary"
        )}>
          <Navigation size={18} />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs text-medical-accent mb-5">
        <div className="flex items-center gap-1.5 font-medium">
          <div className="w-1.5 h-1.5 rounded-full bg-medical-primary" />
          <span>{facility.distance} {t.km}</span>
        </div>
        {facility.rating && (
          <div className="flex items-center gap-1 border-l border-medical-border pl-3">
            <Star size={14} className="text-amber-400 fill-amber-400" />
            <span className={cn("font-bold", isDarkMode ? "text-dark-text" : "text-medical-text")}>{facility.rating}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDirections?.(facility);
          }}
          className="flex items-center justify-center gap-2 py-3.5 bg-medical-primary text-white text-sm font-bold rounded-2xl hover:bg-[#5A7A50] transition-colors shadow-lg shadow-medical-primary/10 active:scale-95"
        >
          {t.directions}
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            window.location.href = `tel:${facility.phone}`;
          }}
          className={cn(
            "flex items-center justify-center gap-2 py-3.5 text-sm font-bold rounded-2xl border transition-all active:scale-95",
            isDarkMode 
              ? "bg-dark-bg text-dark-text border-dark-border hover:bg-black/20" 
              : "bg-white text-medical-text border-medical-border hover:bg-medical-surface"
          )}
        >
          <Phone size={16} />
          {t.call}
        </button>
      </div>
    </motion.div>
  );
}
