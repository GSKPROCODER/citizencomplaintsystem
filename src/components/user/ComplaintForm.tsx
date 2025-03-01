import React, { useState, useRef } from 'react';
import { useComplaints } from '../../context/ComplaintContext';
import { AlertCircle, Upload, X, CheckCircle } from 'lucide-react';
import { ComplaintType, Attachment } from '../../types';
import { generateId } from '../../utils/helpers';

interface ComplaintFormProps {
  onComplaintSubmitted: () => void;
}

const COMPLAINT_TYPES: ComplaintType[] = [
  'Road Issue',
  'Water Supply',
  'Electricity',
  'Garbage',
  'Public Safety',
  'Noise Complaint',
  'Property Dispute',
  'Other'
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'];

const ComplaintForm: React.FC<ComplaintFormProps> = ({ onComplaintSubmitted }) => {
  const [type, setType] = useState<ComplaintType>('Road Issue');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addComplaint } = useComplaints();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const newErrors: Record<string, string> = {};
    const newAttachments: Attachment[] = [...attachments];
    
    Array.from(files).forEach(file => {
      // Check file type
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        newErrors.file = `File type not allowed: ${file.type}. Allowed types: JPG, PNG, GIF, MP4`;
        return;
      }
      
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        newErrors.file = `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Max size: 5MB`;
        return;
      }
      
      // Create object URL for preview
      const url = URL.createObjectURL(file);
      
      newAttachments.push({
        id: generateId(),
        name: file.name,
        type: file.type,
        url
      });
    });
    
    setAttachments(newAttachments);
    setErrors({ ...errors, ...newErrors });
  };

  const removeAttachment = (id: string) => {
    const attachment = attachments.find(a => a.id === id);
    if (attachment) {
      URL.revokeObjectURL(attachment.url);
    }
    
    setAttachments(attachments.filter(a => a.id !== id));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!type) {
      newErrors.type = 'Please select a complaint type';
    }
    
    if (!location.trim()) {
      newErrors.location = 'Please enter a location';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Please enter a description';
    } else if (description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Check if this is a public safety issue (urgent)
      const isUrgent = type === 'Public Safety';
      
      await addComplaint({
        type,
        location,
        description,
        status: 'pending',
        attachments,
        isUrgent
      });
      
      setSuccess(true);
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setType('Road Issue');
        setLocation('');
        setDescription('');
        setAttachments([]);
        setErrors({});
        setSuccess(false);
        onComplaintSubmitted();
      }, 2000);
      
    } catch (error) {
      setErrors({ submit: 'Failed to submit complaint. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Submit a New Complaint</h2>
      
      {success && (
        <div className="mb-6 p-4 bg-green-900/50 border border-green-800 rounded-md flex items-center gap-2 text-green-200">
          <CheckCircle size={18} />
          <span>Complaint submitted successfully! Your complaint ID has been generated.</span>
        </div>
      )}
      
      {errors.submit && (
        <div className="mb-6 p-4 bg-red-900/50 border border-red-800 rounded-md flex items-center gap-2 text-red-200">
          <AlertCircle size={18} />
          <span>{errors.submit}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="type" className="form-label">
              Complaint Type <span className="text-red-500">*</span>
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as ComplaintType)}
              className={`input-field ${errors.type ? 'border-red-500' : ''}`}
              disabled={isSubmitting}
            >
              {COMPLAINT_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors.type && <p className="form-error">{errors.type}</p>}
          </div>
          
          <div>
            <label htmlFor="location" className="form-label">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={`input-field ${errors.location ? 'border-red-500' : ''}`}
              placeholder="Enter the location of the issue"
              disabled={isSubmitting}
            />
            {errors.location && <p className="form-error">{errors.location}</p>}
          </div>
        </div>
        
        <div className="mb-6">
          <label htmlFor="description" className="form-label">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`input-field min-h-[120px] ${errors.description ? 'border-red-500' : ''}`}
            placeholder="Provide details about the issue..."
            disabled={isSubmitting}
          ></textarea>
          <div className="flex justify-between">
            {errors.description && <p className="form-error">{errors.description}</p>}
            <p className="text-xs text-gray-500 mt-1">
              {description.length} / 500 characters
            </p>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="form-label">Attachments (Optional)</label>
          
          <div
            className={`file-drop-area p-4 flex flex-col items-center justify-center cursor-pointer ${
              isDragging ? 'active' : ''
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={24} className="text-indigo-400 mb-2" />
            <p className="text-gray-300 text-center">
              Drag & drop files here or click to browse
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Max file size: 5MB. Allowed formats: JPG, PNG, GIF, MP4
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
              accept=".jpg,.jpeg,.png,.gif,.mp4"
              disabled={isSubmitting}
            />
          </div>
          
          {errors.file && <p className="form-error mt-2">{errors.file}</p>}
          
          {attachments.length > 0 && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {attachments.map(attachment => (
                <div key={attachment.id} className="relative bg-gray-700 rounded-md p-2">
                  <div className="flex items-center">
                    {attachment.type.startsWith('image/') ? (
                      <img
                        src={attachment.url}
                        alt={attachment.name}
                        className="w-16 h-16 object-cover rounded mr-2"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-600 rounded flex items-center justify-center mr-2">
                        <span className="text-xs text-gray-300">Video</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-300 truncate">{attachment.name}</p>
                      <p className="text-xs text-gray-500">
                        {attachment.type.split('/')[0]}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttachment(attachment.id)}
                      className="text-gray-400 hover:text-red-400"
                      disabled={isSubmitting}
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ComplaintForm;