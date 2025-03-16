import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLeads } from '../../hooks/leads/useLeads';
import LeadForm from './components/LeadForm';
import { LeadFormData } from '../../types/Lead';

/**
 * LeadEdit Page
 * 
 * This page provides a form for editing an existing lead.
 * It fetches the lead data, populates the form, and handles form submission.
 */
const LeadEdit: React.FC = () => {
  const { leadId } = useParams<{ leadId: string }>();
  const navigate = useNavigate();
  
  const {
    selectedLead,
    loadingLead,
    leadError,
    submitting,
    submitError,
    fetchLeadById,
    updateLead
  } = useLeads();
  
  const [error, setError] = useState<string | null>(null);
  
  // Fetch lead data on component mount
  useEffect(() => {
    if (leadId) {
      fetchLeadById(leadId);
    }
  }, [leadId, fetchLeadById]);
  
  // Handle form submission
  const handleSubmit = async (data: LeadFormData) => {
    if (!leadId) return;
    
    try {
      setError(null);
      await updateLead(leadId, data);
      
      // Navigate to the lead view page after successful update
      navigate(`/leads/${leadId}`);
    } catch (err) {
      console.error('Error updating lead:', err);
      setError('Failed to update lead. Please try again.');
    }
  };
  
  // Handle cancel action
  const handleCancel = () => {
    navigate(`/leads/${leadId}`);
  };
  
  // Show loading state
  if (loadingLead) {
    return (
      <div className="container mx-auto flex items-center justify-center px-4 py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900 dark:border-white"></div>
        <span className="ml-2">Loading lead data...</span>
      </div>
    );
  }
  
  // Show error state
  if (leadError || !selectedLead) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center dark:border-red-700 dark:bg-red-900/20">
          <h2 className="mb-2 text-xl font-bold text-red-800 dark:text-red-200">Error Loading Lead</h2>
          <p className="text-red-700 dark:text-red-300">
            {leadError?.message || 'Lead not found'}
          </p>
          <button
            onClick={() => navigate('/leads')}
            className="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Back to Leads
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Lead</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Update lead information for {selectedLead.contactPerson.fullName}
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
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error updating lead</h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                <p>{error || (submitError && submitError.message) || 'An unexpected error occurred'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Lead Form */}
      <LeadForm
        lead={selectedLead}
        isSubmitting={submitting}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default LeadEdit;