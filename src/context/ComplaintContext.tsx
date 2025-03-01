import React, { createContext, useState, useEffect, useContext } from 'react';
import { Complaint, ComplaintContextType, ComplaintStatus } from '../types';
import { useAuth } from './AuthContext';
import { generateId } from '../utils/helpers';

const ComplaintContext = createContext<ComplaintContextType | undefined>(undefined);

export const ComplaintProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    // Load complaints from localStorage
    const storedComplaints = localStorage.getItem('complaints');
    if (storedComplaints) {
      setComplaints(JSON.parse(storedComplaints));
    }
    setLoading(false);
  }, []);

  // Save complaints to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('complaints', JSON.stringify(complaints));
    }
  }, [complaints, loading]);

  // Filter complaints for the current user
  const userComplaints = complaints.filter(
    complaint => currentUser && complaint.userId === currentUser.id
  );

  const addComplaint = async (
    complaintData: Omit<Complaint, 'id' | 'userId' | 'userName' | 'createdAt' | 'updatedAt'>
  ): Promise<Complaint> => {
    if (!currentUser) {
      throw new Error('User must be logged in to add a complaint');
    }

    const now = new Date().toISOString();
    
    const newComplaint: Complaint = {
      id: generateId(),
      userId: currentUser.id,
      userName: currentUser.name,
      ...complaintData,
      createdAt: now,
      updatedAt: now
    };

    setComplaints(prev => [...prev, newComplaint]);
    return newComplaint;
  };

  const updateComplaintStatus = async (id: string, status: ComplaintStatus): Promise<void> => {
    setComplaints(prev => 
      prev.map(complaint => 
        complaint.id === id 
          ? { 
              ...complaint, 
              status, 
              updatedAt: new Date().toISOString() 
            } 
          : complaint
      )
    );
  };

  const getComplaintById = (id: string): Complaint | undefined => {
    return complaints.find(complaint => complaint.id === id);
  };

  const value: ComplaintContextType = {
    complaints,
    userComplaints,
    addComplaint,
    updateComplaintStatus,
    getComplaintById,
    loading
  };

  return <ComplaintContext.Provider value={value}>{children}</ComplaintContext.Provider>;
};

export const useComplaints = (): ComplaintContextType => {
  const context = useContext(ComplaintContext);
  if (context === undefined) {
    throw new Error('useComplaints must be used within a ComplaintProvider');
  }
  return context;
};