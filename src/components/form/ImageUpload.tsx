/**
 * ImageUpload Component
 * 
 * This component provides an interface for uploading and previewing images.
 * It supports file selection, image preview, and handles the upload process.
 * 
 * The component is designed to be used in forms where image uploads are required,
 * such as profile pictures, product images, etc.
 */

import React, { useState, useRef, ChangeEvent } from 'react';

interface ImageUploadProps {
  initialImage?: string;
  onChange: (imageUrl: string) => void;
  className?: string;
  label?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  initialImage = '',
  onChange,
  className = '',
  label = 'Upload Image'
}) => {
  const [previewUrl, setPreviewUrl] = useState<string>(initialImage);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Reset error state
    setError(null);

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
    fileInputRef.current?.click();
  };

  // Remove the current image
  const handleRemoveImage = () => {
    setPreviewUrl('');
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      
      <div className="mt-1 flex flex-col items-center">
        {/* Image Preview */}
        {previewUrl && (
          <div className="relative mb-4 h-32 w-32 overflow-hidden rounded-full">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
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
          </div>
        )}
        
        {/* Upload Button */}
        <div className="flex w-full flex-col items-center">
          <input
            type="file"
            ref={fileInputRef}
            id="image-upload"
            aria-label="Upload image file"
            title="Upload image file"
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={handleButtonClick}
            disabled={isUploading}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            {isUploading ? (
              <>
                <svg
                  className="mr-2 h-4 w-4 animate-spin text-white"
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
                Uploading...
              </>
            ) : (
              <>
                <svg
                  className="mr-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
                {previewUrl ? 'Change Image' : 'Upload Image'}
              </>
            )}
          </button>
          
          {/* Error Message */}
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
          
          {/* Help Text */}
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            PNG, JPG, GIF up to 10MB
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;