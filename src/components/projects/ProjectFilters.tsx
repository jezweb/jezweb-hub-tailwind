/**
 * ProjectFilters Component
 * 
 * A reusable component for filtering projects by various criteria.
 * This component is used across different project types (Website, Graphics, App, SEO, Content)
 * to provide a consistent filtering interface.
 */

import React from 'react';
import { ActionButton } from '../ui/design-system/ActionButton';

interface FilterOption {
  id: string;
  value: string;
}

interface ProjectFiltersProps {
  /** The current search term */
  searchTerm: string;
  
  /** Function to handle search term changes */
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  
  /** The current status filter value */
  status: string;
  
  /** Available status options */
  statusOptions: FilterOption[];
  
  /** Function to handle status filter changes */
  onStatusChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  
  /** The current organisation filter value */
  organisation: string;
  
  /** Available organisation options */
  organisationOptions: FilterOption[];
  
  /** Function to handle organisation filter changes */
  onOrganisationChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  
  /** Function to apply the current filters */
  onApplyFilters: () => void;
  
  /** Function to reset all filters */
  onResetFilters: () => void;
  
  /** Whether the form fields are in a loading state */
  isLoading?: boolean;
  
  /** Optional additional filters */
  additionalFilters?: React.ReactNode;
  
  /** Optional additional CSS classes */
  className?: string;
}

/**
 * ProjectFilters component
 * 
 * @example
 * <ProjectFilters
 *   searchTerm={filters.searchTerm}
 *   onSearchChange={handleFilterChange}
 *   status={filters.status}
 *   statusOptions={statusOptions}
 *   onStatusChange={handleFilterChange}
 *   organisation={filters.organisation}
 *   organisationOptions={organisationOptions}
 *   onOrganisationChange={handleFilterChange}
 *   onApplyFilters={applyFilters}
 *   onResetFilters={resetFilters}
 *   isLoading={loading}
 * />
 */
export const ProjectFilters: React.FC<ProjectFiltersProps> = ({
  searchTerm,
  onSearchChange,
  status,
  statusOptions,
  onStatusChange,
  organisation,
  organisationOptions,
  onOrganisationChange,
  onApplyFilters,
  onResetFilters,
  isLoading = false,
  additionalFilters,
  className = ''
}) => {
  return (
    <div className={`rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
      <div className="grid gap-4 md:grid-cols-4">
        {/* Search */}
        <div>
          <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Search
          </label>
          <input
            type="text"
            id="searchTerm"
            name="searchTerm"
            value={searchTerm}
            onChange={onSearchChange}
            placeholder="Search projects..."
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
            disabled={isLoading}
          />
        </div>
        
        {/* Status Filter */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={status}
            onChange={onStatusChange}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
            disabled={isLoading}
          >
            <option value="">All Statuses</option>
            {isLoading ? (
              <option value="" disabled>Loading statuses...</option>
            ) : (
              statusOptions.map((option) => (
                <option key={option.id} value={option.value}>
                  {option.value}
                </option>
              ))
            )}
          </select>
        </div>
        
        {/* Organisation Filter */}
        <div>
          <label htmlFor="organisation" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Organisation
          </label>
          <select
            id="organisation"
            name="organisation"
            value={organisation}
            onChange={onOrganisationChange}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
            disabled={isLoading}
          >
            <option value="">All Organisations</option>
            {isLoading ? (
              <option value="" disabled>Loading organisations...</option>
            ) : (
              organisationOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.value}
                </option>
              ))
            )}
          </select>
        </div>
        
        {/* Additional Filters */}
        {additionalFilters}
        
        {/* Filter Actions */}
        <div className="flex items-end space-x-2">
          <ActionButton
            variant="primary"
            onClick={onApplyFilters}
            disabled={isLoading}
          >
            Apply Filters
          </ActionButton>
          <ActionButton
            variant="light"
            onClick={onResetFilters}
            disabled={isLoading}
          >
            Reset
          </ActionButton>
        </div>
      </div>
    </div>
  );
};