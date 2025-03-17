/**
 * ContactOrganisationForm Component
 * 
 * This component provides functionality to link and unlink organisations to a contact.
 * It displays a list of currently associated organisations and a form to add new ones.
 * 
 * Features:
 * - Displays currently linked organisations with their roles
 * - Provides a form to search and select organisations to link
 * - Allows specifying the contact's role in the organisation
 * - Supports setting a contact as primary for an organisation
 * - Handles loading states and empty states
 */

import React, { useState, useEffect } from 'react';
import { Contact } from '../../../types/Contact';
import { Organisation } from '../../../types/Organisation';

interface ContactOrganisationFormProps {
  contact: Contact;
  organisations: Organisation[];
  isLoading: boolean;
  onLinkOrganisation: (contactId: string, organisationId: string, role: string, isPrimary: boolean) => Promise<void>;
  onUnlinkOrganisation: (relationshipId: string) => Promise<void>;
}

const ContactOrganisationForm: React.FC<ContactOrganisationFormProps> = ({
  contact,
  organisations,
  isLoading,
  onLinkOrganisation,
  onUnlinkOrganisation
}) => {
  // State for form inputs
  const [selectedOrganisationId, setSelectedOrganisationId] = useState<string>('');
  const [role, setRole] = useState<string>('staff');
  const [isPrimary, setIsPrimary] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Filter out already linked organisations
  const availableOrganisations = organisations.filter(org => {
    // Check if the organisation is already linked to the contact
    return !contact.organisations?.some(
      linkedOrg => linkedOrg.organisationId === org.organisationId
    );
  });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedOrganisationId) {
      setError('Please select an organisation');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onLinkOrganisation(
        contact.contactId,
        selectedOrganisationId,
        role,
        isPrimary
      );
      
      // Reset form
      setSelectedOrganisationId('');
      setRole('staff');
      setIsPrimary(false);
    } catch (err) {
      setError('Failed to link organisation. Please try again.');
      console.error('Error linking organisation:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle unlinking an organisation
  const handleUnlink = async (relationshipId: string, organisationName: string) => {
    if (window.confirm(`Are you sure you want to remove ${contact.fullName} from ${organisationName}?`)) {
      try {
        await onUnlinkOrganisation(relationshipId);
      } catch (err) {
        console.error('Error unlinking organisation:', err);
      }
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h3 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">Organisations</h3>
      
      {/* Display linked organisations */}
      {contact.organisations && contact.organisations.length > 0 ? (
        <div className="mb-4 space-y-2">
          {contact.organisations.map((org) => (
            <div 
              key={org.relationshipId} 
              className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 p-2 dark:border-gray-700 dark:bg-gray-700"
            >
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {org.organisationName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Role: {org.role || 'Not specified'}
                  {org.isPrimary && ' (Primary)'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleUnlink(org.relationshipId, org.organisationName)}
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
          No organisations linked to this contact.
        </p>
      )}

      {/* Form to add new organisation */}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="organisation" className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
            Add to Organisation
          </label>
          <select
            id="organisation"
            value={selectedOrganisationId}
            onChange={(e) => setSelectedOrganisationId(e.target.value)}
            className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            disabled={isLoading || isSubmitting || availableOrganisations.length === 0}
          >
            <option value="">Select an organisation</option>
            {availableOrganisations.map((org) => (
              <option key={org.organisationId} value={org.organisationId}>
                {org.organisationName}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="role" className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
            Role
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            disabled={isSubmitting}
          >
            <option value="staff">Staff</option>
            <option value="manager">Manager</option>
            <option value="director">Director</option>
            <option value="owner">Owner</option>
            <option value="contractor">Contractor</option>
            <option value="client">Client</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="mb-4">
          <div className="flex items-center">
            <input
              id="isPrimary"
              type="checkbox"
              checked={isPrimary}
              onChange={(e) => setIsPrimary(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              disabled={isSubmitting}
            />
            <label htmlFor="isPrimary" className="ml-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
              Set as primary contact
            </label>
          </div>
        </div>

        {error && (
          <div className="mb-3 rounded-md bg-red-50 p-2 text-xs text-red-700 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-700 dark:hover:bg-blue-800"
          disabled={isLoading || isSubmitting || !selectedOrganisationId}
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
            'Add to Organisation'
          )}
        </button>
      </form>
    </div>
  );
};

export default ContactOrganisationForm;