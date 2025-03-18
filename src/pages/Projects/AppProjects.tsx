/**
 * AppProjects Component
 * 
 * This component displays and manages app projects in the Jezweb Hub system.
 * It provides functionality for viewing, filtering, and managing app projects.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAppProjects } from '../../hooks/projects/useAppProjects';
import { useOrganisations } from '../../hooks/organisations/useOrganisations';
import { Container } from '../../components/ui/design-system/Container';
import { PageHeading } from '../../components/ui/design-system/PageHeading';
import { ActionButton } from '../../components/ui/design-system/ActionButton';
import { InfoItem } from '../../components/ui/design-system/InfoItem';
import { ProjectCard } from '../../components/projects/ProjectCard';
import { ProjectTable } from '../../components/projects/ProjectTable';
import { ProjectFilters } from '../../components/projects/ProjectFilters';
import { ViewToggle } from '../../components/projects/ViewToggle';

// Status options for app projects
const STATUS_OPTIONS = [
  { id: 'planning', value: 'Planning' },
  { id: 'design', value: 'Design' },
  { id: 'development', value: 'Development' },
  { id: 'testing', value: 'Testing' },
  { id: 'deployment', value: 'Deployment' },
  { id: 'live', value: 'Live' },
  { id: 'maintenance', value: 'Maintenance' },
  { id: 'on-hold', value: 'On Hold' },
  { id: 'cancelled', value: 'Cancelled' }
];

// App type options
const APP_TYPE_OPTIONS = [
  { id: 'mobile', value: 'Mobile' },
  { id: 'web', value: 'Web' },
  { id: 'desktop', value: 'Desktop' },
  { id: 'hybrid', value: 'Hybrid' },
  { id: 'pwa', value: 'PWA' },
  { id: 'other', value: 'Other' }
];

// Platform options
const PLATFORM_OPTIONS = [
  { id: 'ios', value: 'iOS' },
  { id: 'android', value: 'Android' },
  { id: 'web', value: 'Web' },
  { id: 'windows', value: 'Windows' },
  { id: 'macos', value: 'macOS' },
  { id: 'linux', value: 'Linux' }
];

/**
 * AppProjects component
 * 
 * @returns {JSX.Element} The rendered AppProjects page
 */
const AppProjects: React.FC = () => {
  const navigate = useNavigate();
  
  // Get app projects data and actions from the useAppProjects hook
  const {
    appProjects,
    loading,
    error,
    fetchAppProjects,
    deleteAppProject,
    searchAppProjects
  } = useAppProjects();
  
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
    appType: '',
    platform: '',
    searchTerm: ''
  });
  
  // State for sorting
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Fetch app projects on component mount
  useEffect(() => {
    fetchAppProjects();
  }, [fetchAppProjects]);
  
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
    
    if (filters.appType) {
      activeFilters.appType = filters.appType;
    }
    
    if (filters.platform) {
      activeFilters.platform = filters.platform;
    }
    
    if (filters.searchTerm) {
      searchAppProjects(filters.searchTerm);
    } else {
      fetchAppProjects(activeFilters, sortField, sortDirection);
    }
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilters({
      status: '',
      organisation: '',
      appType: '',
      platform: '',
      searchTerm: ''
    });
    
    fetchAppProjects({}, sortField, sortDirection);
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
    fetchAppProjects(
      {
        status: filters.status,
        organisationId: filters.organisation,
        appType: filters.appType,
        platform: filters.platform
      },
      field,
      field === sortField && sortDirection === 'asc' ? 'desc' : 'asc'
    );
  };
  
  // Handle view project action
  const handleViewProject = (projectId: string) => {
    navigate(`/projects/app/${projectId}`);
  };
  
  // Handle edit project action
  const handleEditProject = (projectId: string) => {
    navigate(`/projects/app/${projectId}/edit`);
  };
  
  // Handle delete project action
  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this app project?')) {
      try {
        await deleteAppProject(projectId);
        // Projects will be refreshed automatically by the deleteAppProject function
      } catch (error) {
        console.error('Error deleting app project:', error);
      }
    }
  };
  
  // Handle create project action
  const handleCreateProject = () => {
    navigate('/projects/app/create');
  };
  
  // Format organisations for the filter dropdown
  const organisationOptions = organisations.map(org => ({
    id: org.organisationId,
    value: org.organisationName
  }));
  
  // Show error state
  if (error && !appProjects.length) {
    return (
      <Container>
        <Helmet>
          <title>App Projects | Jezweb Hub</title>
        </Helmet>
        
        <PageHeading
          title="App Projects"
          description="Manage mobile, web, and desktop application projects"
        />
        
        <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center dark:border-red-700 dark:bg-red-900/20">
          <h2 className="mb-2 text-xl font-bold text-red-800 dark:text-red-200">Error Loading Projects</h2>
          <p className="text-red-700 dark:text-red-300">
            {error.message}
          </p>
          <ActionButton
            variant="danger"
            onClick={() => fetchAppProjects()}
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
        <title>App Projects | Jezweb Hub</title>
      </Helmet>
      
      <PageHeading
        title="App Projects"
        description="Manage mobile, web, and desktop application projects"
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
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="appType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                App Type
              </label>
              <select
                id="appType"
                name="appType"
                value={filters.appType}
                onChange={handleFilterChange}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                disabled={loading}
              >
                <option value="">All Types</option>
                {APP_TYPE_OPTIONS.map((option) => (
                  <option key={option.id} value={option.value}>
                    {option.value}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="platform" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Platform
              </label>
              <select
                id="platform"
                name="platform"
                value={filters.platform}
                onChange={handleFilterChange}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                disabled={loading}
              >
                <option value="">All Platforms</option>
                {PLATFORM_OPTIONS.map((option) => (
                  <option key={option.id} value={option.value}>
                    {option.value}
                  </option>
                ))}
              </select>
            </div>
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
      {appProjects.length === 0 ? (
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
            No app projects found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {filters.status || filters.organisation || filters.appType || filters.platform || filters.searchTerm
              ? 'No projects match your filters. Try adjusting your search criteria.'
              : 'Create your first app project to get started'}
          </p>
        </div>
      ) : viewMode === 'table' ? (
        <ProjectTable
          projects={appProjects}
          isLoading={loading}
          onViewProject={handleViewProject}
          onEditProject={handleEditProject}
          onDeleteProject={handleDeleteProject}
          onSort={handleSortChange}
          sortField={sortField}
          sortDirection={sortDirection}
          additionalColumns={[
            {
              header: 'App Type',
              accessor: 'appType',
              cell: (project) => project.appType || '—'
            },
            {
              header: 'Platforms',
              accessor: 'platforms',
              cell: (project) => {
                const platforms = project.platforms || [];
                return platforms.length > 0 ? platforms.join(', ') : '—';
              }
            }
          ]}
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {appProjects.map((project) => (
            <ProjectCard
              key={project.projectId}
              project={project}
              onViewProject={handleViewProject}
              onEditProject={handleEditProject}
              onDeleteProject={handleDeleteProject}
              additionalInfo={
                <>
                  <InfoItem 
                    label="App Type" 
                    value={project.appType} 
                    direction="horizontal"
                  />
                  <InfoItem 
                    label="Platforms" 
                    value={project.platforms?.join(', ') || '—'} 
                    direction="horizontal"
                  />
                </>
              }
            />
          ))}
        </div>
      )}
    </Container>
  );
};

export default AppProjects;