/**
 * OrganisationAssociationSidebar Component
 * 
 * This component displays and manages organisations associated with a contact.
 * It allows users to view, add, and remove organisation associations.
 * 
 * Features:
 * - Displays a list of associated organisations
 * - Provides a search interface to find and add organisations
 * - Allows setting primary organisation status
 * - Supports removing organisation associations
 * 
 * This component is used in the ContactView page to manage the relationship
 * between contacts and organisations.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useOrganisations } from '../../../hooks/organisations/useOrganisations';
import { useOrganisationContacts } from '../../../hooks/contacts/useOrganisationContacts';
import { Organisation } from '../../../types/Organisation';

/**
 * OrganisationAssociationSidebar component props
 */
interface OrganisationAssociationSidebarProps {
  contactId: string;
  relatedOrganisations?: any[];
  onRefresh?: () => void;
}

/**
 * OrganisationAssociationSidebar component
 */
const OrganisationAssociationSidebar: React.FC<OrganisationAssociationSidebarProps> = ({
  contactId,
  relatedOrganisations = [],
  onRefresh
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
    removeContactFromOrganisation,
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
        // Filter out organisations that are already associated
        const existingOrgIds = relatedOrganisations.map(org => org.organisationId);
        const filteredResults = organisations.filter(
          org => !existingOrgIds.includes(org.organisationId)
        );
        setSearchResults(filteredResults || []);
      } catch (error) {
        console.error('Error searching organisations:', error);
      } finally {
        setIsSearching(false);
      }
    }, 300);
    
    return () => clearTimeout(delayDebounceFn);
  }, [searchOrganisations, organisations, relatedOrganisations]);
  
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
      await addContactToOrganisation({
        organisationId: selectedOrganisation.organisationId,
        contactId,
        role,
        isPrimary,
        priority: isPrimary ? 1 : 10
      });
      
      // Reset form
      setSelectedOrganisation(null);
      setRole('staff');
      setIsPrimary(false);
      
      // Notify parent component to refresh data
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error adding organisation to contact:', error);
    }
  };
  
  // Handle remove organisation
  const handleRemoveOrganisation = async (relationshipId: string, orgName: string) => {
    if (window.confirm(`Are you sure you want to remove ${orgName} from this contact?`)) {
      try {
        await removeContactFromOrganisation(relationshipId);
        
        // Notify parent component to refresh data
        if (onRefresh) {
          onRefresh();
        }
      } catch (error) {
        console.error('Error removing organisation from contact:', error);
      }
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
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">Organisations</h3>
        <button
          onClick={toggleExpanded}
          className="text-gray-500 hover:text-primary"
          aria-label={isExpanded ? "Collapse section" : "Expand section"}
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
      
      {/* List of associated organisations */}
      {relatedOrganisations.length > 0 ? (
        <div className="mb-4">
          <ul className="space-y-2">
            {relatedOrganisations.map((org) => (
              <li key={org.relationshipId} className="flex items-center justify-between p-2 bg-gray-50 rounded-md dark:bg-gray-700">
                <div className="flex-1">
                  <Link to={`/organisations/${org.organisationId}`} className="text-sm font-medium text-primary hover:underline">
                    {org.organisationName}
                  </Link>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">
                      {org.role || 'Staff'}
                    </span>
                    {org.isPrimary && (
                      <span className="inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Primary
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveOrganisation(org.relationshipId, org.organisationName)}
                  className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                  aria-label={`Remove ${org.organisationName}`}
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
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="mb-4 text-center py-3 bg-gray-50 rounded-md dark:bg-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No organisations associated
          </p>
        </div>
      )}
      
      {/* Add organisation form */}
      {isExpanded && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Add Organisation
          </h4>
          
          {/* Search input */}
          <div className="relative mb-3">
            <input
              type="text"
              placeholder="Search organisations..."
              className="h-9 w-full rounded-lg border border-gray-300 bg-white pl-3 pr-10 text-sm text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2">
              {isSearching ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary"></div>
              ) : (
                <svg
                  className="h-4 w-4 text-gray-400"
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
            <div className="mb-3 max-h-40 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {searchResults.map((org) => (
                  <li key={org.organisationId} className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <button
                      onClick={() => handleSelectOrganisation(org)}
                      className="w-full text-left"
                    >
                      <div className="font-medium text-sm text-gray-900 dark:text-white">
                        {org.organisationName}
                      </div>
                      {org.industry && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {org.industry}
                        </div>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {searchTerm && searchResults.length === 0 && !isSearching && (
            <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                No organisations found matching "{searchTerm}"
              </p>
              <Link
                to={`/organisations/new?contactId=${contactId}`}
                className="inline-block mt-1 text-xs text-primary hover:underline"
              >
                Create a new organisation
              </Link>
            </div>
          )}
          
          {/* Selected Organisation */}
          {selectedOrganisation && (
            <div className="mb-3">
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                      {selectedOrganisation.organisationName}
                    </h5>
                    {selectedOrganisation.industry && (
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {selectedOrganisation.industry}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedOrganisation(null)}
                    className="text-gray-500 hover:text-primary"
                    aria-label="Remove selection"
                  >
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
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label htmlFor="role" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Role
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={handleRoleChange}
                  className="h-9 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="owner">Owner</option>
                  <option value="manager">Manager</option>
                  <option value="staff">Staff</option>
                  <option value="technical">Technical Contact</option>
                  <option value="billing">Billing Contact</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <div className="flex items-center">
                  <input
                    id="isPrimary"
                    type="checkbox"
                    checked={isPrimary}
                    onChange={handlePrimaryChange}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700"
                  />
                  <label htmlFor="isPrimary" className="ml-2 block text-xs text-gray-700 dark:text-gray-300">
                    Set as primary organisation
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="rounded bg-primary py-1 px-3 text-xs font-medium text-white hover:bg-opacity-90 disabled:bg-opacity-70"
                  disabled={submitting}
                >
                  {submitting ? 'Adding...' : 'Add Organisation'}
                </button>
              </div>
              
              {submitError && (
                <div className="mt-2 bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-xs" role="alert">
                  <span>{submitError.message}</span>
                </div>
              )}
            </form>
          )}
          
          {/* Create New Organisation Link */}
          {!selectedOrganisation && (
            <div className="mt-3 text-center">
              <Link
                to={`/organisations/new?contactId=${contactId}`}
                className="inline-flex items-center justify-center rounded-md bg-primary py-1 px-3 text-xs text-white hover:bg-opacity-90"
              >
                <span className="mr-1">
                  <svg
                    width="12"
                    height="12"
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
      )}
    </div>
  );
};

export default OrganisationAssociationSidebar;