/**
 * ContentProjects Component
 * 
 * This component displays and manages content projects in the Jezweb Hub system.
 * It provides functionality for viewing, filtering, and managing content projects.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useContentProjects } from '../../hooks/projects/useContentProjects';
import { useOrganisations } from '../../hooks/organisations/useOrganisations';
import { Container } from '../../components/ui/design-system/Container';
import { PageHeading } from '../../components/ui/design-system/PageHeading';
import { ActionButton } from '../../components/ui/design-system/ActionButton';
import { InfoItem } from '../../components/ui/design-system/InfoItem';
import { ProjectCard } from '../../components/projects/ProjectCard';
import { ProjectTable } from '../../components/projects/ProjectTable';
import { ProjectFilters } from '../../components/projects/ProjectFilters';
import { ViewToggle } from '../../components/projects/ViewToggle';

// Status options for content projects
const STATUS_OPTIONS = [
  { id: 'planning', value: 'Planning' },
  { id: 'in-progress', value: 'In Progress' },
  { id: 'review', value: 'Review' },
  { id: 'approved', value: 'Approved' },
  { id: 'published', value: 'Published' },
  { id: 'on-hold', value: 'On Hold' },
  { id: 'cancelled', value: 'Cancelled' }
];

// Content type options
const CONTENT_TYPE_OPTIONS = [
  { id: 'blog', value: 'Blog' },
  { id: 'social-media', value: 'Social Media' },
  { id: 'email', value: 'Email' },
  { id: 'website', value: 'Website' },
  { id: 'video', value: 'Video' },
  { id: 'podcast', value: 'Podcast' },
  { id: 'ebook', value: 'E-Book' },
  { id: 'whitepaper', value: 'Whitepaper' },
  { id: 'case-study', value: 'Case Study' },
  { id: 'infographic', value: 'Infographic' },
  { id: 'other', value: 'Other' }
];

/**
 * ContentProjects component
 * 
 * @returns {JSX.Element} The rendered ContentProjects page
 */
