/**
 * OrganisationList Component
 * 
 * This component displays a list of organisations in a table format.
 * It uses the useOrganisations hook to fetch and manage organisation data.
 * 
 * Features:
 * - Displays organisations in a sortable table
 * - Provides actions for viewing, editing, and deleting organisations
 * - Shows loading states and error messages
 * - Supports pagination and filtering
 * 
 * This component uses the design system components for consistent styling:
 * - Container: For page layout and padding
 * - PageHeading: For the page title
 * - Card: For content sections
 * - ActionButton: For action buttons
 * - LoadingState: For loading indicators
 * - ErrorMessage: For error messages
 * - StatusBadge: For displaying organisation status
 */

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageMeta from "../../components/common/PageMeta";
import { useOrganisations } from '../../hooks/organisations/useOrganisations';
import { Organisation } from '../../types/Organisation';

// Import design system components
import { Container } from '../../components/ui/design-system/Container';
import { PageHeading } from '../../components/ui/design-system/PageHeading';
import { Card } from '../../components/ui/design-system/Card';
import { ActionButton } from '../../components/ui/design-system/ActionButton';
import { LoadingState } from '../../components/ui/design-system/LoadingState';
import { ErrorMessage } from '../../components/ui/design-system/ErrorMessage';
import { StatusBadge } from '../../components/ui/design-system/StatusBadge';

/**
 * OrganisationList component props
 */
interface OrganisationListProps {
  onViewOrganisation?: (organisation: Organisation) => void;
  onEditOrganisation?: (organisation: Organisation) => void;
  onDeleteOrganisation?: (organisation: Organisation) => void;
}

/**
 * OrganisationList component
 */
