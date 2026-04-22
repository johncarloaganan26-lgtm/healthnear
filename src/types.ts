/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type HealthcareCategory = 'hospital' | 'pharmacy' | 'dentist' | 'clinic' | 'laboratory' | 'vet' | 'emergency';

export interface HealthcareFacility {
  id: string;
  name: string;
  category: HealthcareCategory;
  lat: number;
  lon: number;
  address: string;
  distance?: number; // in km
  isOpen?: boolean;
  rating?: number;
  phone?: string;
  type?: string;
}

export interface UserLocation {
  lat: number;
  lon: number;
}

export interface FilterState {
  category: HealthcareCategory | 'all';
  maxDistance: number;
  minRating: number;
  openOnly: boolean;
}
