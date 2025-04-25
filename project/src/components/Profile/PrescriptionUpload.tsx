import React, { useState, useRef } from 'react';
import { Upload, X, AlertCircle, Check } from 'lucide-react';
import { showToast } from '../UI/Toast';

interface PrescriptionUploadProps {
  onUploadComplete: (fileUrl: string) => void;
}

const PrescriptionUpload: React.FC<PrescriptionUploadProps> = ({ onUploadComplete }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Accepted file types
  const acceptedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  const maxFileSize = 5 * 1024 * 1024; // 5MB

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const validateFile = (file: File) => {
    if (!acceptedTypes.includes(file.type)) {
      showToast('Only JPEG, PNG, and PDF files are accepted', 'error');
      return false;
    }

    if (file.size > maxFileSize) {
      showToast('File size must be less than 5MB', 'error');
      return false;
    }

    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    
    if (!droppedFile) return;
    
    if (!validateFile(droppedFile)) return;
    
    setFile(droppedFile);
    
    if (droppedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(droppedFile);
    } else {
      // For PDFs, just show a placeholder
      setPreview(null);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    
    if (!selectedFile) return;
    
    if (!validateFile(selectedFile)) return;
    
    setFile(selectedFile);
    
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      // For PDFs, just show a placeholder
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 5;
      });
    }, 100);
    
    // Simulate API delay
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // In a real app, you'd upload to your backend here
      
      // For demo, we just use the preview URL directly
      const uploadedFileUrl = preview || '/prescription-placeholder.png';
      
      // Finish progress
      clearInterval(interval);
      setUploadProgress(100);
      
      // Notify parent component
      onUploadComplete(uploadedFileUrl);
      
      // Show success message
      showToast('Prescription uploaded successfully!', 'success');
      
      // Reset form after a short delay
      setTimeout(() => {
        setFile(null);
        setPreview(null);
        setUploadProgress(0);
        setIsUploading(false);
      }, 1000);
      
    } catch (error) {
      showToast('Failed to upload prescription. Please try again.', 'error');
      clearInterval(interval);
      setUploadProgress(0);
      setIsUploading(false);
    }
  };

  const handleClearFile = () => {
    setFile(null);
    setPreview(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Upload Prescription</h3>
      
      <div className="space-y-4">
        <div 
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragging 
              ? 'border-primary-500 bg-primary-50' 
              : 'border-gray-300 hover:border-primary-400'
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={triggerFileInput}
        >
          <input
            type="file"
            className="hidden"
            onChange={handleFileInputChange}
            accept={acceptedTypes.join(',')}
            ref={fileInputRef}
          />
          
          {file ? (
            <div className="space-y-3">
              {preview ? (
                <div className="max-w-xs mx-auto">
                  <img 
                    src={preview} 
                    alt="Prescription preview" 
                    className="max-h-48 mx-auto object-contain rounded-md"
                  />
                </div>
              ) : (
                <div className="h-32 flex items-center justify-center bg-gray-100 rounded-md">
                  <p className="text-gray-500">PDF Document</p>
                </div>
              )}
              
              <div className="flex items-center">
                <div className="text-left mr-auto">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">{Math.round(file.size / 1024)} KB</p>
                </div>
                
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClearFile();
                  }}
                  className="text-gray-500 hover:text-error-600"
                  disabled={isUploading}
                  aria-label="Remove file"
                >
                  <X size={18} />
                </button>
              </div>
              
              {isUploading && (
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-primary-600 h-2.5 rounded-full transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="mx-auto flex justify-center">
                <Upload size={40} className="text-gray-400" />
              </div>
              <p className="text-gray-700 font-medium">
                Drag & drop your prescription here
              </p>
              <p className="text-gray-500 text-sm">
                or <span className="text-primary-600">click to browse</span>
              </p>
              <p className="text-xs text-gray-500">
                Supported formats: JPEG, PNG, PDF (max 5MB)
              </p>
            </div>
          )}
        </div>
        
        <div className="flex flex-col space-y-3 text-sm">
          <div className="flex items-start">
            <AlertCircle size={16} className="text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-gray-600">
              Ensure the prescription is clearly visible and all details are legible.
            </p>
          </div>
          <div className="flex items-start">
            <AlertCircle size={16} className="text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-gray-600">
              Prescriptions are valid for 6 months from the date of issue unless specified otherwise.
            </p>
          </div>
        </div>
        
        {file && !isUploading && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleUpload();
            }}
            className="w-full btn btn-primary flex items-center justify-center"
            disabled={!file}
          >
            <Upload size={18} className="mr-2" />
            Upload Prescription
          </button>
        )}
        
        {isUploading && uploadProgress === 100 && (
          <div className="flex items-center justify-center text-success-600 font-medium">
            <Check size={18} className="mr-2" />
            Upload Complete
          </div>
        )}
      </div>
    </div>
  );
};

export default PrescriptionUpload;