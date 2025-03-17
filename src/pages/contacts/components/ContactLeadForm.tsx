/**
 * ContactLeadForm Component
 * 
 * This component provides functionality to link and unlink leads to a contact.
 * It displays a list of currently associated leads and a form to add new ones.
 * 
 * Features:
 * - Displays currently linked leads with their details
 * - Provides a form to search and select leads to link
 * - Handles loading states and empty states
 * - Supports unlinking leads from the contact
 */

import React, { useState } from 'react';
import { Contact } from '../../../types/Contact';
import { Lead } from '../../../types/Lead';

interface ContactLeadFormProps {
  contact: Contact;
  leads: Lead[];
  isLoading: boolean;
  onLinkLead: (contactId: string, leadId: string) => Promise<void>;
  onUnlinkLead: (relationshipId: string) => Promise<void>;
}

const ContactLeadForm: React.FC<ContactLeadFormProps> = ({
  contact,
  leads,
  isLoading,
  onLinkLead,
  onUnlinkLead
}) => {
  // State for form inputs
  const [selectedLeadId, setSelectedLeadId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Filter out already linked leads
  const availableLeads = leads.filter(lead => {
    // Check if the lead is already linked to the contact
    return !contact.leads?.some(
      linkedLead => linkedLead.leadId === lead.leadId
    );
  });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedLeadId) {
      setError('Please select a lead');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onLinkLead(
        contact.contactId,
        selectedLeadId
      );
      
      // Reset form
      setSelectedLeadId('');
    } catch (err) {
      setError('Failed to link lead. Please try again.');
      console.error('Error linking lead:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle unlinking a lead
  const handleUnlink = async (relationshipId: string, leadName: string) => {
    if (window.confirm(`Are you sure you want to remove ${contact.fullName} from ${leadName}?`)) {
      try {
        await onUnlinkLead(relationshipId);
      } catch (err) {
        console.error('Error unlinking lead:', err);
      }
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h3 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">Leads</h3>
      
      {/* Display linked leads */}
      {contact.leads && contact.leads.length > 0 ? (
        <div className="mb-4 space-y-2">
          {contact.leads.map((lead) => (
            <div 
              key={lead.relationshipId} 
              className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 p-2 dark:border-gray-700 dark:bg-gray-700"
            >
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {lead.leadName}
                </p>
                {lead.role && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Role: {lead.role}
                    {lead.isPrimary && ' (Primary)'}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleUnlink(lead.relationshipId, lead.leadName)}
                className="ml-2 inline-flex items-center rounded-md bg-white px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          No leads linked to this contact.
        </p>
      )}

      {/* Form to add new lead */}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="lead" className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
            Add to Lead
          </label>
          <select
            id="lead"
            value={selectedLeadId}
            onChange={(e) => setSelectedLeadId(e.target.value)}
            className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            disabled={isLoading || isSubmitting || availableLeads.length === 0}
          >
            <option value="">Select a lead</option>
            {availableLeads.map((lead) => (
              <option key={lead.leadId} value={lead.leadId}>
                {lead.contactPerson.fullName || lead.organisationName || lead.leadId}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="mb-3 rounded-md bg-red-50 p-2 text-xs text-red-700 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-700 dark:hover:bg-blue-800"
          disabled={isLoading || isSubmitting || !selectedLeadId}
        >
          {isSubmitting ? (
            <>
              <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding...
            </>
          ) : (
            'Add to Lead'
          )}
        </button>
      </form>
    </div>
  );
};

export default ContactLeadForm;