import React, { useState } from 'react';
import { useComplaints } from '../../context/ComplaintContext';
import ComplaintForm from './ComplaintForm';
import ComplaintList from '../common/ComplaintList';
import { Plus, X } from 'lucide-react';

const UserDashboard: React.FC = () => {
  const { userComplaints, loading } = useComplaints();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  
  const toggleForm = () => {
    setShowForm(!showForm);
  };
  
  // Filter complaints based on search term and filters
  const filteredComplaints = userComplaints.filter(complaint => {
    const matchesSearch = 
      complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.id.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    const matchesType = typeFilter === 'all' || complaint.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });
  
  // Get unique complaint types for filter dropdown
  const complaintTypes = Array.from(
    new Set(userComplaints.map(complaint => complaint.type))
  );
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">My Dashboard</h1>
          <p className="mt-1 text-gray-400">
            Track and manage your complaints
          </p>
        </div>
        
        <button
          onClick={toggleForm}
          className="mt-4 md:mt-0 btn-primary flex items-center"
        >
          {showForm ? (
            <>
              <X size={18} className="mr-2" />
              <span>Cancel</span>
            </>
          ) : (
            <>
              <Plus size={18} className="mr-2" />
              <span>New Complaint</span>
            </>
          )}
        </button>
      </div>
      
      {showForm && (
        <div className="mb-8">
          <ComplaintForm onComplaintSubmitted={() => setShowForm(false)} />
        </div>
      )}
      
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">My Complaints</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label htmlFor="search" className="form-label">Search</label>
            <input
              type="text"
              id="search"
              placeholder="Search complaints..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
            />
          </div>
          
          <div>
            <label htmlFor="statusFilter" className="form-label">Filter by Status</label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="typeFilter" className="form-label">Filter by Type</label>
            <select
              id="typeFilter"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Types</option>
              {complaintTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <ComplaintList 
            complaints={filteredComplaints} 
            emptyMessage="You haven't submitted any complaints yet."
          />
        )}
      </div>
    </div>
  );
};

export default UserDashboard;