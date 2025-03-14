/**
 * OrganisationAssociationForm Component
 * 
 * This component provides a form for searching and selecting existing organisations
 * or creating new organisations to associate with a contact.
 * 
 * Features:
 * - Search for existing organisations
 * - Display search results
 * - Select an organisation to associate
 * - Specify role and primary status
 * - Link to create a new organisation with auto-association
 * 
 * This component is used in the ContactDetail page to manage
 * organisation associations.
 */

import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Organisation } from '../../../types/Organisation';
import { useOrganisations } from '../../../hooks/organisations/useOrganisations';
import { useOrganisationContacts } from '../../../hooks/contacts/useOrganisationContacts';
import { OrganisationContactFormData } from '../../../types/OrganisationContact';

/**
 * OrganisationAssociationForm component props
 */
interface OrganisationAssociationFormProps {
  contactId: string;
  onAssociationCreated: () => void;
}

/**
 * OrganisationAssociationForm component
 */
const OrganisationAssociationForm: React.FC<OrganisationAssociationFormProps> = ({
  contactId,
  onAssociationCreated
}) => {
  // State for search and form
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Organisation[]>([]);
  const [selectedOrganisation, setSelectedOrganisation] = useState<Organisation | null>(null);
  const [role, setRole] = useState<string>('staff');
  const [isPrimary, setIsPrimary] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  
  // Get organisations data and actions from the hooks
  const {
    organisations,
    searchOrganisations,
    loading: organisationsLoading,
    error: organisationsError
  } = useOrganisations();
  
  const {
    addContactToOrganisation,
    submitting,
    submitError
  } = useOrganisationContacts();
  
  // Handle search input change with debounce
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // If search term is empty, clear results
    if (!value.trim()) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    
    // Search organisations with debounce
    const delayDebounceFn = setTimeout(async () => {
      try {
        await searchOrganisations(value);
        // The searchOrganisations function updates the organisations state in the hook
        setSearchResults(organisations || []);
      } catch (error) {
        console.error('Error searching organisations:', error);
      } finally {
        setIsSearching(false);
      }
    }, 300);
    
    return () => clearTimeout(delayDebounceFn);
  }, [searchOrganisations, organisations]);
  
  // Handle organisation selection
  const handleSelectOrganisation = (organisation: Organisation) => {
    setSelectedOrganisation(organisation);
    setSearchTerm('');
    setSearchResults([]);
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
    
    if (!selectedOrganisation) return;
    
    try {
      const formData: OrganisationContactFormData = {
        organisationId: selectedOrganisation.organisationId,
        contactId,
        role,
        isPrimary,
        priority: isPrimary ? 1 : 10
      };
      
      await addContactToOrganisation(formData);
      
      // Reset form
      setSelectedOrganisation(null);
      setRole('staff');
      setIsPrimary(false);
      setIsExpanded(false);
      
      // Notify parent component
      onAssociationCreated();
    } catch (error) {
      console.error('Error adding contact to organisation:', error);
    }
  };
  
  // Toggle expanded state
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setSelectedOrganisation(null);
      setSearchTerm('');
      setSearchResults([]);
    }
  };
  
  return (
    <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-default mt-6">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
        <h3 className="text-xl font-semibold text-black dark:text-white">
          Add to Organisation
        </h3>
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
      
      {isExpanded && (
        <div className="p-6">
          <div className="mb-6">
            <h4 className="text-lg font-medium text-black dark:text-white mb-4">
              Search Existing Organisations
            </h4>
            
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search organisations by name..."
                className="h-10 w-full rounded-lg border border-gray-300 bg-white pl-4 pr-10 text-sm text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                {isSearching ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary"></div>
                ) : (
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                )}
              </span>
            </div>
            
            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mb-6 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-gray-800">
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                          Name
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                          Type
                        </th>
                        <th className="py-3 px-4 text-right text-sm font-medium text-gray-700 dark:text-gray-300">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {searchResults.map((organisation) => (
                        <tr key={organisation.organisationId} className="border-t border-gray-200 dark:border-gray-700">
                          <td className="py-3 px-4 text-sm text-gray-800 dark:text-white">
                            {organisation.organisationName}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-800 dark:text-white">
                            {organisation.organisationType || 'Not specified'}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => handleSelectOrganisation(organisation)}
                              className="inline-flex items-center justify-center rounded-md bg-primary py-1 px-3 text-white hover:bg-opacity-90"
                            >
                              Select
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {searchTerm && searchResults.length === 0 && !isSearching && (
              <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  No organisations found matching "{searchTerm}"
                </p>
                <Link
                  to={`/organisations/new?contactId=${contactId}`}
                  className="inline-block mt-2 text-primary hover:underline"
                >
                  Create a new organisation
                </Link>
              </div>
            )}
            
            {/* Selected Organisation */}
            {selectedOrganisation && (
              <div className="mb-6">
                <h4 className="text-lg font-medium text-black dark:text-white mb-4">
                  Selected Organisation
                </h4>
                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-medium text-black dark:text-white">
                        {selectedOrganisation.organisationName}
                      </h5>
                      {selectedOrganisation.organisationType && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Type: {selectedOrganisation.organisationType}
                        </p>
                      )}
                      {selectedOrganisation.status && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Status: {selectedOrganisation.status}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => setSelectedOrganisation(null)}
                      className="text-gray-500 hover:text-primary"
                      aria-label="Remove selection"
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
            )}
            
            {/* Association Form */}
            {selectedOrganisation && (
              <form onSubmit={handleSubmit}>
                <h4 className="text-lg font-medium text-black dark:text-white mb-4">
                  Association Details
                </h4>
                
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
                
                <div className="mb-6">
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
                    Primary organisations are the main organisation associated with this contact
                  </p>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedOrganisation(null)}
                    className="mr-3 rounded border border-gray-200 py-2 px-6 font-medium text-black hover:shadow-1 dark:border-gray-800 dark:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90 disabled:bg-opacity-70"
                    disabled={submitting}
                  >
                    {submitting ? 'Adding...' : 'Add Organisation'}
                  </button>
                </div>
                
                {submitError && (
                  <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline"> {submitError.message}</span>
                  </div>
                )}
              </form>
            )}
            
            {/* Create New Organisation Link */}
            {!selectedOrganisation && (
              <div className="mt-6 text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  Can't find the organisation you're looking for?
                </p>
                <Link
                  to={`/organisations/new?contactId=${contactId}`}
                  className="inline-flex items-center justify-center rounded-md bg-primary py-2 px-6 text-white hover:bg-opacity-90"
                >
                  <span className="mr-2">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8 0C3.58 0 0 3.58 0 8C0 12.42 3.58 16 8 16C12.42 16 16 12.42 16 8C16 3.58 12.42 0 8 0ZM12 9H9V12H7V9H4V7H7V4H9V7H12V9Z"
                        fill="white"
                      />
                    </svg>
                  </span>
                  Create New Organisation
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganisationAssociationForm;