/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { HealthcareFacility, UserLocation } from '../types';
import { useEffect, useState } from 'react';
import { LocateFixed } from 'lucide-react';

interface MapDisplayProps {
  userLocation: UserLocation;
  facilities: HealthcareFacility[];
  selectedFacility: HealthcareFacility | null;
  onSelectFacility: (facility: HealthcareFacility) => void;
  isDarkMode?: boolean;
}

// Custom Marker Icons
const getIcon = (category: string, isDarkMode?: boolean) => {
  const colors: Record<string, string> = {
    hospital: '#3B82F6', // Blue
    pharmacy: '#10B981', // Green
    emergency: '#EF4444', // Red
    dentist: '#06B6D4', // Cyan
    clinic: '#6B8E61', // Medical Primary
    laboratory: '#8B5CF6', // Purple
    vet: '#F97316', // Orange
  };

  const icons: Record<string, string> = {
    hospital: '<path d="M12 2v20M2 12h20"/>', // Plus/Hospital
    pharmacy: '<path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/>', // Pill
    emergency: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="M12 8v4"/><path d="M12 16h.01"/>', // Shield/Alert
    dentist: '<path d="M12 2c-.5 0-1 .5-1 1v2c0 .5.5 1 1 1s1-.5 1-1V3c0-.5-.5-1-1-1Z"/><path d="M20 9c0 3.5-3 6-3 6s-1.5 2-1.5 4a3.5 3.5 0 1 1-7 0c0-2-1.5-4-1.5-4S4 12.5 4 9c0-3.5 1.5-7 8-7s8 3.5 8 7Z"/>', // Tooth (best effort approx) 
    clinic: '<path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v1a1 1 0 0 0 2 0v-1a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.3.3 0 1 0 .2.3"/>', // Stethoscope
    laboratory: '<path d="M4.5 3h15"/><path d="M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3"/><path d="M6 14h12"/>', // Beaker
    vet: '<path d="M10 21v-3.4c0-.3.3-.6.6-.6h1.7c.3 0 .6.3.6.6V21"/><path d="M11 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"/><path d="M15 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"/><path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Z"/>', // Paw/Pet
  };

  const activeIcon = icons[category] || icons['hospital'];
  const activeColor = colors[category] || colors['hospital'];

  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div class="medical-marker natural-shadow" style="background-color: ${isDarkMode ? '#1E211E' : '#FFFFFF'}; color: ${activeColor}; border: 2px solid ${isDarkMode ? activeColor : activeColor}">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${activeIcon}</svg>
           </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
};

function MapRecenter({ center, zoom }: { center: [number, number], zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom || map.getZoom());
  }, [center, map, zoom]);
  return null;
}

export default function MapDisplay({ userLocation, facilities, selectedFacility, onSelectFacility, isDarkMode }: MapDisplayProps) {
  const [viewTarget, setViewTarget] = useState<[number, number] | null>(null);
  const userCoords: [number, number] = [userLocation.lat, userLocation.lon];

  // Update view target when selected facility changes
  useEffect(() => {
    if (selectedFacility) {
      setViewTarget([selectedFacility.lat, selectedFacility.lon]);
    }
  }, [selectedFacility]);

  const handleRecenter = () => {
    setViewTarget(userCoords);
    // Brief delay to allow effect to run, then clear it so we can re-trigger
    setTimeout(() => setViewTarget(null), 100);
  };

  return (
    <div className="w-full h-full relative" id="map-container">
      <MapContainer 
        center={userCoords} 
        zoom={14} 
        scrollWheelZoom={true} 
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url={isDarkMode 
            ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          }
        />
        
        {/* User Location Marker */}
        <Marker 
          position={userCoords} 
          zIndexOffset={1000}
          icon={L.divIcon({
            className: 'user-marker-container',
            html: `
              <div class="relative flex items-center justify-center">
                <div class="absolute w-8 h-8 bg-blue-500/20 rounded-full animate-ping"></div>
                <div class="relative w-5 h-5 bg-blue-500 border-2 border-white rounded-full shadow-lg"></div>
              </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          })}
        >
          <Popup>You are here</Popup>
        </Marker>

        {/* Facility Markers */}
        {facilities.map((fac) => (
          <Marker
            key={fac.id}
            position={[fac.lat, fac.lon]}
            icon={getIcon(fac.category, isDarkMode)}
            eventHandlers={{
              click: () => onSelectFacility(fac),
            }}
          >
            <Popup className={isDarkMode ? 'dark-popup' : ''}>
              <div className="p-1">
                <h3 className={`font-bold transition-colors ${isDarkMode ? 'text-dark-text' : 'text-slate-900'}`}>{fac.name}</h3>
                <p className="text-xs text-medical-accent uppercase tracking-wider font-bold mb-1">{fac.category}</p>
                <button 
                  onClick={() => {
                    onSelectFacility(fac);
                  }}
                  className="mt-2 text-xs font-bold text-medical-primary hover:underline cursor-pointer"
                >
                  View details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        {viewTarget && (
          <MapRecenter center={viewTarget} />
        )}
      </MapContainer>

      {/* Map Control Overlay */}
      <div className="absolute top-4 right-4 z-[500] flex flex-col gap-2">
        <button 
          onClick={handleRecenter}
          className={`p-3 rounded-2xl natural-shadow transition-all active:scale-95 border ${
            isDarkMode ? 'bg-dark-surface border-dark-border text-medical-primary hover:bg-dark-bg' : 'bg-white border-medical-border text-medical-primary hover:bg-medical-surface'
          }`}
          title="Recenter on me"
        >
          {/* We'll use a hidden state to force recenter */}
          <LocateFixed size={20} />
        </button>
      </div>
    </div>
  );
}
