/**
 * ProfilePhotoUploader Component
 * 
 * This component provides an enhanced image upload interface specifically designed
 * for profile photos. It supports file selection, image preview, and handles the upload process.
 * 
 * Features:
 * - Circular image preview for profile photos
 * - File selection via button or drag-and-drop
 * - Image validation (size, type)
 * - TailAdmin-styled interface
 * - Error handling
 * - Dark mode support
 */

import React, { useState, useRef, ChangeEvent } from 'react';
import Label from '../form/Label';

interface ProfilePhotoUploaderProps {
  label?: string;
  initialImage?: string;
  onChange: (imageUrl: string) => void;
  className?: string;
  error?: boolean;
  hint?: string;
  disabled?: boolean;
  maxSizeMB?: number;
}

const ProfilePhotoUploader: React.FC<ProfilePhotoUploaderProps> = ({
  label = 'Profile Photo',
  initialImage = '',
  onChange,
  className = '',
  error = false,
  hint = '',
  disabled = false,
  maxSizeMB = 5
}) => {
  const [previewUrl, setPreviewUrl] = useState<string>(initialImage);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(error ? hint || null : null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropAreaRef = useRef<HTMLDivElement>(null);

  // Handle file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select an image file');
      return;
    }

    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setErrorMessage(`Image size should be less than ${maxSizeMB}MB`);
      return;
    }

    // Reset error state
    setErrorMessage(null);

    // Create a preview URL
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const result = fileReader.result as string;
      setPreviewUrl(result);
      
      // In a real implementation, we would upload the file to a server/storage
      // For now, we'll just simulate the upload process
      simulateUpload(file);
    };
    fileReader.readAsDataURL(file);
  };

  // Simulate file upload (in a real app, this would be an actual upload to storage)
  const simulateUpload = (file: File) => {
    setIsUploading(true);
    
    // Simulate network delay
    setTimeout(() => {
      setIsUploading(false);
      
      // In a real implementation, this would be the URL returned from the server
      // For now, we'll just use the preview URL
      onChange(previewUrl);
    }, 1000);
  };

  // Trigger file input click
  const handleButtonClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  // Remove the current image
  const handleRemoveImage = () => {
    setPreviewUrl('');
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Setup drag and drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) {
      dropAreaRef.current?.classList.add('border-blue-500', 'bg-blue-50', 'dark:bg-blue-900/20');
    }
  };

  const handleDragLeave = () => {
    dropAreaRef.current?.classList.remove('border-blue-500', 'bg-blue-50', 'dark:bg-blue-900/20');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleDragLeave();
    
    if (disabled) return;
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      // Create a synthetic event to reuse the file handling logic
      const syntheticEvent = {
        target: {
          files: [file]
        }
      } as unknown as ChangeEvent<HTMLInputElement>;
      
      handleFileChange(syntheticEvent);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <Label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </Label>
      )}
      
      <div 
        ref={dropAreaRef}
        className={`mt-1 flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
          disabled 
            ? 'cursor-not-allowed opacity-60' 
            : 'cursor-pointer hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
        } ${
          error || errorMessage 
            ? 'border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-900/20' 
            : 'border-gray-300 dark:border-gray-700'
        }`}
        onClick={handleButtonClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Image Preview */}
        {previewUrl ? (
          <div className="relative mb-4 h-32 w-32 overflow-hidden rounded-full">
            <img 
              src={previewUrl} 
              alt="Profile Preview" 
              className="h-full w-full object-cover"
            />
            {!disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage();
                }}
                className="absolute right-0 top-0 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                aria-label="Remove image"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            )}
          </div>
        ) : (
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-gray-800">
            <svg
              className="h-10 w-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              ></path>
            </svg>
          </div>
        )}
        
        {/* Upload Button */}
        <div className="flex w-full flex-col items-center">
          <input
            type="file"
            ref={fileInputRef}
            id="profile-photo-upload"
            aria-label="Upload profile photo"
            title="Upload profile photo"
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
            disabled={disabled}
          />
          
          {isUploading ? (
            <div className="flex items-center space-x-2">
              <svg
                className="h-5 w-5 animate-spin text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="text-sm text-gray-500">Uploading...</span>
            </div>
          ) : (
            <>
              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                {previewUrl ? 'Click to change photo' : 'Click to upload or drag and drop'}
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                PNG, JPG, GIF up to {maxSizeMB}MB
              </p>
            </>
          )}
        </div>
      </div>
      
      {/* Error Message */}
      {(error || errorMessage) && (
        <p className="mt-2 text-sm text-red-600">
          {errorMessage || hint || 'Error uploading image'}
        </p>
      )}
    </div>
  );
};

export default ProfilePhotoUploader;