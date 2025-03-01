import React, { createContext, useState, useEffect, useContext } from 'react';
import { User, AuthContextType } from '../types';
import { generateId } from '../utils/helpers';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Fixed admin credentials
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'admin123';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    
    try {
      // Check if it's the admin
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const adminUser: User = {
          id: 'admin',
          name: 'Administrator',
          email: ADMIN_EMAIL,
          role: 'admin',
          createdAt: new Date().toISOString()
        };
        
        setCurrentUser(adminUser);
        localStorage.setItem('currentUser', JSON.stringify(adminUser));
        return;
      }
      
      // Check for regular users
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: User) => u.email === email);
      
      if (!user) {
        throw new Error('User not found');
      }
      
      // In a real app, we would check the password hash
      // For this demo, we're just checking if the user exists
      
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, phone: string, password: string): Promise<void> => {
    setLoading(true);
    
    try {
      // Check if email is already registered
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      if (users.some((u: User) => u.email === email)) {
        throw new Error('Email already registered');
      }
      
      // Create new user
      const newUser: User = {
        id: generateId(),
        name,
        email,
        phone,
        role: 'user',
        createdAt: new Date().toISOString()
      };
      
      // Save user to localStorage
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Log in the new user
      setCurrentUser(newUser);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const value: AuthContextType = {
    currentUser,
    login,
    register,
    logout,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.role === 'admin',
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};