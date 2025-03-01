import React from 'react';
import { Complaint } from '../../types';
import ComplaintCard from './ComplaintCard';
import { ClipboardList } from 'lucide-react';

interface ComplaintListProps {
  complaints: Complaint[];
  emptyMessage?: string;
  showStatusUpdate?: boolean;
}

const ComplaintList: React.FC<ComplaintListProps> = ({ 
  complaints, 
  emptyMessage = "No complaints found.", 
  showStatusUpdate = false 
}) => {
  if (complaints.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <ClipboardList size={48} className="mb-4 text-gray-600" />
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {complaints.map(complaint => (
        <ComplaintCard 
          key={complaint.id} 
          complaint={complaint} 
          showStatusUpdate={showStatusUpdate}
        />
      ))}
    </div>
  );
};

export default ComplaintList;