const ContentProjects: React.FC = () => {
  const navigate = useNavigate();
  
  // Get content projects data and actions from the useContentProjects hook
  const {
    contentProjects,
    loading,
    error,
    fetchContentProjects,
    deleteContentProject,
    searchContentProjects
  } = useContentProjects();
  
  // Get organisations data for filtering
  const {
    organisations,
    loading: loadingOrganisations
  } = useOrganisations();
  
  // State for view mode (table or card)
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  
  // State for filters
  const [filters, setFilters] = useState({
    status: '',
    organisation: '',
    contentType: '',
    searchTerm: ''
  });
  
  // State for sorting
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Fetch content projects on component mount
  useEffect(() => {
    fetchContentProjects();
  }, [fetchContentProjects]);
  
  // Handle filter changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Apply filters
  const applyFilters = () => {
    const activeFilters: any = {};
    
    if (filters.status) {
      activeFilters.status = filters.status;
    }
    
    if (filters.organisation) {
      activeFilters.organisationId = filters.organisation;
    }
    
    if (filters.contentType) {
      activeFilters.contentType = filters.contentType;
    }
    
    if (filters.searchTerm) {
      searchContentProjects(filters.searchTerm);
    } else {
      fetchContentProjects(activeFilters, sortField, sortDirection);
    }
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilters({
      status: '',
      organisation: '',
      contentType: '',
      searchTerm: ''
    });
    
    fetchContentProjects({}, sortField, sortDirection);
  };
  
  // Handle sort change
  const handleSortChange = (field: string) => {
    if (field === sortField) {
      // Toggle direction if same field
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to descending
      setSortField(field);
      setSortDirection('desc');
    }
    
    // Apply sort
    fetchContentProjects(
      {
        status: filters.status,
        organisationId: filters.organisation,
        contentType: filters.contentType
      },
      field,
      field === sortField && sortDirection === 'asc' ? 'desc' : 'asc'
    );
  };
  
  // Handle view project action
  const handleViewProject = (projectId: string) => {
    navigate(`/projects/content/${projectId}`);
  };
  
  // Handle edit project action
  const handleEditProject = (projectId: string) => {
    navigate(`/projects/content/${projectId}/edit`);
  };
  
  // Handle delete project action
  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this content project?')) {
      try {
        await deleteContentProject(projectId);
        // Projects will be refreshed automatically by the deleteContentProject function
      } catch (error) {
        console.error('Error deleting content project:', error);
      }
    }
  };
  
  // Handle create project action
  const handleCreateProject = () => {
    navigate('/projects/content/create');
  };
  
  // Format organisations for the filter dropdown
  const organisationOptions = organisations.map(org => ({
    id: org.organisationId,
    value: org.organisationName
  }));
  
  // Show error state
  if (error && !contentProjects.length) {
    return (
      <Container>
        <Helmet>
          <title>Content Projects | Jezweb Hub</title>
        </Helmet>
        
        <PageHeading
          title="Content Projects"
          description="Manage content creation and marketing projects"
        />
        
        <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center dark:border-red-700 dark:bg-red-900/20">
          <h2 className="mb-2 text-xl font-bold text-red-800 dark:text-red-200">Error Loading Projects</h2>
          <p className="text-red-700 dark:text-red-300">
            {error.message}
          </p>
          <ActionButton
            variant="danger"
            onClick={() => fetchContentProjects()}
            className="mt-4"
          >
            Retry
          </ActionButton>
        </div>
      </Container>
    );
  }
  
  return (
    <Container>
      <Helmet>
        <title>Content Projects | Jezweb Hub</title>
      </Helmet>
      
      <PageHeading
        title="Content Projects"
        description="Manage content creation and marketing projects"
        actions={
          <ActionButton
            variant="primary"
            onClick={handleCreateProject}
            iconBefore={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            }
          >
            Create Project
          </ActionButton>
        }
      />
      
      {/* Filters */}
      <ProjectFilters
        searchTerm={filters.searchTerm}
        onSearchChange={handleFilterChange}
        status={filters.status}
        statusOptions={STATUS_OPTIONS}
        onStatusChange={handleFilterChange}
        organisation={filters.organisation}
        organisationOptions={organisationOptions}
        onOrganisationChange={handleFilterChange}
        onApplyFilters={applyFilters}
        onResetFilters={resetFilters}
        isLoading={loading || loadingOrganisations}
        className="mb-6"
        additionalFilters={
          <div>
            <label htmlFor="contentType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Content Type
            </label>
            <select
              id="contentType"
              name="contentType"
              value={filters.contentType}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
              disabled={loading}
            >
              <option value="">All Types</option>
              {CONTENT_TYPE_OPTIONS.map((option) => (
                <option key={option.id} value={option.value}>
                  {option.value}
                </option>
              ))}
            </select>
          </div>
        }
      />
      
      {/* View Toggle */}
      <ViewToggle
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        className="mb-4"
      />
      
      {/* Projects Display */}
      {contentProjects.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            ></path>
          </svg>
          <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
            No content projects found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {filters.status || filters.organisation || filters.contentType || filters.searchTerm
              ? 'No projects match your filters. Try adjusting your search criteria.'
              : 'Create your first content project to get started'}
          </p>
        </div>
      ) : viewMode === 'table' ? (
        <ProjectTable
          projects={contentProjects}
          isLoading={loading}
          onViewProject={handleViewProject}
          onEditProject={handleEditProject}
          onDeleteProject={handleDeleteProject}
          onSort={handleSortChange}
          sortField={sortField}
          sortDirection={sortDirection}
          additionalColumns={[
            {
              header: 'Content Type',
              accessor: 'contentType',
              cell: (project) => project.contentType || '—'
            },
            {
              header: 'Target Audience',
              accessor: 'contentStrategy.targetAudience',
              cell: (project) => project.contentStrategy?.targetAudience || '—'
            }
          ]}
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {contentProjects.map((project) => (
            <ProjectCard
              key={project.projectId}
              project={project}
              onViewProject={handleViewProject}
              onEditProject={handleEditProject}
              onDeleteProject={handleDeleteProject}
              additionalInfo={
                <>
                  <InfoItem 
                    label="Content Type" 
                    value={project.contentType} 
                    direction="horizontal"
                  />
                  {project.contentStrategy?.targetAudience && (
                    <InfoItem 
                      label="Target Audience" 
                      value={project.contentStrategy.targetAudience} 
                      direction="horizontal"
                    />
                  )}
                  {project.contentStrategy?.goals && project.contentStrategy.goals.length > 0 && (
                    <div className="mt-2">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Goals:
                      </span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {project.contentStrategy.goals.slice(0, 2).map((goal, index) => (
                          <span 
                            key={index} 
                            className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          >
                            {goal}
                          </span>
                        ))}
                        {project.contentStrategy.goals.length > 2 && (
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                            +{project.contentStrategy.goals.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </>
              }
            />
          ))}
        </div>
      )}
    </Container>
  );
};

export default ContentProjects;