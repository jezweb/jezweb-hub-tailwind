/**
 * ProjectDetail Component
 * 
 * A reusable component for displaying detailed project information.
 * This component is used across different project types (Website, Graphics, App, SEO, Content)
 * to provide a consistent detailed view.
 */

import React from 'react';
import { Card } from '../ui/design-system/Card';
import { StatusBadge } from '../ui/design-system/StatusBadge';
import { InfoItem } from '../ui/design-system/InfoItem';
import { ActionButton } from '../ui/design-system/ActionButton';
import { BaseProject } from './ProjectCard';

interface ProjectDetailProps<T extends BaseProject> {
  /** The project data to display */
  project: T;
  
  /** Whether the component is in a loading state */
  isLoading?: boolean;
  
  /** Function to handle editing the project */
  onEdit: (projectId: string) => void;
  
  /** Function to handle deleting the project */
  onDelete: (projectId: string) => void;
  
  /** Function to handle changing the project status */
  onStatusChange?: (projectId: string, status: string) => void;
  
  /** Available status options for the status dropdown */
  statusOptions?: { id: string; value: string }[];
  
  /** Optional additional sections to display */
  additionalSections?: React.ReactNode;
  
  /** Optional additional actions to display */
  additionalActions?: React.ReactNode;
  
  /** Optional additional CSS classes */
  className?: string;
}

/**
 * ProjectDetail component
 * 
 * @example
 * <ProjectDetail
 *   project={selectedProject}
 *   isLoading={loading}
 *   onEdit={handleEditProject}
 *   onDelete={handleDeleteProject}
 *   onStatusChange={handleStatusChange}
 *   statusOptions={statusOptions}
 * />
 */
export function ProjectDetail<T extends BaseProject>({
  project,
  isLoading = false,
  onEdit,
  onDelete,
  onStatusChange,
  statusOptions = [],
  additionalSections,
  additionalActions,
  className = ''
}: ProjectDetailProps<T>) {
  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Handle status change
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onStatusChange) {
      onStatusChange(project.projectId, e.target.value);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <Card className={className}>
        <div className="flex items-center justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900 dark:border-white"></div>
          <span className="ml-2">Loading project details...</span>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      className={className}
      header={
        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {project.projectName}
          </h2>
          
          <div className="flex items-center space-x-2">
            {onStatusChange ? (
              <select
                value={project.status}
                onChange={handleStatusChange}
                aria-label="Change project status"
                className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                {statusOptions.map((option) => (
                  <option key={option.id} value={option.value}>
                    {option.value}
                  </option>
                ))}
              </select>
            ) : (
              <StatusBadge status={project.status} />
            )}
          </div>
        </div>
      }
      footer={
        <div className="flex justify-end space-x-2">
          {additionalActions}
          
          <ActionButton
            variant="primary"
            onClick={() => onEdit(project.projectId)}
          >
            Edit Project
          </ActionButton>
          
          <ActionButton
            variant="danger"
            onClick={() => onDelete(project.projectId)}
          >
            Delete Project
          </ActionButton>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Basic Information */}
        <div>
          <h3 className="mb-3 text-lg font-medium text-gray-900 dark:text-white">
            Basic Information
          </h3>
          
          <div className="grid gap-4 sm:grid-cols-2">
            {project.organisationName && (
              <InfoItem 
                label="Organisation" 
                value={project.organisationName} 
                direction="vertical"
                emphasized
              />
            )}
            
            <InfoItem 
              label="Start Date" 
              value={formatDate(project.startDate)} 
              direction="vertical"
            />
            
            <InfoItem 
              label="Due Date" 
              value={formatDate(project.dueDate)} 
              direction="vertical"
            />
            
            {project.assignedToName && (
              <InfoItem 
                label="Assigned To" 
                value={project.assignedToName} 
                direction="vertical"
              />
            )}
          </div>
        </div>
        
        {/* Additional Sections */}
        {additionalSections}
      </div>
    </Card>
  );
}