import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeads } from '../../hooks/leads/useLeads';
import LeadForm from './components/LeadForm';
import { LeadFormData } from '../../types/Lead';

/**
 * LeadCreate Page
 * 
 * This page provides a form for creating a new lead.
 * It uses the LeadForm component and handles form submission.
 */
const LeadCreate: React.FC = () => {
  const navigate = useNavigate();
  const { createLead, submitting, submitError } = useLeads();
  const [error, setError] = useState<string | null>(null);
  
  // Handle form submission
  const handleSubmit = async (data: LeadFormData) => {
    try {
      setError(null);
      const leadId = await createLead(data);
      
      // Navigate to the lead view page after successful creation
      navigate(`/leads/${leadId}`);
    } catch (err) {
      console.error('Error creating lead:', err);
      setError('Failed to create lead. Please try again.');
    }
  };
  
  // Handle cancel action
  const handleCancel = () => {
    navigate('/leads');
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Lead</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Add a new lead to your system
        </p>
      </div>
      
      {/* Error Message */}
      {(error || submitError) && (
        <div className="mb-6 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400 dark:text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error creating lead</h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                <p>{error || (submitError && submitError.message) || 'An unexpected error occurred'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Lead Form */}
      <LeadForm
        isSubmitting={submitting}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default LeadCreate;