const OrganisationList: React.FC<OrganisationListProps> = ({
  onViewOrganisation,
  onEditOrganisation,
  onDeleteOrganisation
}) => {
  const navigate = useNavigate();
  
  // Get organisations data and actions from the hook
  const {
    organisations,
    loading,
    error,
    fetchOrganisations,
    deleteOrganisation
  } = useOrganisations();

  // Local state for sorting
  const [sortField, setSortField] = useState<string>('organisationName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Local state for search
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Local state for status filter
  const [statusFilter, setStatusFilter] = useState<string>('');

  // Fetch organisations on component mount
  useEffect(() => {
    fetchOrganisations(
      statusFilter ? [{ field: 'status', operator: '==', value: statusFilter }] : undefined,
      sortField,
      sortDirection
    );
  }, [fetchOrganisations, sortField, sortDirection, statusFilter]);

  // Handle sort column click
  const handleSort = (field: string) => {
    if (field === sortField) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle search form submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // If search term is empty, fetch all organisations
    if (!searchTerm.trim()) {
      fetchOrganisations(
        statusFilter ? [{ field: 'status', operator: '==', value: statusFilter }] : undefined,
        sortField,
        sortDirection
      );
    } else {
      // Otherwise, search by name
      fetchOrganisations([
        { field: 'organisationName', operator: '>=', value: searchTerm },
        { field: 'organisationName', operator: '<=', value: searchTerm + '\uf8ff' }
      ]);
    }
  };

  // Handle status filter change
  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };

  // Handle delete organisation
  const handleDelete = async (organisation: Organisation) => {
    if (window.confirm(`Are you sure you want to delete ${organisation.organisationName}?`)) {
      try {
        await deleteOrganisation(organisation.organisationId);
        // If custom delete handler is provided, call it
        if (onDeleteOrganisation) {
          onDeleteOrganisation(organisation);
        }
      } catch (error) {
        console.error('Error deleting organisation:', error);
      }
    }
  };

  // Render loading state
  if (loading) {
    return (
      <>
        <PageMeta title="Loading | Jezweb Hub" description="Loading organisations data" />
        <Container>
          <PageHeading title="Loading Organisations" />
          <LoadingState message="Loading organisations..." size="large" />
        </Container>
      </>
    );
  }

  // Render error state
  if (error) {
    return (
      <>
        <PageMeta title="Error | Jezweb Hub" description="An error occurred while loading organisations" />
        <Container>
          <PageHeading title="Organisations Error" />
          <ErrorMessage 
            title="Error Loading Organisations" 
            message={error?.message || "An unknown error occurred"} 
          />
        </Container>
      </>
    );
  }

  return (
    <>
      <PageMeta 
        title="Organisations | Jezweb Hub" 
        description="Manage your organisations" 
      />
      <Container>
        <PageHeading 
          title="Organisations"
          actions={
            <ActionButton
              variant="primary"
              onClick={() => navigate('/organisations/new')}
              iconBefore={
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 0C3.58 0 0 3.58 0 8C0 12.42 3.58 16 8 16C12.42 16 16 12.42 16 8C16 3.58 12.42 0 8 0ZM12 9H9V12H7V9H4V7H7V4H9V7H12V9Z" fill="currentColor" />
                </svg>
              }
            >
              Add Organisation
            </ActionButton>
          }
        />
        
        <div className="space-y-6">
          {/* Search and Filter Bar */}
          <Card>
            <div className="flex flex-wrap gap-4 items-center justify-between">
              {/* Search Form */}
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search organisations..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="h-10 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">
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
                  </span>
                </div>
                <ActionButton
                  type="submit"
                  variant="primary"
                  className="ml-2"
                >
                  Search
                </ActionButton>
              </form>

              {/* Status Filter */}
              <div className="flex items-center">
                <label htmlFor="statusFilter" className="mr-2 text-gray-700 dark:text-gray-300">
                  Status:
                </label>
                <select
                  id="statusFilter"
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                  className="h-10 rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">All</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="lead">Lead</option>
                  <option value="prospect">Prospect</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Organisations Table */}
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-100 text-left dark:bg-gray-700">
                    <th 
                      className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                      onClick={() => handleSort('organisationName')}
                    >
                      <div className="flex items-center">
                        Organisation Name
                        {sortField === 'organisationName' && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                      onClick={() => handleSort('organisationType')}
                    >
                      <div className="flex items-center">
                        Type
                        {sortField === 'organisationType' && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center">
                        Status
                        {sortField === 'status' && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                      onClick={() => handleSort('industry')}
                    >
                      <div className="flex items-center">
                        Industry
                        {sortField === 'industry' && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {organisations.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="border-b border-gray-200 py-5 px-4 dark:border-gray-600">
                        <div className="flex justify-center">
                          <p className="text-gray-700 dark:text-gray-300">No organisations found</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    organisations.map((organisation) => (
                      <tr key={organisation.organisationId} className="border-b border-gray-200 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800">
                        <td className="py-4 px-4">
                          <h5 className="font-medium text-gray-800 dark:text-white">
                            {organisation.organisationName}
                          </h5>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-gray-700 dark:text-gray-300">
                            {organisation.organisationType || '-'}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <StatusBadge status={organisation.status} />
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-gray-700 dark:text-gray-300">
                            {organisation.industry || '-'}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            {/* View Button */}
                            <ActionButton
                              variant="secondary"
                              size="small"
                              onClick={() => onViewOrganisation && onViewOrganisation(organisation)}
                              aria-label={`View ${organisation.organisationName}`}
                            >
                              View
                            </ActionButton>
                            
                            {/* Edit Button */}
                            <ActionButton
                              variant="secondary"
                              size="small"
                              onClick={() => onEditOrganisation && onEditOrganisation(organisation)}
                              aria-label={`Edit ${organisation.organisationName}`}
                            >
                              Edit
                            </ActionButton>
                            
                            {/* Delete Button */}
                            <ActionButton
                              variant="danger"
                              size="small"
                              onClick={() => handleDelete(organisation)}
                              aria-label={`Delete ${organisation.organisationName}`}
                            >
                              Delete
                            </ActionButton>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </Container>
    </>
  );
};

export default OrganisationList;