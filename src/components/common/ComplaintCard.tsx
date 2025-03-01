import React, { useState } from 'react';
import { Complaint, ComplaintStatus } from '../../types';
import { useComplaints } from '../../context/ComplaintContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  MapPin, 
  Calendar, 
  User, 
  Tag,
  ChevronDown,
  ChevronUp,
  Image
} from 'lucide-react';

interface ComplaintCardProps {
  complaint: Complaint;
  showStatusUpdate?: boolean;
}

const ComplaintCard: React.FC<ComplaintCardProps> = ({ 
  complaint, 
  showStatusUpdate = false 
}) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { updateComplaintStatus } = useComplaints();
  const { isAdmin } = useAuth();
  
  const handleStatusChange = async (status: ComplaintStatus) => {
    await updateComplaintStatus(complaint.id, status);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getStatusIcon = () => {
    switch (complaint.status) {
      case 'pending':
        return <Clock size={18} className="text-yellow-500" />;
      case 'in-progress':
        return <AlertTriangle size={18} className="text-blue-500" />;
      case 'resolved':
        return <CheckCircle2 size={18} className="text-green-500" />;
      default:
        return null;
    }
  };
  
  const getStatusText = () => {
    switch (complaint.status) {
      case 'pending':
        return 'Pending';
      case 'in-progress':
        return 'In Progress';
      case 'resolved':
        return 'Resolved';
      default:
        return '';
    }
  };
  
  const getStatusClass = () => {
    switch (complaint.status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return '';
    }
  };
  
  return (
    <div className={`complaint-card bg-gray-800 rounded-lg shadow-md overflow-hidden border ${
      complaint.isUrgent ? 'border-red-500' : 'border-gray-700'
    }`}>
      <div className="p-4">
        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
          <div className="flex items-center">
            <span className={`badge ${getStatusClass()} mr-2 flex items-center gap-1`}>
              {getStatusIcon()}
              <span>{getStatusText()}</span>
            </span>
            
            {complaint.isUrgent && (
              <span className="badge bg-red-100 text-red-800 flex items-center gap-1">
                <AlertTriangle size={14} />
                <span>Urgent</span>
              </span>
            )}
          </div>
          
          <div className="text-xs text-gray-400">
            ID: {complaint.id.slice(0, 8)}
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-white mb-2">{complaint.type}</h3>
        
        <div className="flex items-center text-gray-400 text-sm mb-2">
          <MapPin size={16} className="mr-1" />
          <span>{complaint.location}</span>
        </div>
        
        <p className="text-gray-300 mb-4">
          {expanded 
            ? complaint.description 
            : complaint.description.length > 100 
              ? `${complaint.description.slice(0, 100)}...` 
              : complaint.description
          }
        </p>
        
        <div className="flex flex-wrap gap-4 text-xs text-gray-400 mb-2">
          <div className="flex items-center">
            <User size={14} className="mr-1" />
            <span>{complaint.userName}</span>
          </div>
          
          <div className="flex items-center">
            <Calendar size={14} className="mr-1" />
            <span>Submitted: {formatDate(complaint.createdAt)}</span>
          </div>
          
          <div className="flex items-center">
            <Tag size={14} className="mr-1" />
            <span>{complaint.type}</span>
          </div>
        </div>
        
        {complaint.attachments.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center text-sm text-gray-300 mb-2">
              <Image size={16} className="mr-1" />
              <span>Attachments ({complaint.attachments.length})</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {complaint.attachments.map(attachment => (
                <div 
                  key={attachment.id} 
                  className="relative cursor-pointer"
                  onClick={() => setSelectedImage(attachment.url)}
                >
                  {attachment.type.startsWith('image/') ? (
                    <img 
                      src={attachment.url} 
                      alt={attachment.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-700 rounded-md flex items-center justify-center">
                      <span className="text-xs text-gray-300">Video</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center mt-4">
          {showStatusUpdate && isAdmin && complaint.status !== 'resolved' && (
            <div className="flex gap-2">
              {complaint.status === 'pending' && (
                <button
                  onClick={() => handleStatusChange('in-progress')}
                  className="text-xs bg-blue-900 text-blue-200 px-2 py-1 rounded hover:bg-blue-800 transition-colors"
                >
                  Mark In Progress
                </button>
              )}
              
              <button
                onClick={() => handleStatusChange('resolved')}
                className="text-xs bg-green-900 text-green-200 px-2 py-1 rounded hover:bg-green-800 transition-colors"
              >
                Mark Resolved
              </button>
            </div>
          )}
          
          {complaint.description.length > 100 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center text-indigo-400 text-sm hover:text-indigo-300 transition-colors ml-auto"
            >
              {expanded ? (
                <>
                  <ChevronUp size={16} className="mr-1" />
                  <span>Show Less</span>
                </>
              ) : (
                <>
                  <ChevronDown size={16} className="mr-1" />
                  <span>Show More</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
      
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-3xl max-h-[90vh]">
            <img 
              src={selectedImage} 
              alt="Attachment preview" 
              className="max-w-full max-h-[90vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintCard;