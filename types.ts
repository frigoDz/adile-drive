
export enum UserRole {
  PASSENGER = 'passenger',
  DRIVER = 'driver'
}

export enum VehicleType {
  CAR = 'car',
  MOTORCYCLE = 'motorcycle',
  VAN = 'van'
}

export enum RideStatus {
  PENDING = 'pending',
  NEGOTIATING = 'negotiating',
  ACCEPTED = 'accepted',
  EN_ROUTE = 'en_route',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  vehicleType?: VehicleType;
  vehicleModel?: string;
  licensePlate?: string;
  rating: number;
  phone: string;
}

export interface Location {
  address: string;
  lat: number;
  lng: number;
}

export interface RideRequest {
  id: string;
  passengerId: string;
  passengerName: string;
  pickup: Location;
  dropoff: Location;
  offeredPrice: number;
  vehicleType: VehicleType;
  status: RideStatus;
  driverId?: string;
  driverName?: string;
  driverPrice?: number;
  timestamp: number;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: number;
  isRead: boolean;
}
