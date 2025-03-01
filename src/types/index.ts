export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  createdAt: string;
};

export type ComplaintStatus = 'pending' | 'in-progress' | 'resolved';

export type ComplaintType = 
  | 'Road Issue'
  | 'Water Supply'
  | 'Electricity'
  | 'Garbage'
  | 'Public Safety'
  | 'Noise Complaint'
  | 'Property Dispute'
  | 'Other';

export type Attachment = {
  id: string;
  name: string;
  type: string;
  url: string;
};

export type Complaint = {
  id: string;
  userId: string;
  userName: string;
  type: ComplaintType;
  location: string;
  description: string;
  status: ComplaintStatus;
  attachments: Attachment[];
  createdAt: string;
  updatedAt: string;
  isUrgent: boolean;
};

export type AuthContextType = {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
};

export type ComplaintContextType = {
  complaints: Complaint[];
  userComplaints: Complaint[];
  addComplaint: (complaint: Omit<Complaint, 'id' | 'userId' | 'userName' | 'createdAt' | 'updatedAt'>) => Promise<Complaint>;
  updateComplaintStatus: (id: string, status: ComplaintStatus) => Promise<void>;
  getComplaintById: (id: string) => Complaint | undefined;
  loading: boolean;
};