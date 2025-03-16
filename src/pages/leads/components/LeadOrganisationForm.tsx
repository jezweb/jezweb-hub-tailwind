import React, { useState, useEffect } from 'react';
import { Lead } from '../../../types/Lead';

/**
 * LeadOrganisationForm Component
 * 
 * This component provides a form for linking leads to organisations.
 * It allows searching for organisations and selecting one to link to the lead.
 */
interface Organisation {
  organisationId: string;
  name: string;
}

interface LeadOrganisationFormProps {
  lead: Lead;
  organisations: Organisation[];
  isLoading: boolean;
  onLinkOrganisation: (leadId: string, organisationId: string) => Promise<void>;
  onUnlinkOrganisation: (leadId: string) => Promise<void>;
}

const LeadOrganisationForm: React.FC<LeadOrganisationFormProps> = ({
  lead,
  organisations,
  isLoading,
  onLinkOrganisation,
  onUnlinkOrganisation
}) => {
  // Selected organisation state
  const [selectedOrganisationId, setSelectedOrganisationId] = useState<string>('');
  
  // Search term state
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Filtered organisations state
  const [filteredOrganisations, setFilteredOrganisations] = useState<Organisation[]>(organisations);
  
  // Submitting state
  const [submitting, setSubmitting] = useState<boolean>(false);
  
  // Error state
  const [error, setError] = useState<string | null>(null);
  
  // Initialize selected organisation if lead has one
  useEffect(() => {
    if (lead.organisationId) {
      setSelectedOrganisationId(lead.organisationId);
    }
  }, [lead]);
  
  // Filter organisations based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredOrganisations(organisations);
      return;
    }
    
    const filtered = organisations.filter(org => 
      org.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredOrganisations(filtered);
  }, [searchTerm, organisations]);
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle organisation selection
  const handleOrganisationSelect = (organisationId: string) => {
    setSelectedOrganisationId(organisationId);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedOrganisationId) {
      setError('Please select an organisation');
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      await onLinkOrganisation(lead.leadId, selectedOrganisationId);
    } catch (err) {
      setError('Failed to link organisation');
      console.error('Error linking organisation:', err);
    } finally {
      setSubmitting(false);
    }
  };
  
  // Handle unlinking organisation
  const handleUnlink = async () => {
    if (!lead.organisationId) return;
    
    setSubmitting(true);
    setError(null);
    
    try {
      await onUnlinkOrganisation(lead.leadId);
      setSelectedOrganisationId('');
    } catch (err) {
      setError('Failed to unlink organisation');
      console.error('Error unlinking organisation:', err);
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <h2 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
        Link to Organisation
      </h2>
      
      {lead.organisationId ? (
        <div>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
            This lead is currently linked to:
          </p>
          <div className="mb-4 flex items-center justify-between rounded-md bg-gray-50 p-4 dark:bg-gray-700">
            <span className="font-medium text-gray-900 dark:text-white">
              {organisations.find(org => org.organisationId === lead.organisationId)?.name || 'Unknown Organisation'}
            </span>
            <button
              type="button"
              onClick={handleUnlink}
              disabled={submitting}
              className="rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
            >
              Unlink
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="organisation-search" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Search Organisations
            </label>
            <input
              type="text"
              id="organisation-search"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Type to search..."
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
            />
          </div>
          
          <div className="mb-4 max-h-60 overflow-y-auto rounded-md border border-gray-200 dark:border-gray-700">
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-gray-900 dark:border-white"></div>
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">Loading organisations...</span>
              </div>
            ) : filteredOrganisations.length === 0 ? (
              <p className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                No organisations found
              </p>
            ) : (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredOrganisations.map(org => (
                  <li key={org.organisationId}>
                    <button
                      type="button"
                      onClick={() => handleOrganisationSelect(org.organisationId)}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 ${
                        selectedOrganisationId === org.organisationId ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id={`org-${org.organisationId}`}
                          name="organisation"
                          checked={selectedOrganisationId === org.organisationId}
                          onChange={() => {}}
                          aria-label={`Select ${org.name}`}
                          className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                        />
                        <span className="ml-3 block text-sm font-medium text-gray-900 dark:text-white">
                          {org.name}
                        </span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {error && (
            <p className="mb-4 text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!selectedOrganisationId || submitting}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? 'Linking...' : 'Link Organisation'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default LeadOrganisationForm;