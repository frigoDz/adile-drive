
import { User, UserRole, VehicleType } from '../types';

const USERS_KEY = 'adile_users';
const CURRENT_USER_KEY = 'adile_current_user';

export interface SignupParams {
  email: string;
  name: string;
  role: UserRole;
  phone: string;
  password?: string;
  vehicleType?: VehicleType;
  vehicleModel?: string;
  licensePlate?: string;
}

export const mockAuth = {
  signup: async (params: SignupParams): Promise<User> => {
    await new Promise(r => setTimeout(r, 800));
    const { email, name, role, phone, password, vehicleType, vehicleModel, licensePlate } = params;
    
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      role,
      rating: 4.8,
      phone,
      vehicleType,
      vehicleModel,
      licensePlate
    };
    
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    // Store user with "password" for mock login check
    users.push({ ...newUser, password }); 
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    
    return newUser;
  },

  login: async (email: string): Promise<User> => {
    await new Promise(r => setTimeout(r, 800));
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find((u: User) => u.email === email);
    
    if (!user) throw new Error('User not found');
    
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  },

  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  }
};
