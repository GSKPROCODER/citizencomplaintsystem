import React, { useState } from 'react';
import { useComplaints } from '../../context/ComplaintContext';
import ComplaintList from '../common/ComplaintList';
import { Download, Search, Filter } from 'lucide-react';
import { Complaint, ComplaintType, ComplaintStatus } from '../../types';

const AdminDashboard: React.FC = () => {
  const { complaints, loading } = useComplaints();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const complaintsPerPage = 10;
  
  // Filter complaints based on search term and filters
  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = 
      complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.id.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    const matchesType = typeFilter === 'all' || complaint.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });
  
  // Sort complaints
  const sortedComplaints = [...filteredComplaints].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'urgent':
        return Number(b.isUrgent) - Number(a.isUrgent);
      default:
        return 0;
    }
  });
  
  // Pagination
  const indexOfLastComplaint = currentPage * complaintsPerPage;
  const indexOfFirstComplaint = indexOfLastComplaint - complaintsPerPage;
  const currentComplaints = sortedComplaints.slice(indexOfFirstComplaint, indexOfLastComplaint);
  const totalPages = Math.ceil(sortedComplaints.length / complaintsPerPage);
  
  // Get unique complaint types for filter dropdown
  const complaintTypes = Array.from(
    new Set(complaints.map(complaint => complaint.type))
  );
  
  // Download complaints as CSV
  const downloadCSV = () => {
    // Create CSV header
    const headers = [
      'ID',
      'Type',
      'Location',
      'Description',
      'Status',
      'User',
      'Created At',
      'Updated At',
      'Urgent'
    ].join(',');
    
    // Create CSV rows
    const rows = filteredComplaints.map(complaint => [
      complaint.id,
      `"${complaint.type}"`,
      `"${complaint.location}"`,
      `"${complaint.description.replace(/"/g, '""')}"`,
      complaint.status,
      `"${complaint.userName}"`,
      complaint.createdAt,
      complaint.updatedAt,
      complaint.isUrgent ? 'Yes' : 'No'
    ].join(','));
    
    // Combine header and rows
    const csv = [headers, ...rows].join('\n');
    
    // Create download link
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `complaints-${new Date().toISOString().slice(0, 10)}.csv`);
    a.click();
    
    // Clean up
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="mt-1 text-gray-400">
            Manage and resolve citizen complaints
          </p>
        </div>
        
        <button
          onClick={downloadCSV}
          className="mt-4 md:mt-0 btn-secondary flex items-center"
          disabled={filteredComplaints.length === 0}
        >
          <Download size={18} className="mr-2" />
          <span>Export CSV</span>
        </button>
      </div>
      
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white mb-4 md:mb-0">All Complaints</h2>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative flex-1 sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search complaints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => document.getElementById('filterDrawer')?.classList.toggle('hidden')}
                className="btn-secondary flex items-center"
              >
                <Filter size={18} className="mr-2" />
                <span>Filters</span>
              </button>
            </div>
          </div>
        </div>
        
        <div id="filterDrawer" className="mb-6 p-4 bg-gray-700 rounded-lg hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="statusFilter" className="form-label">Status</label>
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
              <label htmlFor="typeFilter" className="form-label">Type</label>
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
            
            <div>
              <label htmlFor="sortBy" className="form-label">Sort By</label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="urgent">Urgent First</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <button
              onClick={() => {
                setStatusFilter('all');
                setTypeFilter('all');
                setSortBy('newest');
                setSearchTerm('');
              }}
              className="text-sm text-gray-300 hover:text-white mr-4"
            >
              Reset Filters
            </button>
            
            <button
              onClick={() => document.getElementById('filterDrawer')?.classList.add('hidden')}
              className="text-sm text-indigo-400 hover:text-indigo-300"
            >
              Close
            </button>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between items-center text-sm text-gray-400">
            <span>
              Showing {Math.min(filteredComplaints.length, indexOfFirstComplaint + 1)} - {Math.min(indexOfLastComplaint, filteredComplaints.length)} of {filteredComplaints.length} complaints
            </span>
            
            <div className="flex items-center">
              <span className="mr-2">Status:</span>
              <span className="badge bg-yellow-100 text-yellow-800 mr-2">
                Pending: {filteredComplaints.filter(c => c.status === 'pending').length}
              </span>
              <span className="badge bg-blue-100 text-blue-800 mr-2">
                In Progress: {filteredComplaints.filter(c => c.status === 'in-progress').length}
              </span>
              <span className="badge bg-green-100 text-green-800">
                Resolved: {filteredComplaints.filter(c => c.status === 'resolved').length}
              </span>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <>
            <ComplaintList 
              complaints={currentComplaints} 
              emptyMessage="No complaints found matching your filters."
              showStatusUpdate={true}
            />
            
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded-md mr-2 bg-gray-700 text-gray-300 disabled:bg-gray-800 disabled:text-gray-600"
                  >
                    Previous
                  </button>
                  
                  <div className="flex space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === page
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded-md ml-2 bg-gray-700 text-gray-300 disabled:bg-gray-800 disabled:text-gray-600"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;