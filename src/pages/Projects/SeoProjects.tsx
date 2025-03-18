/**
 * SeoProjects Component
 * 
 * This component displays and manages SEO projects in the Jezweb Hub system.
 * It provides functionality for viewing, filtering, and managing SEO projects.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useSeoProjects } from '../../hooks/projects/useSeoProjects';
import { useOrganisations } from '../../hooks/organisations/useOrganisations';
import { Container } from '../../components/ui/design-system/Container';
import { PageHeading } from '../../components/ui/design-system/PageHeading';
import { ActionButton } from '../../components/ui/design-system/ActionButton';
import { InfoItem } from '../../components/ui/design-system/InfoItem';
import { ProjectCard } from '../../components/projects/ProjectCard';
import { ProjectTable } from '../../components/projects/ProjectTable';
import { ProjectFilters } from '../../components/projects/ProjectFilters';
import { ViewToggle } from '../../components/projects/ViewToggle';

// Status options for SEO projects
const STATUS_OPTIONS = [
  { id: 'planning', value: 'Planning' },
  { id: 'research', value: 'Research' },
  { id: 'implementation', value: 'Implementation' },
  { id: 'monitoring', value: 'Monitoring' },
  { id: 'reporting', value: 'Reporting' },
  { id: 'completed', value: 'Completed' },
  { id: 'on-hold', value: 'On Hold' },
  { id: 'cancelled', value: 'Cancelled' }
];

// SEO type options
const SEO_TYPE_OPTIONS = [
  { id: 'local', value: 'Local' },
  { id: 'national', value: 'National' },
  { id: 'international', value: 'International' },
  { id: 'ecommerce', value: 'E-commerce' },
  { id: 'technical', value: 'Technical' },
  { id: 'content', value: 'Content' },
  { id: 'other', value: 'Other' }
];

/**
 * SeoProjects component
 * 
 * @returns {JSX.Element} The rendered SeoProjects page
 */
const SeoProjects: React.FC = () => {
  const navigate = useNavigate();
  
  // Get SEO projects data and actions from the useSeoProjects hook
  const {
    seoProjects,
    loading,
    error,
    fetchSeoProjects,
    deleteSeoProject,
    searchSeoProjects
  } = useSeoProjects();
  
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
    seoType: '',
    searchTerm: ''
  });
  
  // State for sorting
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Fetch SEO projects on component mount
  useEffect(() => {
    fetchSeoProjects();
  }, [fetchSeoProjects]);
  
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
    
    if (filters.seoType) {
      activeFilters.seoType = filters.seoType;
    }
    
    if (filters.searchTerm) {
      searchSeoProjects(filters.searchTerm);
    } else {
      fetchSeoProjects(activeFilters, sortField, sortDirection);
    }
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilters({
      status: '',
      organisation: '',
      seoType: '',
      searchTerm: ''
    });
    
    fetchSeoProjects({}, sortField, sortDirection);
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
    fetchSeoProjects(
      {
        status: filters.status,
        organisationId: filters.organisation,
        seoType: filters.seoType
      },
      field,
      field === sortField && sortDirection === 'asc' ? 'desc' : 'asc'
    );
  };
  
  // Handle view project action
  const handleViewProject = (projectId: string) => {
    navigate(`/projects/seo/${projectId}`);
  };
  
  // Handle edit project action
  const handleEditProject = (projectId: string) => {
    navigate(`/projects/seo/${projectId}/edit`);
  };
  
  // Handle delete project action
  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this SEO project?')) {
      try {
        await deleteSeoProject(projectId);
        // Projects will be refreshed automatically by the deleteSeoProject function
      } catch (error) {
        console.error('Error deleting SEO project:', error);
      }
    }
  };
  
  // Handle create project action
  const handleCreateProject = () => {
    navigate('/projects/seo/create');
  };
  
  // Format organisations for the filter dropdown
  const organisationOptions = organisations.map(org => ({
    id: org.organisationId,
    value: org.organisationName
  }));
  
  // Show error state
  if (error && !seoProjects.length) {
    return (
      <Container>
        <Helmet>
          <title>SEO Projects | Jezweb Hub</title>
        </Helmet>
        
        <PageHeading
          title="SEO Projects"
          description="Manage search engine optimisation projects"
        />
        
        <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center dark:border-red-700 dark:bg-red-900/20">
          <h2 className="mb-2 text-xl font-bold text-red-800 dark:text-red-200">Error Loading Projects</h2>
          <p className="text-red-700 dark:text-red-300">
            {error.message}
          </p>
          <ActionButton
            variant="danger"
            onClick={() => fetchSeoProjects()}
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
        <title>SEO Projects | Jezweb Hub</title>
      </Helmet>
      
      <PageHeading
        title="SEO Projects"
        description="Manage search engine optimisation projects"
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
            <label htmlFor="seoType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              SEO Type
            </label>
            <select
              id="seoType"
              name="seoType"
              value={filters.seoType}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
              disabled={loading}
            >
              <option value="">All Types</option>
              {SEO_TYPE_OPTIONS.map((option) => (
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
      {seoProjects.length === 0 ? (
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
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            ></path>
          </svg>
          <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
            No SEO projects found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {filters.status || filters.organisation || filters.seoType || filters.searchTerm
              ? 'No projects match your filters. Try adjusting your search criteria.'
              : 'Create your first SEO project to get started'}
          </p>
        </div>
      ) : viewMode === 'table' ? (
        <ProjectTable
          projects={seoProjects}
          isLoading={loading}
          onViewProject={handleViewProject}
          onEditProject={handleEditProject}
          onDeleteProject={handleDeleteProject}
          onSort={handleSortChange}
          sortField={sortField}
          sortDirection={sortDirection}
          additionalColumns={[
            {
              header: 'SEO Type',
              accessor: 'seoType',
              cell: (project) => project.seoType || '—'
            },
            {
              header: 'Target Keywords',
              accessor: 'targetKeywords',
              cell: (project) => {
                const keywords = project.targetKeywords || [];
                return keywords.length > 0 
                  ? keywords.length > 3 
                    ? `${keywords.slice(0, 3).join(', ')}... (${keywords.length - 3} more)` 
                    : keywords.join(', ') 
                  : '—';
              }
            }
          ]}
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {seoProjects.map((project) => (
            <ProjectCard
              key={project.projectId}
              project={project}
              onViewProject={handleViewProject}
              onEditProject={handleEditProject}
              onDeleteProject={handleDeleteProject}
              additionalInfo={
                <>
                  <InfoItem 
                    label="SEO Type" 
                    value={project.seoType} 
                    direction="horizontal"
                  />
                  {project.targetKeywords && project.targetKeywords.length > 0 && (
                    <div className="mt-2">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Keywords:
                      </span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {project.targetKeywords.slice(0, 3).map((keyword, index) => (
                          <span 
                            key={index} 
                            className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                          >
                            {keyword}
                          </span>
                        ))}
                        {project.targetKeywords.length > 3 && (
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                            +{project.targetKeywords.length - 3} more
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

export default SeoProjects;