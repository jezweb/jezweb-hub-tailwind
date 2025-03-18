/**
 * ProjectTable Component
 * 
 * A reusable table component for displaying project information in a tabular layout.
 * This component is used across different project types (Website, Graphics, App, SEO, Content)
 * to provide a consistent table-based view.
 */

import React from 'react';
import { StatusBadge } from '../ui/design-system/StatusBadge';
import { ActionButton } from '../ui/design-system/ActionButton';
import { BaseProject } from './ProjectCard';

interface ProjectTableProps<T extends BaseProject> {
  /** The projects data to display */
  projects: T[];
  
  /** Whether the table is in a loading state */
  isLoading?: boolean;
  
  /** Function to handle viewing a project's details */
  onViewProject: (projectId: string) => void;
  
  /** Function to handle editing a project */
  onEditProject: (projectId: string) => void;
  
  /** Function to handle deleting a project */
  onDeleteProject: (projectId: string) => void;
  
  /** Function to handle sorting by a specific field */
  onSort?: (field: string) => void;
  
  /** The current sort field */
  sortField?: string;
  
  /** The current sort direction */
  sortDirection?: 'asc' | 'desc';
  
  /** Optional additional columns to display */
  additionalColumns?: {
    header: React.ReactNode;
    accessor: string;
    cell: (project: T) => React.ReactNode;
  }[];
  
  /** Optional additional CSS classes */
  className?: string;
}

/**
 * ProjectTable component
 * 
 * @example
 * <ProjectTable
 *   projects={projects}
 *   isLoading={loading}
 *   onViewProject={handleViewProject}
 *   onEditProject={handleEditProject}
 *   onDeleteProject={handleDeleteProject}
 *   onSort={handleSort}
 *   sortField={sortField}
 *   sortDirection={sortDirection}
 * />
 */
export function ProjectTable<T extends BaseProject>({
  projects,
  isLoading = false,
  onViewProject,
  onEditProject,
  onDeleteProject,
  onSort,
  sortField,
  sortDirection,
  additionalColumns = [],
  className = ''
}: ProjectTableProps<T>) {
  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Render sort indicator
  const renderSortIndicator = (field: string) => {
    if (sortField !== field) return null;
    
    return (
      <span className="ml-1">
        {sortDirection === 'asc' ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </span>
    );
  };

  // Handle sort click
  const handleSortClick = (field: string) => {
    if (onSort) {
      onSort(field);
    }
  };

  return (
    <div className={`overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 ${className}`}>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
              onClick={() => handleSortClick('projectName')}
              style={{ cursor: onSort ? 'pointer' : 'default' }}
            >
              <div className="flex items-center">
                Project Name
                {renderSortIndicator('projectName')}
              </div>
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
              onClick={() => handleSortClick('status')}
              style={{ cursor: onSort ? 'pointer' : 'default' }}
            >
              <div className="flex items-center">
                Status
                {renderSortIndicator('status')}
              </div>
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
              onClick={() => handleSortClick('organisationName')}
              style={{ cursor: onSort ? 'pointer' : 'default' }}
            >
              <div className="flex items-center">
                Organisation
                {renderSortIndicator('organisationName')}
              </div>
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
              onClick={() => handleSortClick('startDate')}
              style={{ cursor: onSort ? 'pointer' : 'default' }}
            >
              <div className="flex items-center">
                Start Date
                {renderSortIndicator('startDate')}
              </div>
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
              onClick={() => handleSortClick('dueDate')}
              style={{ cursor: onSort ? 'pointer' : 'default' }}
            >
              <div className="flex items-center">
                Due Date
                {renderSortIndicator('dueDate')}
              </div>
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
              onClick={() => handleSortClick('assignedToName')}
              style={{ cursor: onSort ? 'pointer' : 'default' }}
            >
              <div className="flex items-center">
                Assigned To
                {renderSortIndicator('assignedToName')}
              </div>
            </th>
            
            {/* Render additional column headers */}
            {additionalColumns.map((column, index) => (
              <th 
                key={index}
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                onClick={() => handleSortClick(column.accessor)}
                style={{ cursor: onSort ? 'pointer' : 'default' }}
              >
                <div className="flex items-center">
                  {column.header}
                  {renderSortIndicator(column.accessor)}
                </div>
              </th>
            ))}
            
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
          {isLoading ? (
            <tr>
              <td colSpan={7 + additionalColumns.length} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center justify-center">
                  <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-gray-900 dark:border-white"></div>
                  <span className="ml-2">Loading projects...</span>
                </div>
              </td>
            </tr>
          ) : projects.length === 0 ? (
            <tr>
              <td colSpan={7 + additionalColumns.length} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                No projects found
              </td>
            </tr>
          ) : (
            projects.map((project) => (
              <tr key={project.projectId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                  {project.projectName}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  <StatusBadge status={project.status} />
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {project.organisationName || '—'}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(project.startDate)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(project.dueDate)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {project.assignedToName || '—'}
                </td>
                
                {/* Render additional column cells */}
                {additionalColumns.map((column, index) => (
                  <td key={index} className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {column.cell(project)}
                  </td>
                ))}
                
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <ActionButton
                      variant="light"
                      size="small"
                      onClick={() => onViewProject(project.projectId)}
                    >
                      View
                    </ActionButton>
                    <ActionButton
                      variant="light"
                      size="small"
                      onClick={() => onEditProject(project.projectId)}
                    >
                      Edit
                    </ActionButton>
                    <ActionButton
                      variant="danger"
                      size="small"
                      onClick={() => onDeleteProject(project.projectId)}
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
  );
}