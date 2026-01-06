
import React from 'react';
import { Car, Truck } from 'lucide-react';
import { VehicleType } from './types';

// Real Motorcycle Icon SVG
const MotorcycleIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="5" cy="18" r="3" />
    <circle cx="19" cy="18" r="3" />
    <path d="M10 18h4" />
    <path d="M12 18V9l7 2" />
    <path d="M7 11l5-2 3 5h4" />
    <path d="M16 7h2" />
  </svg>
);

export const VEHICLE_CONFIG = {
  [VehicleType.CAR]: {
    label: 'Car',
    icon: <Car className="w-7 h-7" />,
    baseMultiplier: 1.0,
    color: 'bg-blue-600'
  },
  [VehicleType.MOTORCYCLE]: {
    label: 'Moto',
    icon: <MotorcycleIcon className="w-7 h-7" />,
    baseMultiplier: 0.6,
    color: 'bg-orange-600'
  },
  [VehicleType.VAN]: {
    label: 'Van',
    icon: <Truck className="w-7 h-7" />,
    baseMultiplier: 1.5,
    color: 'bg-purple-600'
  }
};

export const CASABLANCA_COORD = { lat: 33.5731, lng: -7.5898 };
