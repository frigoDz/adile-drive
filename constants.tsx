
import React from 'react';
import { Car, Bike, Truck } from 'lucide-react';
import { VehicleType } from './types';

export const VEHICLE_CONFIG = {
  [VehicleType.CAR]: {
    label: 'Car',
    icon: <Car className="w-6 h-6" />,
    baseMultiplier: 1.0,
    color: 'bg-blue-500'
  },
  [VehicleType.MOTORCYCLE]: {
    label: 'Motorcycle',
    icon: <Bike className="w-6 h-6" />,
    baseMultiplier: 0.6,
    color: 'bg-orange-500'
  },
  [VehicleType.VAN]: {
    label: 'Van',
    icon: <Truck className="w-6 h-6" />,
    baseMultiplier: 1.5,
    color: 'bg-purple-500'
  }
};

export const CASABLANCA_COORD = { lat: 33.5731, lng: -7.5898 };
