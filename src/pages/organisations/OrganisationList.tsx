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
 */

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useOrganisations } from '../../hooks/organisations/useOrganisations';
import Button from "../../components/ui/button/Button";
import Alert from "../../components/ui/alert/Alert";
import { Organisation } from '../../types/Organisation';

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
  // Debug: Log when this component is rendered
  console.log("Rendering OrganisationList component");
  
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
        <PageBreadcrumb pageTitle="Loading Organisations" items={[]} />
        <div className="rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
          <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
            <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">Loading Organisations</h3>
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Render error state
  if (error) {
    return (
      <>
        <PageMeta title="Error | Jezweb Hub" description="An error occurred while loading organisations" />
        <PageBreadcrumb pageTitle="Organisations Error" items={[]} />
        <div className="rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
          <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
            <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">Error Loading Organisations</h3>
            <Alert variant="error" title="Error!" message={error?.message || "An unknown error occurred"} />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta 
        title="Organisations | Jezweb Hub" 
        description="Manage your organisations" 
      />
      <PageBreadcrumb pageTitle="Organisations" items={[]} />
      <div className="rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="space-y-6">
          {/* Search and Filter Bar */}
          <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              {/* Search Form */}
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search organisations..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="h-10 w-full rounded-lg border border-stroke bg-transparent pl-10 pr-4 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">
                    <svg
                      className="fill-body dark:fill-bodydark"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M15.7 14.3L12.3 10.9C13.4 9.5 14 7.8 14 6C14 2.7 11.3 0 8 0C4.7 0 2 2.7 2 6C2 9.3 4.7 12 8 12C9.8 12 11.5 11.4 12.9 10.3L16.3 13.7C16.5 13.9 16.8 14 17 14C17.2 14 17.5 13.9 17.7 13.7C18.1 13.3 18.1 12.7 17.7 12.3L15.7 14.3ZM8 10C5.8 10 4 8.2 4 6C4 3.8 5.8 2 8 2C10.2 2 12 3.8 12 6C12 8.2 10.2 10 8 10Z"
                      />
                    </svg>
                  </span>
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  className="ml-2"
                >
                  Search
                </Button>
              </form>

              {/* Status Filter */}
              <div className="flex items-center">
                <label htmlFor="statusFilter" className="mr-2 text-gray-800 dark:text-white/90">
                  Status:
                </label>
                <select
                  id="statusFilter"
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                  className="h-10 rounded-lg border border-stroke bg-transparent px-4 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary"
                >
                  <option value="">All</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="lead">Lead</option>
                  <option value="prospect">Prospect</option>
                </select>
              </div>

              {/* Add Organisation Button */}
              <Button
                variant="primary"
                onClick={() => navigate('/organisations/new')}
                startIcon={
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM15 11H11V15H9V11H5V9H9V5H11V9H15V11Z" fill="white" />
                  </svg>
                }
              >
                Add Organisation
              </Button>
            </div>
          </div>

          {/* Organisations Table */}
          <div className="overflow-x-auto rounded-sm border border-stroke bg-white dark:border-strokedark dark:bg-boxdark shadow-default">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th 
                    className="py-4 px-4 font-medium text-gray-800 dark:text-white/90 cursor-pointer"
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
                    className="py-4 px-4 font-medium text-gray-800 dark:text-white/90 cursor-pointer"
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
                    className="py-4 px-4 font-medium text-gray-800 dark:text-white/90 cursor-pointer"
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
                    className="py-4 px-4 font-medium text-gray-800 dark:text-white/90 cursor-pointer"
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
                  <th className="py-4 px-4 font-medium text-gray-800 dark:text-white/90">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {organisations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <div className="flex justify-center">
                        <p className="text-gray-800 dark:text-white/90">No organisations found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  organisations.map((organisation) => (
                    <tr key={organisation.organisationId}>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <h5 className="font-medium text-gray-800 dark:text-white/90">
                          {organisation.organisationName}
                        </h5>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-gray-800 dark:text-white/90">
                          {organisation.organisationType || '-'}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <span className={`inline-flex rounded-full py-1 px-3 text-sm font-medium ${
                          organisation.status === 'active' 
                            ? 'bg-success bg-opacity-10 text-success' 
                            : organisation.status === 'inactive'
                            ? 'bg-danger bg-opacity-10 text-danger'
                            : organisation.status === 'lead'
                            ? 'bg-warning bg-opacity-10 text-warning'
                            : 'bg-info bg-opacity-10 text-info'
                        }`}>
                          {organisation.status}
                        </span>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-gray-800 dark:text-white/90">
                          {organisation.industry || '-'}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <div className="flex items-center space-x-3.5">
                          {/* View Button */}
                          <button
                            className="hover:text-primary"
                            aria-label={`View ${organisation.organisationName}`}
                            onClick={() => onViewOrganisation && onViewOrganisation(organisation)}
                          >
                            <svg
                              className="fill-current"
                              width="18"
                              height="18"
                              viewBox="0 0 18 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M9 3.75C4.5 3.75 1.5 9 1.5 9C1.5 9 4.5 14.25 9 14.25C13.5 14.25 16.5 9 16.5 9C16.5 9 13.5 3.75 9 3.75ZM9 12.75C7.125 12.75 5.625 11.25 5.625 9.375C5.625 7.5 7.125 6 9 6C10.875 6 12.375 7.5 12.375 9.375C12.375 11.25 10.875 12.75 9 12.75ZM9 7.5C7.95 7.5 7.125 8.325 7.125 9.375C7.125 10.425 7.95 11.25 9 11.25C10.05 11.25 10.875 10.425 10.875 9.375C10.875 8.325 10.05 7.5 9 7.5Z"
                              />
                            </svg>
                          </button>
                          
                          {/* Edit Button */}
                          <button
                            className="hover:text-primary"
                            aria-label={`Edit ${organisation.organisationName}`}
                            onClick={() => onEditOrganisation && onEditOrganisation(organisation)}
                          >
                            <svg
                              className="fill-current"
                              width="18"
                              height="18"
                              viewBox="0 0 18 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                              />
                              <path
                                d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                              />
                              <path
                                d="M10.8789 9.7594C10.8789 9.42189 10.5977 9.11252 10.2321 9.11252C9.89456 9.11252 9.58519 9.39377 9.58519 9.7594V13.3313C9.58519 13.6688 9.86644 13.9782 10.2321 13.9782C10.5695 13.9782 10.8789 13.6969 10.8789 13.3313V9.7594Z"
                              />
                              <path
                                d="M7.12177 9.7594C7.12177 9.42189 6.84052 9.11252 6.47489 9.11252C6.13739 9.11252 5.82812 9.39377 5.82812 9.7594V13.3313C5.82812 13.6688 6.10927 13.9782 6.47489 13.9782C6.84052 13.9782 7.12177 13.6969 7.12177 13.3313V9.7594Z"
                              />
                            </svg>
                          </button>
                          
                          {/* Delete Button */}
                          <button
                            className="hover:text-primary"
                            aria-label={`Delete ${organisation.organisationName}`}
                            onClick={() => handleDelete(organisation)}
                          >
                            <svg
                              className="fill-current"
                              width="18"
                              height="18"
                              viewBox="0 0 18 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                              />
                              <path
                                d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                              />
                              <path
                                d="M10.8789 9.7594C10.8789 9.42189 10.5977 9.11252 10.2321 9.11252C9.89456 9.11252 9.58519 9.39377 9.58519 9.7594V13.3313C9.58519 13.6688 9.86644 13.9782 10.2321 13.9782C10.5695 13.9782 10.8789 13.6969 10.8789 13.3313V9.7594Z"
                              />
                              <path
                                d="M7.12177 9.7594C7.12177 9.42189 6.84052 9.11252 6.47489 9.11252C6.13739 9.11252 5.82812 9.39377 5.82812 9.7594V13.3313C5.82812 13.6688 6.10927 13.9782 6.47489 13.9782C6.84052 13.9782 7.12177 13.6969 7.12177 13.3313V9.7594Z"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrganisationList;