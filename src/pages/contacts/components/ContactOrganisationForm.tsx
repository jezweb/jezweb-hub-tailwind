/**
 * ContactOrganisationForm Component
 * 
 * This component provides a form for managing organisations associated with a contact.
 * It displays the current associated organisations and allows users to add new ones.
 * 
 * Features:
 * - Displays current associated organisations
 * - Allows selecting organisations from a dropdown
 * - Supports setting role and primary status
 * - Handles linking and unlinking organisations
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Contact } from '../../../types/Contact';
import { Organisation } from '../../../types/Organisation';
import { useOrganisationContacts } from '../../../hooks/contacts/useOrganisationContacts';

/**
 * ContactOrganisationForm component props
 */
interface ContactOrganisationFormProps {
  contact: Contact;
  organisations: Organisation[];
  isLoading: boolean;
  onLinkOrganisation: (contactId: string, organisationId: string, role: string, isPrimary: boolean) => Promise<void>;
  onUnlinkOrganisation: (relationshipId: string) => Promise<void>;
}

/**
 * ContactOrganisationForm component
 */
const ContactOrganisationForm: React.FC<ContactOrganisationFormProps> = ({
  contact,
  organisations,
  isLoading,
  onLinkOrganisation,
  onUnlinkOrganisation
}) => {
  // State for form
  const [selectedOrganisationId, setSelectedOrganisationId] = useState<string>('');
  const [role, setRole] = useState<string>('staff');
  const [isPrimary, setIsPrimary] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [associatedOrganisations, setAssociatedOrganisations] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get organisation-contact relationship data
  const {
    fetchOrganisationsByContact
  } = useOrganisationContacts();
  
  // Fetch associated organisations when contact changes
  useEffect(() => {
    const fetchOrganisations = async () => {
      try {
        const orgRelationships = await fetchOrganisationsByContact(contact.contactId);
        setAssociatedOrganisations(orgRelationships);
      } catch (err) {
        console.error('Error fetching organisations for contact:', err);
      }
    };
    
    fetchOrganisations();
  }, [contact.contactId, fetchOrganisationsByContact]);
  
  // Handle organisation selection
  const handleOrganisationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOrganisationId(e.target.value);
  };
  
  // Handle role change
  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value);
  };
  
  // Handle primary status change
  const handlePrimaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsPrimary(e.target.checked);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedOrganisationId) return;
    
    setSubmitting(true);
    setError(null);
    
    try {
      await onLinkOrganisation(contact.contactId, selectedOrganisationId, role, isPrimary);
      
      // Reset form
      setSelectedOrganisationId('');
      setRole('staff');
      setIsPrimary(false);
      setIsExpanded(false);
      
      // Refresh associated organisations
      const orgRelationships = await fetchOrganisationsByContact(contact.contactId);
      setAssociatedOrganisations(orgRelationships);
    } catch (err) {
      console.error('Error linking organisation to contact:', err);
      setError('Failed to link organisation to contact. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Handle unlinking an organisation
  const handleUnlinkOrganisation = async (relationshipId: string) => {
    try {
      await onUnlinkOrganisation(relationshipId);
      
      // Refresh associated organisations
      const orgRelationships = await fetchOrganisationsByContact(contact.contactId);
      setAssociatedOrganisations(orgRelationships);
    } catch (err) {
      console.error('Error unlinking organisation from contact:', err);
    }
  };
  
  // Toggle expanded state
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setSelectedOrganisationId('');
      setRole('staff');
      setIsPrimary(false);
    }
  };
  
  // Find organisation name by ID
  const getOrganisationName = (organisationId: string): string => {
    const org = organisations.find(org => org.organisationId === organisationId);
    return org ? org.organisationName : `Organisation ${organisationId.substring(0, 6)}...`;
  };
  
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">Organisations</h3>
        <button
          onClick={toggleExpanded}
          className="text-gray-500 hover:text-primary"
          aria-label={isExpanded ? "Collapse form" : "Expand form"}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isExpanded ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 15l7-7 7 7"
              ></path>
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            )}
          </svg>
        </button>
      </div>
      
      {/* Associated Organisations */}
      {associatedOrganisations.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
          No organisations associated with this contact
        </p>
      ) : (
        <div className="space-y-3 mb-4">
          {associatedOrganisations.map((org) => (
            <div
              key={org.relationshipId}
              className="bg-gray-100 dark:bg-gray-700 rounded p-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <Link
                    to={`/organisations/${org.organisationId}`}
                    className="font-medium text-black dark:text-white hover:text-primary"
                  >
                    {getOrganisationName(org.organisationId)}
                  </Link>
                  {org.isPrimary && (
                    <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                      Primary
                    </span>
                  )}
                  {org.role && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Role: {org.role}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Link
                    to={`/organisations/${org.organisationId}`}
                    className="text-gray-500 hover:text-primary"
                    aria-label="View organisation"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      ></path>
                    </svg>
                  </Link>
                  <button
                    onClick={() => handleUnlinkOrganisation(org.relationshipId)}
                    className="text-gray-500 hover:text-red-500"
                    aria-label="Unlink organisation"
                  >
                    <svg
                      className="w-5 h-5"
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
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Add Organisation Form */}
      {isExpanded && (
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-4">
            <label htmlFor="organisation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Organisation
            </label>
            <select
              id="organisation"
              value={selectedOrganisationId}
              onChange={handleOrganisationChange}
              className="h-10 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="">Select an organisation</option>
              {organisations.map((org) => (
                <option key={org.organisationId} value={org.organisationId}>
                  {org.organisationName}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={handleRoleChange}
              className="h-10 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="owner">Owner</option>
              <option value="manager">Manager</option>
              <option value="staff">Staff</option>
              <option value="technical">Technical Contact</option>
              <option value="billing">Billing Contact</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center">
              <input
                id="isPrimary"
                type="checkbox"
                checked={isPrimary}
                onChange={handlePrimaryChange}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700"
              />
              <label htmlFor="isPrimary" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Set as primary organisation
              </label>
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Primary organisations are displayed first and highlighted
            </p>
          </div>
          
          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm" role="alert">
              {error}
            </div>
          )}
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded bg-primary py-2 px-4 text-sm font-medium text-white hover:bg-opacity-90 disabled:bg-opacity-70"
              disabled={submitting || !selectedOrganisationId}
            >
              {submitting ? 'Linking...' : 'Link Organisation'}
            </button>
          </div>
        </form>
      )}
      
      {/* Create New Organisation Link */}
      {!isExpanded && (
        <div className="mt-4">
          <Link
            to={`/organisations/new?contactId=${contact.contactId}`}
            className="inline-flex items-center text-sm text-primary hover:underline"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add New Organisation
          </Link>
        </div>
      )}
    </div>
  );
};

export default ContactOrganisationForm;