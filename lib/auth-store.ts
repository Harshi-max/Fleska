import { create } from 'zustand';
import { User } from './menu-types';

interface AuthStore {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

// Simple in-memory user storage for demo
const users: Map<string, { email: string; password: string; name: string; id: string }> = new Map();

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoggedIn: false,

  login: async (email: string, password: string) => {
    // Simulate API call
    const user = users.get(email);
    if (user && user.password === password) {
      const userData: User = {
        id: user.id,
        email: user.email,
        name: user.name,
      };
      set({ user: userData, isLoggedIn: true });
      // Store in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('authUser', JSON.stringify(userData));
      }
    } else {
      throw new Error('Invalid credentials');
    }
  },

  signup: async (email: string, password: string, name: string) => {
    // Check if user exists
    if (users.has(email)) {
      throw new Error('User already exists');
    }
    // Create new user
    const id = `user-${Date.now()}`;
    users.set(email, { email, password, name, id });
    
    const userData: User = { id, email, name };
    set({ user: userData, isLoggedIn: true });
    
    // Store in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('authUser', JSON.stringify(userData));
    }
  },

  logout: () => {
    set({ user: null, isLoggedIn: false });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authUser');
    }
  },

  setUser: (user: User | null) => {
    set({ user, isLoggedIn: user !== null });
  },
}));
