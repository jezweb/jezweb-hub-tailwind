import React, { useEffect, useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useOrganisations } from "../../hooks/organisations/useOrganisations";
import { Organisation } from "../../types/Organisation";
import PageMeta from "../../components/common/PageMeta";

// Import design system components
import { Container } from '../../components/ui/design-system/Container';
import { PageHeading } from '../../components/ui/design-system/PageHeading';
import { Card } from '../../components/ui/design-system/Card';
import { ActionButton } from '../../components/ui/design-system/ActionButton';
import { LoadingState } from '../../components/ui/design-system/LoadingState';
import { ErrorMessage } from '../../components/ui/design-system/ErrorMessage';
import { StatusBadge } from '../../components/ui/design-system/StatusBadge';

/**
 * Organisations Page Component
 * 
 * This component displays and manages client organisations in the Jezweb Hub system.
 * It fetches organisation data from Firebase and provides filtering, sorting, and search functionality.
 * 
 * This component is the main entry point for the Organisations section of the application.
 * It works in conjunction with the following sub-components:
 * - OrganisationCreate: For creating new organisations
 * - OrganisationDetails: For viewing organisation details
 * - OrganisationEdit: For editing existing organisations
 * 
 * The component uses the useOrganisations hook to interact with the organisation data
 * and provides a card-based UI for displaying organisations.
 * 
 * This component uses the design system components for consistent styling:
 * - Container: For page layout and padding
 * - PageHeading: For the page title
 * - Card: For content sections
 * - ActionButton: For action buttons
 * - LoadingState: For loading indicators
 * - ErrorMessage: For error messages
 * - StatusBadge: For displaying organisation status
 * 
 * @returns {JSX.Element} The rendered Organisations page
 */
const Organisations: React.FC = () => {
  const navigate = useNavigate();

  // Get organisations data and actions from the hook
  const { 
    organisations, 
    loading, 
    error, 
    fetchOrganisations,
    searchOrganisations 
  } = useOrganisations();
  
  // State for filtering and sorting
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('name-asc');
  
  // Fetch organisations on component mount
  useEffect(() => {
    // Determine sort field and direction based on sortOrder
    let sortField = 'organisationName';
    let sortDirection: 'asc' | 'desc' = 'asc';
    
    if (sortOrder === 'name-desc') {
      sortDirection = 'desc';
    } else if (sortOrder === 'created-asc') {
      sortField = 'createdAt';
      sortDirection = 'asc';
    } else if (sortOrder === 'created-desc') {
      sortField = 'createdAt';
      sortDirection = 'desc';
    }
    
    // Create filters array based on typeFilter and statusFilter
    const filters: { field: string; operator: string; value: any }[] = [];
    
    if (typeFilter) {
      filters.push({ field: 'organisationType', operator: '==', value: typeFilter });
    }
    
    if (statusFilter) {
      filters.push({ field: 'status', operator: '==', value: statusFilter });
    }
    
    fetchOrganisations(filters, sortField, sortDirection);
  }, [fetchOrganisations, typeFilter, statusFilter, sortOrder]);
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle search form submit
  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      searchOrganisations(searchTerm);
    } else {
      // If search term is empty, reset to normal filtering
      fetchOrganisations(
        statusFilter ? [{ field: 'status', operator: '==', value: statusFilter }] : undefined
      );
    }
  };

  // Handle view organisation
  const handleViewOrganisation = (organisationId: string) => {
    navigate(`/organisations/${organisationId}`);
  };

  // Handle edit organisation
  const handleEditOrganisation = (organisationId: string) => {
    navigate(`/organisations/${organisationId}/edit`);
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
          description="Manage client organisations and businesses"
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
                      />
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

              <div className="flex flex-wrap gap-4">
                {/* Type Filter */}
                <div>
                  <select 
                    aria-label="Filter by type"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="h-10 rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">All Types</option>
                    <option value="business">Business</option>
                    <option value="non-profit">Non-Profit</option>
                    <option value="government">Government</option>
                    <option value="education">Education</option>
                    <option value="individual">Individual</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                {/* Status Filter */}
                <div>
                  <select 
                    aria-label="Filter by status"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="h-10 rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="lead">Lead</option>
                    <option value="former">Former</option>
                  </select>
                </div>
                
                {/* Sort Order */}
                <div>
                  <select 
                    aria-label="Sort by"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="h-10 rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="name-asc">Name (A-Z)</option>
                    <option value="name-desc">Name (Z-A)</option>
                    <option value="created-desc">Newest First</option>
                    <option value="created-asc">Oldest First</option>
                  </select>
                </div>
              </div>
            </div>
          </Card>

          {/* Empty State */}
          {organisations.length === 0 && (
            <Card className="text-center py-12">
              <svg
                className="mx-auto mb-4 h-16 w-16 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
                No organisations found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Add your first organisation to get started
              </p>
              <ActionButton
                variant="primary"
                onClick={() => navigate('/organisations/new')}
              >
                Add Organisation
              </ActionButton>
            </Card>
          )}

          {/* Organisations Grid */}
          {organisations.length > 0 && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {organisations.map((organisation: Organisation) => (
                <Card key={organisation.organisationId}>
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {organisation.organisationName}
                    </h3>
                    <StatusBadge status={organisation.status} />
                  </div>
                  <div className="mb-4 space-y-2">
                    {organisation.customFields?.email && (
                      <div className="flex items-start">
                        <svg
                          className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          <a href={`mailto:${organisation.customFields.email}`} className="hover:text-blue-600">
                            {organisation.customFields.email}
                          </a>
                        </span>
                      </div>
                    )}
                    {organisation.customFields?.phone && (
                      <div className="flex items-start">
                        <svg
                          className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          <a href={`tel:${organisation.customFields.phone}`} className="hover:text-blue-600">
                            {organisation.customFields.phone}
                          </a>
                        </span>
                      </div>
                    )}
                    {organisation.billingAddress && (
                      <div className="flex items-start">
                        <svg
                          className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {`${organisation.billingAddress.suburb}, ${organisation.billingAddress.state}`}
                        </span>
                      </div>
                    )}
                    {organisation.website && (
                      <div className="flex items-start">
                        <svg
                          className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                          />
                        </svg>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          <a href={organisation.website} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                            {organisation.website}
                          </a>
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <ActionButton
                      variant="secondary"
                      size="small"
                      onClick={() => handleViewOrganisation(organisation.organisationId)}
                    >
                      Details
                    </ActionButton>
                    <ActionButton
                      variant="primary"
                      size="small"
                      onClick={() => handleEditOrganisation(organisation.organisationId)}
                    >
                      Edit
                    </ActionButton>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Container>
    </>
  );
};

export default Organisations;