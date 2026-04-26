/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HealthcareFacility, UserLocation, HealthcareCategory } from '../types';

/**
 * Fetches healthcare facilities from OpenStreetMap Overpass API
 */
export async function fetchNearbyHealthcare(
  location: UserLocation,
  radius: number = 5000 // meters
): Promise<HealthcareFacility[]> {
  const { lat, lon } = location;
  
  if (lat === 0 && lon === 0) {
    console.warn('Coordinates are (0,0), skipping fetch');
    return [];
  }

  // Overpass QL query: find hospitals, pharmacies, dentists, and emergency centers
  // within a radius around the user.
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="hospital"](around:${radius},${lat},${lon});
      way["amenity"="hospital"](around:${radius},${lat},${lon});
      node["amenity"="pharmacy"](around:${radius},${lat},${lon});
      node["amenity"="dentist"](around:${radius},${lat},${lon});
      node["amenity"="clinic"](around:${radius},${lat},${lon});
      node["amenity"="laboratory"](around:${radius},${lat},${lon});
      node["amenity"="veterinary"](around:${radius},${lat},${lon});
      node["emergency"="yes"](around:${radius},${lat},${lon});
    );
    out center;
  `;

  const endpoints = [
    'https://overpass-api.de/api/interpreter',
    'https://lz4.overpass-api.de/api/interpreter',
    'https://z.overpass-api.de/api/interpreter'
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'data=' + encodeURIComponent(query),
      });

      if (!response.ok) continue;

      const data = await response.json();
      return data.elements.map((el: any) => {
        const tags = el.tags || {};
        const category = mapAmenityToCategory(tags.amenity, tags.emergency);
        
        return {
          id: el.id.toString(),
          name: tags.name || tags.operator || `${category.charAt(0).toUpperCase() + category.slice(1)}`,
          category,
          lat: el.lat || el.center.lat,
          lon: el.lon || el.center.lon,
          address: formatAddress(tags),
          phone: tags.phone || tags['contact:phone'] || 'N/A',
          isOpen: tags.opening_hours ? true : undefined, // Simplification for demo
          rating: Math.floor(Math.random() * 2) + 3.5, // Mock rating as OSM doesn't have it reliably
        };
      });
    } catch (error) {
      console.warn(`Failed to fetch from ${endpoint}:`, error);
      // Try next endpoint
    }
  }

  console.error('All Overpass API mirrors failed');
  return [];
}

function mapAmenityToCategory(amenity: string, emergency?: string): HealthcareCategory {
  if (emergency === 'yes' || amenity === 'emergency_ward') return 'emergency';
  if (amenity === 'pharmacy') return 'pharmacy';
  if (amenity === 'dentist') return 'dentist';
  if (amenity === 'clinic') return 'clinic';
  if (amenity === 'laboratory') return 'laboratory';
  if (amenity === 'veterinary') return 'vet';
  return 'hospital';
}

function formatAddress(tags: any): string {
  const parts = [
    tags['addr:street'],
    tags['addr:housenumber'],
    tags['addr:city']
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : 'Address not specified';
}

/**
 * Haversine formula to calculate distance in km
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return parseFloat((R * c).toFixed(1));
}
