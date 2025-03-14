import React, { useEffect, useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import { useOrganisations } from "../../hooks/organisations/useOrganisations";
import { Organisation } from "../../types/Organisation";

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
 * @returns {JSX.Element} The rendered Organisations page
 */
const Organisations: React.FC = () => {
  // Debug: Log when this component is rendered
  console.log("Rendering standalone Organisations component");

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
  
  // State for filtered organisations
  const [filteredOrganisations, setFilteredOrganisations] = useState<Organisation[]>([]);
  
  // Fetch organisations on component mount
  useEffect(() => {
    console.log("Fetching organisations in standalone component");
    
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
  
  // Update filtered organisations when organisations change
  useEffect(() => {
    setFilteredOrganisations(organisations);
  }, [organisations]);
  
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
  
  console.log("Organisations data:", organisations);
  
  
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Organisations
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage client organisations and businesses
        </p>
      </div>

      {/* Action Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <form onSubmit={handleSearchSubmit} className="flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search organisations..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="h-10 w-full rounded-lg border border-gray-300 bg-white pl-4 pr-10 text-sm text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2">
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
            <button type="submit" className="ml-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
              Search
            </button>
          </form>
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
        {/* Debug: Change button to Link for testing */}
        <Link to="/organisations/new" className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 inline-block">
          Add Organisation
        </Link>
      </div>

      {/* Organisations Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Loading State */}
        {loading && <div className="col-span-full flex h-60 flex-col items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading organisations...</p>
        </div>}
        
        {/* Error State */}
        {error && <div className="col-span-full rounded-lg bg-red-100 p-4 text-red-700">
          <p className="font-bold">Error loading organisations</p>
          <p>{error.message}</p>
        </div>}
        
        {/* Empty State */}
        {!loading && !error && organisations.length === 0 && <div className="col-span-full flex h-60 flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-800">
          <svg
            className="mb-4 h-16 w-16 text-gray-400"
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
            ></path>
          </svg>
          <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
            No organisations found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Add your first organisation to get started
          </p>
        </div>}

        {/* Organisation Card Template (Hidden for now) */}
        {!loading && !error && organisations.map((organisation: Organisation) => (<div key={organisation.organisationId} className="rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
          <div className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {organisation.organisationName}
              </h3>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                organisation.status === 'active' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                  : organisation.status === 'inactive'
                  ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  : organisation.status === 'lead'
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
              }`}>
                {organisation.status}
              </span>
            </div>
            <div className="mb-4 space-y-2">
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
                  ></path>
                </svg>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {organisation.website || 'No email available'}
                </span>
              </div>
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
                  ></path>
                </svg>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {organisation.customFields?.phone || 'No phone available'}
                </span>
              </div>
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
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {organisation.billingAddress ? `${organisation.billingAddress.suburb}, ${organisation.billingAddress.state}` : 'No address available'}
                </span>
              </div>
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
                  ></path>
                </svg>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {organisation.website || 'No website available'}
                </span>
              </div>
            </div>
            <div className="flex justify-between">
              <Link to={`/organisations/${organisation.organisationId}`} className="rounded bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                Details
              </Link>
              <Link to={`/organisations/${organisation.organisationId}/edit`} className="rounded bg-blue-100 px-3 py-1 text-sm text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50">
                Edit
              </Link>
            </div>
          </div>
        </div>))}
      </div>
    </div>
  );
};

export default Organisations;