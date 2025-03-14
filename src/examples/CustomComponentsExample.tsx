/**
 * Custom Components Example
 * 
 * This file demonstrates how to use the custom form components
 * created for the Jezweb Hub application. It serves as a reference
 * for developers who want to implement these components in their forms.
 * 
 * This is not a production component, but rather an example of how to use
 * the custom components in a real-world scenario.
 */

import React, { useState } from 'react';
import { 
  EmailField,
  PhoneField,
  CountryStateCityField,
  EmojiPickerField,
  ColorPickerField,
  ProfilePhotoUploader
} from '../components/custom';
import Button from '../components/ui/button/Button';

const CustomComponentsExample: React.FC = () => {
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    isEmailValid: false,
    phone: '',
    isPhoneValid: false,
    mobile: '',
    isMobileValid: false,
    location: {
      country: { id: 0, name: '' },
      state: { id: 0, name: '' },
      city: { id: 0, name: '' }
    },
    emoji: '',
    color: '#000000',
    profilePhoto: ''
  });
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form data:', formData);
    alert('Form submitted! Check console for data.');
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Custom Components Example</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <h2 className="text-xl font-medium mb-4">Contact Information</h2>
              
              {/* Email Field */}
              <div className="mb-6">
                <EmailField
                  label="Email Address"
                  required={true}
                  onChange={(value, isValid) => {
                    setFormData(prev => ({
                      ...prev,
                      email: value,
                      isEmailValid: isValid
                    }));
                  }}
                />
              </div>
              
              {/* Phone Field */}
              <div className="mb-6">
                <PhoneField
                  label="Phone Number"
                  onChange={(value, isValid) => {
                    setFormData(prev => ({
                      ...prev,
                      phone: value,
                      isPhoneValid: isValid
                    }));
                  }}
                />
              </div>
              
              {/* Mobile Field */}
              <div className="mb-6">
                <PhoneField
                  label="Mobile Number"
                  onChange={(value, isValid) => {
                    setFormData(prev => ({
                      ...prev,
                      mobile: value,
                      isMobileValid: isValid
                    }));
                  }}
                />
              </div>
            </div>
            
            <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <h2 className="text-xl font-medium mb-4">Location</h2>
              
              {/* Country, State, City Field */}
              <CountryStateCityField
                label="Location"
                onChange={(data) => {
                  setFormData(prev => ({
                    ...prev,
                    location: data
                  }));
                }}
              />
            </div>
          </div>
          
          {/* Right Column */}
          <div className="space-y-6">
            <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <h2 className="text-xl font-medium mb-4">Personalization</h2>
              
              {/* Emoji Picker Field */}
              <div className="mb-6">
                <EmojiPickerField
                  label="Select Emoji"
                  onChange={(emoji) => {
                    setFormData(prev => ({
                      ...prev,
                      emoji
                    }));
                  }}
                />
              </div>
              
              {/* Color Picker Field */}
              <div className="mb-6">
                <ColorPickerField
                  label="Select Color"
                  initialColor="#3B82F6"
                  onChange={(color) => {
                    setFormData(prev => ({
                      ...prev,
                      color
                    }));
                  }}
                />
              </div>
            </div>
            
            <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <h2 className="text-xl font-medium mb-4">Profile Photo</h2>
              
              {/* Profile Photo Uploader */}
              <ProfilePhotoUploader
                label="Profile Photo"
                onChange={(imageUrl) => {
                  setFormData(prev => ({
                    ...prev,
                    profilePhoto: imageUrl
                  }));
                }}
                maxSizeMB={2}
              />
            </div>
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <Button
            variant="secondary"
            onClick={() => {
              // Reset form
              setFormData({
                email: '',
                isEmailValid: false,
                phone: '',
                isPhoneValid: false,
                mobile: '',
                isMobileValid: false,
                location: {
                  country: { id: 0, name: '' },
                  state: { id: 0, name: '' },
                  city: { id: 0, name: '' }
                },
                emoji: '',
                color: '#000000',
                profilePhoto: ''
              });
            }}
          >
            Reset
          </Button>
          
          <Button
            type="submit"
            variant="primary"
            disabled={!formData.isEmailValid}
          >
            Submit
          </Button>
        </div>
        
        {/* Form Data Preview */}
        <div className="p-6 bg-gray-100 rounded-lg border border-gray-200 dark:bg-gray-900 dark:border-gray-700">
          <h2 className="text-xl font-medium mb-4">Form Data Preview</h2>
          <pre className="whitespace-pre-wrap bg-white p-4 rounded dark:bg-gray-800 overflow-auto max-h-60">
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>
      </form>
    </div>
  );
};

export default CustomComponentsExample;