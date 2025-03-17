/**
 * ContactDetail Component
 *
 * This component displays detailed information about a contact.
 * It shows contact information and provides actions for editing
 * and deleting the contact.
 *
 * The component uses the useContacts hook for data fetching and management.
 */

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContacts } from '../../../hooks/contacts/useContacts';
import Button from '../../../components/ui/button/Button';
import { Contact } from '../../../types/Contact';

/**
 * ContactDetail component props
 */
interface ContactDetailProps {
  contactId: string;
  onEdit?: (contact: Contact) => void;
  onDelete?: (contact: Contact) => void;
  onBack?: () => void;
}

/**
 * ContactDetail component
 */
const ContactDetail: React.FC<ContactDetailProps> = ({
  contactId,
  onEdit,
  onDelete,
  onBack
}) => {
  const navigate = useNavigate();
  
  // Get contact data and actions from the hooks
  const {
    selectedContact,
    loadingContact,
    contactError,
    fetchContactById,
    deleteContact
  } = useContacts();
  
  // Fetch contact data on component mount
  useEffect(() => {
    fetchContactById(contactId);
  }, [contactId, fetchContactById]);
  // Handle edit contact
  const handleEdit = () => {
    if (selectedContact) {
      if (onEdit) {
        onEdit(selectedContact);
      } else {
        navigate(`/contacts/${contactId}/edit`);
      }
    }
  };
  
  // Handle delete contact
  const handleDelete = async () => {
    if (selectedContact) {
      if (window.confirm(`Are you sure you want to delete ${selectedContact.fullName}?`)) {
        try {
          await deleteContact(contactId);
          if (onDelete) {
            onDelete(selectedContact);
          } else {
            navigate('/contacts');
          }
        } catch (error) {
          console.error('Error deleting contact:', error);
        }
      }
    }
  };
  
  // Handle back button
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/contacts');
    }
  };
  
  // Render loading state
  if (loadingContact) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Render error state
  if (contactError) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {contactError.message}</span>
      </div>
    );
  }
  
  // Render not found state
  if (!selectedContact) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Not Found!</strong>
        <span className="block sm:inline"> Contact not found</span>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-stroke dark:border-gray-800 shadow-default">
      {/* Header */}
      <div className="border-b border-stroke dark:border-gray-800 p-6 flex justify-between items-center">
        <div>
          <button
            onClick={handleBack}
            className="inline-flex items-center text-black dark:text-white hover:text-primary dark:hover:text-primary mb-2"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              ></path>
            </svg>
            Back to Contacts
          </button>
          <h2 className="text-2xl font-semibold text-black dark:text-white">
            {selectedContact.fullName}
          </h2>
          {selectedContact.jobTitle && (
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {selectedContact.jobTitle}
              {selectedContact.department && ` • ${selectedContact.department}`}
            </p>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={handleEdit}
            startIcon={
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                ></path>
              </svg>
            }
          >
            Edit
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            startIcon={
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                ></path>
              </svg>
            }
          >
            Delete
          </Button>
        </div>
      </div>
      
      {/* Contact Information */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
            Contact Information
          </h3>
          
          <div className="space-y-4">
            {/* Email */}
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                ></path>
              </svg>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="text-black dark:text-white">
                  <a href={`mailto:${selectedContact.email}`} className="hover:text-primary">
                    {selectedContact.email}
                  </a>
                </p>
              </div>
            </div>
            
            {/* Phone */}
            {selectedContact.phone && (
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  ></path>
                </svg>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                  <p className="text-black dark:text-white">
                    <a href={`tel:${selectedContact.phone}`} className="hover:text-primary">
                      {selectedContact.phone}
                    </a>
                  </p>
                </div>
              </div>
            )}
            
            {/* Mobile */}
            {selectedContact.mobile && (
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  ></path>
                </svg>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Mobile</p>
                  <p className="text-black dark:text-white">
                    <a href={`tel:${selectedContact.mobile}`} className="hover:text-primary">
                      {selectedContact.mobile}
                    </a>
                  </p>
                </div>
              </div>
            )}
            
            {/* City */}
            {selectedContact.city && (
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  ></path>
                </svg>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">City</p>
                  <p className="text-black dark:text-white">
                    {selectedContact.city}
                  </p>
                </div>
              </div>
            )}
            
            {/* Country */}
            {selectedContact.country && (
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Country</p>
                  <p className="text-black dark:text-white">
                    {selectedContact.country}
                  </p>
                </div>
              </div>
            )}
            
            {/* State/Province */}
            {selectedContact.state && (
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">State/Province</p>
                  <p className="text-black dark:text-white">
                    {selectedContact.state}
                  </p>
                </div>
              </div>
            )}
            
            {/* LinkedIn */}
            {selectedContact.linkedIn && (
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"
                  ></path>
                  <circle cx="4" cy="4" r="2" stroke="currentColor" strokeWidth="2"></circle>
                </svg>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">LinkedIn</p>
                  <p className="text-black dark:text-white">
                    <a href={selectedContact.linkedIn} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                      {selectedContact.linkedIn}
                    </a>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Additional Information */}
        <div>
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
            Additional Information
          </h3>
          
          <div className="space-y-4">
            {/* Status */}
            {selectedContact.status && (
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                  <p className="text-black dark:text-white">
                    <span className={`inline-flex rounded-full py-1 px-3 text-xs font-medium ${
                      selectedContact.status === 'active' 
                        ? 'bg-success bg-opacity-10 text-success' 
                        : selectedContact.status === 'inactive'
                        ? 'bg-danger bg-opacity-10 text-danger'
                        : 'bg-warning bg-opacity-10 text-warning'
                    }`}>
                      {selectedContact.status}
                    </span>
                  </p>
                </div>
              </div>
            )}
            
            {/* Role */}
            {selectedContact.role && (
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                  ></path>
                </svg>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
                  <p className="text-black dark:text-white">
                    {selectedContact.role}
                  </p>
                </div>
              </div>
            )}
            
            {/* Visual Identification */}
            {(selectedContact.icon || selectedContact.color) && (
              <div className="mt-4">
                <h4 className="text-md font-medium text-black dark:text-white mb-3">
                  Visual Identification
                </h4>
                <div className="flex space-x-4">
                  {selectedContact.icon && (
                    <div className="flex flex-col items-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Icon</p>
                      <div className="text-3xl">{selectedContact.icon}</div>
                    </div>
                  )}
                  {selectedContact.color && (
                    <div className="flex flex-col items-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Color</p>
                      <div 
                        className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600"
                        style={{ backgroundColor: selectedContact.color }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Additional sections can be added here */}
      </div>
      
      {/* Notes */}
      {selectedContact.notes && (
        <div className="border-t border-stroke dark:border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
            Notes
          </h3>
          <div className="bg-gray-100 dark:bg-gray-800 rounded p-4">
            <p className="text-black dark:text-white whitespace-pre-line">
              {selectedContact.notes}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactDetail;