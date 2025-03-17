/**
 * LeadAssociationSidebar Component
 * 
 * This component displays and manages leads associated with a contact.
 * It allows users to view, add, and remove lead associations.
 * 
 * Features:
 * - Displays a list of associated leads
 * - Provides a search interface to find and add leads
 * - Supports removing lead associations
 * 
 * This component is used in the ContactView page to manage the relationship
 * between contacts and leads.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useLeads } from '../../../hooks/leads/useLeads';
import { Lead } from '../../../types/Lead';

/**
 * LeadAssociationSidebar component props
 */
interface LeadAssociationSidebarProps {
  contactId: string;
  relatedLeads?: any[];
  onRefresh?: () => void;
}

/**
 * LeadAssociationSidebar component
 */
const LeadAssociationSidebar: React.FC<LeadAssociationSidebarProps> = ({
  contactId,
  relatedLeads = [],
  onRefresh
}) => {
  // State for search and form
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  
  // Get leads data and actions from the hooks
  const {
    leads,
    searchLeads,
    loading: leadsLoading,
    error: leadsError,
    addContactToLead,
    removeContactFromLead,
    submitting,
    submitError
  } = useLeads();
  
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
    
    // Search leads with debounce
    const delayDebounceFn = setTimeout(async () => {
      try {
        await searchLeads(value);
        // Filter out leads that are already associated
        const existingLeadIds = relatedLeads.map(lead => lead.leadId);
        const filteredResults = leads.filter(
          lead => !existingLeadIds.includes(lead.leadId)
        );
        setSearchResults(filteredResults || []);
      } catch (error) {
        console.error('Error searching leads:', error);
      } finally {
        setIsSearching(false);
      }
    }, 300);
    
    return () => clearTimeout(delayDebounceFn);
  }, [searchLeads, leads, relatedLeads]);
  
  // Handle lead selection
  const handleSelectLead = (lead: Lead) => {
    setSelectedLead(lead);
    setSearchTerm('');
    setSearchResults([]);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedLead) return;
    
    try {
      await addContactToLead({
        leadId: selectedLead.leadId,
        contactId
      });
      
      // Reset form
      setSelectedLead(null);
      
      // Notify parent component to refresh data
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error adding lead to contact:', error);
    }
  };
  
  // Handle remove lead
  const handleRemoveLead = async (leadId: string, leadTitle: string) => {
    if (window.confirm(`Are you sure you want to remove ${leadTitle} from this contact?`)) {
      try {
        await removeContactFromLead(leadId, contactId);
        
        // Notify parent component to refresh data
        if (onRefresh) {
          onRefresh();
        }
      } catch (error) {
        console.error('Error removing lead from contact:', error);
      }
    }
  };
  
  // Toggle expanded state
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setSelectedLead(null);
      setSearchTerm('');
      setSearchResults([]);
    }
  };
  
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">Leads</h3>
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
      
      {/* List of associated leads */}
      {relatedLeads.length > 0 ? (
        <div className="mb-4">
          <ul className="space-y-2">
            {relatedLeads.map((lead) => (
              <li key={lead.leadId} className="flex items-center justify-between p-2 bg-gray-50 rounded-md dark:bg-gray-700">
                <div className="flex-1">
                  <Link to={`/leads/${lead.leadId}`} className="text-sm font-medium text-primary hover:underline">
                    {lead.title || 'Untitled Lead'}
                  </Link>
                  <div className="flex items-center mt-1">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      lead.status === 'new' 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' 
                        : lead.status === 'qualified'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : lead.status === 'unqualified'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                    }`}>
                      {lead.status || 'new'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveLead(lead.leadId, lead.title || 'this lead')}
                  className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                  aria-label={`Remove ${lead.title || 'this lead'}`}
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
            No leads associated
          </p>
        </div>
      )}
      
      {/* Add lead form */}
      {isExpanded && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Add Lead
          </h4>
          
          {/* Search input */}
          <div className="relative mb-3">
            <input
              type="text"
              placeholder="Search leads..."
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
                {searchResults.map((lead) => (
                  <li key={lead.leadId} className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <button
                      onClick={() => handleSelectLead(lead)}
                      className="w-full text-left"
                    >
                      <div className="font-medium text-sm text-gray-900 dark:text-white">
                        {lead.name || 'Untitled Lead'}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {lead.status || 'new'}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {searchTerm && searchResults.length === 0 && !isSearching && (
            <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                No leads found matching "{searchTerm}"
              </p>
              <Link
                to={`/leads/new?contactId=${contactId}`}
                className="inline-block mt-1 text-xs text-primary hover:underline"
              >
                Create a new lead
              </Link>
            </div>
          )}
          
          {/* Selected Lead */}
          {selectedLead && (
            <div className="mb-3">
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                      {selectedLead.name || 'Untitled Lead'}
                    </h5>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {selectedLead.status || 'new'}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedLead(null)}
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
          {selectedLead && (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="rounded bg-primary py-1 px-3 text-xs font-medium text-white hover:bg-opacity-90 disabled:bg-opacity-70"
                  disabled={submitting}
                >
                  {submitting ? 'Adding...' : 'Add Lead'}
                </button>
              </div>
              
              {submitError && (
                <div className="mt-2 bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-xs" role="alert">
                  <span>{submitError.message}</span>
                </div>
              )}
            </form>
          )}
          
          {/* Create New Lead Link */}
          {!selectedLead && (
            <div className="mt-3 text-center">
              <Link
                to={`/leads/new?contactId=${contactId}`}
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
                Create New Lead
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LeadAssociationSidebar;