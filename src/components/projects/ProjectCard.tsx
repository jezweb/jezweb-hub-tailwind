/**
 * ProjectCard Component
 * 
 * A reusable card component for displaying project information in a grid layout.
 * This component is used across different project types (Website, Graphics, App, SEO, Content)
 * to provide a consistent card-based view.
 */

import React from 'react';
import { Card } from '../ui/design-system/Card';
import { StatusBadge } from '../ui/design-system/StatusBadge';
import { InfoItem } from '../ui/design-system/InfoItem';
import { ActionButton } from '../ui/design-system/ActionButton';

// Define the base project interface that all project types will share
export interface BaseProject {
  projectId: string;
  projectName: string;
  status: string;
  organisationId?: string;
  organisationName?: string;
  startDate?: string;
  dueDate?: string;
  assignedTo?: string;
  assignedToName?: string;
}

interface ProjectCardProps<T extends BaseProject> {
  /** The project data to display */
  project: T;
  
  /** Function to handle viewing the project details */
  onViewProject: (projectId: string) => void;
  
  /** Function to handle editing the project */
  onEditProject: (projectId: string) => void;
  
  /** Function to handle deleting the project */
  onDeleteProject: (projectId: string) => void;
  
  /** Optional additional information to display */
  additionalInfo?: React.ReactNode;
  
  /** Optional additional CSS classes */
  className?: string;
}

/**
 * ProjectCard component
 * 
 * @example
 * <ProjectCard
 *   project={project}
 *   onViewProject={handleViewProject}
 *   onEditProject={handleEditProject}
 *   onDeleteProject={handleDeleteProject}
 * />
 */
export function ProjectCard<T extends BaseProject>({
  project,
  onViewProject,
  onEditProject,
  onDeleteProject,
  additionalInfo,
  className = ''
}: ProjectCardProps<T>) {
  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Card 
      hoverable 
      className={`h-full ${className}`}
      header={
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate" title={project.projectName}>
            {project.projectName}
          </h3>
          <StatusBadge status={project.status} />
        </div>
      }
      footer={
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
      }
    >
      <div className="space-y-4">
        <div className="space-y-2">
          {project.organisationName && (
            <InfoItem 
              label="Organisation" 
              value={project.organisationName} 
              direction="horizontal"
            />
          )}
          
          <InfoItem 
            label="Start Date" 
            value={formatDate(project.startDate)} 
            direction="horizontal"
          />
          
          <InfoItem 
            label="Due Date" 
            value={formatDate(project.dueDate)} 
            direction="horizontal"
          />
          
          {project.assignedToName && (
            <InfoItem 
              label="Assigned To" 
              value={project.assignedToName} 
              direction="horizontal"
            />
          )}
          
          {/* Render additional information if provided */}
          {additionalInfo}
        </div>
      </div>
    </Card>
  );
}