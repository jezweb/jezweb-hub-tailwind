/**
 * WebsiteProjects Component
 * 
 * This component displays and manages website projects in the Jezweb Hub system.
 * It provides functionality for viewing, filtering, and managing website projects.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useWebsiteProjects } from '../../hooks/projects/useWebsiteProjects';
import { useOrganisations } from '../../hooks/organisations/useOrganisations';
import { Container } from '../../components/ui/design-system/Container';
import { PageHeading } from '../../components/ui/design-system/PageHeading';
import { ActionButton } from '../../components/ui/design-system/ActionButton';
import { ProjectCard } from '../../components/projects/ProjectCard';
import { ProjectTable } from '../../components/projects/ProjectTable';
import { ProjectFilters } from '../../components/projects/ProjectFilters';
import { ViewToggle } from '../../components/projects/ViewToggle';

// Status options for website projects
const STATUS_OPTIONS = [
  { id: 'planning', value: 'Planning' },
  { id: 'design', value: 'Design' },
  { id: 'development', value: 'Development' },
  { id: 'testing', value: 'Testing' },
  { id: 'review', value: 'Client Review' },
  { id: 'completed', value: 'Completed' },
  { id: 'on-hold', value: 'On Hold' },
  { id: 'cancelled', value: 'Cancelled' }
];

/**
 * WebsiteProjects component
 * 
 * @returns {JSX.Element} The rendered WebsiteProjects page
 */
const WebsiteProjects: React.FC = () => {
  const navigate = useNavigate();
  
  // Get website projects data and actions from the useWebsiteProjects hook
  const {
    websiteProjects,
    loading,
    error,
    fetchWebsiteProjects,
    deleteWebsiteProject,
    searchWebsiteProjects
  } = useWebsiteProjects();
  
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
    searchTerm: ''
  });
  
  // State for sorting
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Fetch website projects on component mount
  useEffect(() => {
    fetchWebsiteProjects();
  }, [fetchWebsiteProjects]);
  
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
    
    if (filters.searchTerm) {
      searchWebsiteProjects(filters.searchTerm);
    } else {
      fetchWebsiteProjects(activeFilters, sortField, sortDirection);
    }
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilters({
      status: '',
      organisation: '',
      searchTerm: ''
    });
    
    fetchWebsiteProjects({}, sortField, sortDirection);
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
    fetchWebsiteProjects(
      filters.status || filters.organisation ? { status: filters.status, organisationId: filters.organisation } : {},
      field,
      field === sortField && sortDirection === 'asc' ? 'desc' : 'asc'
    );
  };
  
  // Handle view project action
  const handleViewProject = (projectId: string) => {
    navigate(`/projects/website/${projectId}`);
  };
  
  // Handle edit project action
  const handleEditProject = (projectId: string) => {
    navigate(`/projects/website/${projectId}/edit`);
  };
  
  // Handle delete project action
  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this website project?')) {
      try {
        await deleteWebsiteProject(projectId);
        // Projects will be refreshed automatically by the deleteWebsiteProject function
      } catch (error) {
        console.error('Error deleting website project:', error);
      }
    }
  };
  
  // Handle create project action
  const handleCreateProject = () => {
    navigate('/projects/website/create');
  };
  
  // Format organisations for the filter dropdown
  const organisationOptions = organisations.map(org => ({
    id: org.organisationId,
    value: org.organisationName
  }));
  
  // Show error state
  if (error && !websiteProjects.length) {
    return (
      <Container>
        <Helmet>
          <title>Website Projects | Jezweb Hub</title>
        </Helmet>
        
        <PageHeading
          title="Website Projects"
          description="Manage website development and redesign projects"
        />
        
        <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center dark:border-red-700 dark:bg-red-900/20">
          <h2 className="mb-2 text-xl font-bold text-red-800 dark:text-red-200">Error Loading Projects</h2>
          <p className="text-red-700 dark:text-red-300">
            {error.message}
          </p>
          <ActionButton
            variant="danger"
            onClick={() => fetchWebsiteProjects()}
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
        <title>Website Projects | Jezweb Hub</title>
      </Helmet>
      
      <PageHeading
        title="Website Projects"
        description="Manage website development and redesign projects"
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
      />
      
      {/* View Toggle */}
      <ViewToggle
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        className="mb-4"
      />
      
      {/* Projects Display */}
      {websiteProjects.length === 0 ? (
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
            No website projects found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {filters.status || filters.organisation || filters.searchTerm
              ? 'No projects match your filters. Try adjusting your search criteria.'
              : 'Create your first website project to get started'}
          </p>
        </div>
      ) : viewMode === 'table' ? (
        <ProjectTable
          projects={websiteProjects}
          isLoading={loading}
          onViewProject={handleViewProject}
          onEditProject={handleEditProject}
          onDeleteProject={handleDeleteProject}
          onSort={handleSortChange}
          sortField={sortField}
          sortDirection={sortDirection}
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {websiteProjects.map((project) => (
            <ProjectCard
              key={project.projectId}
              project={project}
              onViewProject={handleViewProject}
              onEditProject={handleEditProject}
              onDeleteProject={handleDeleteProject}
            />
          ))}
        </div>
      )}
    </Container>
  );
};

export default WebsiteProjects;