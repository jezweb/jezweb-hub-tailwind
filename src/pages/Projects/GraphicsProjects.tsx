/**
 * GraphicsProjects Component
 * 
 * This component displays and manages graphics projects in the Jezweb Hub system.
 * It provides functionality for viewing, filtering, and managing graphics projects.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useGraphicsProjects } from '../../hooks/projects/useGraphicsProjects';
import { useOrganisations } from '../../hooks/organisations/useOrganisations';
import { Container } from '../../components/ui/design-system/Container';
import { PageHeading } from '../../components/ui/design-system/PageHeading';
import { ActionButton } from '../../components/ui/design-system/ActionButton';
import { InfoItem } from '../../components/ui/design-system/InfoItem';
import { ProjectCard } from '../../components/projects/ProjectCard';
import { ProjectTable } from '../../components/projects/ProjectTable';
import { ProjectFilters } from '../../components/projects/ProjectFilters';
import { ViewToggle } from '../../components/projects/ViewToggle';

// Status options for graphics projects
const STATUS_OPTIONS = [
  { id: 'planning', value: 'Planning' },
  { id: 'in-progress', value: 'In Progress' },
  { id: 'review', value: 'Review' },
  { id: 'approved', value: 'Approved' },
  { id: 'completed', value: 'Completed' },
  { id: 'on-hold', value: 'On Hold' },
  { id: 'cancelled', value: 'Cancelled' }
];

// Graphics type options
const GRAPHICS_TYPE_OPTIONS = [
  { id: 'logo', value: 'Logo Design' },
  { id: 'branding', value: 'Branding' },
  { id: 'print', value: 'Print Design' },
  { id: 'digital', value: 'Digital Graphics' },
  { id: 'illustration', value: 'Illustration' },
  { id: 'packaging', value: 'Packaging' },
  { id: 'signage', value: 'Signage' },
  { id: 'social-media', value: 'Social Media Graphics' },
  { id: 'web', value: 'Web Graphics' },
  { id: 'other', value: 'Other' }
];

/**
 * GraphicsProjects component
 * 
 * @returns {JSX.Element} The rendered GraphicsProjects page
 */
const GraphicsProjects: React.FC = () => {
  const navigate = useNavigate();
  
  // Get graphics projects data and actions from the useGraphicsProjects hook
  const {
    graphicsProjects,
    loading,
    error,
    fetchGraphicsProjects,
    deleteGraphicsProject,
    searchGraphicsProjects
  } = useGraphicsProjects();
  
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
    graphicsType: '',
    searchTerm: ''
  });
  
  // State for sorting
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Fetch graphics projects on component mount
  useEffect(() => {
    fetchGraphicsProjects();
  }, [fetchGraphicsProjects]);
  
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
    
    if (filters.graphicsType) {
      activeFilters.graphicsType = filters.graphicsType;
    }
    
    if (filters.searchTerm) {
      searchGraphicsProjects(filters.searchTerm);
    } else {
      fetchGraphicsProjects(activeFilters, sortField, sortDirection);
    }
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilters({
      status: '',
      organisation: '',
      graphicsType: '',
      searchTerm: ''
    });
    
    fetchGraphicsProjects({}, sortField, sortDirection);
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
    fetchGraphicsProjects(
      {
        status: filters.status,
        organisationId: filters.organisation,
        graphicsType: filters.graphicsType
      },
      field,
      field === sortField && sortDirection === 'asc' ? 'desc' : 'asc'
    );
  };
  
  // Handle view project action
  const handleViewProject = (projectId: string) => {
    navigate(`/projects/graphics/${projectId}`);
  };
  
  // Handle edit project action
  const handleEditProject = (projectId: string) => {
    navigate(`/projects/graphics/${projectId}/edit`);
  };
  
  // Handle delete project action
  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this graphics project?')) {
      try {
        await deleteGraphicsProject(projectId);
        // Projects will be refreshed automatically by the deleteGraphicsProject function
      } catch (error) {
        console.error('Error deleting graphics project:', error);
      }
    }
  };
  
  // Handle create project action
  const handleCreateProject = () => {
    navigate('/projects/graphics/create');
  };
  
  // Format organisations for the filter dropdown
  const organisationOptions = organisations.map(org => ({
    id: org.organisationId,
    value: org.organisationName
  }));
  
  // Show error state
  if (error && !graphicsProjects.length) {
    return (
      <Container>
        <Helmet>
          <title>Graphics Projects | Jezweb Hub</title>
        </Helmet>
        
        <PageHeading
          title="Graphics Projects"
          description="Manage design and visual assets projects"
        />
        
        <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center dark:border-red-700 dark:bg-red-900/20">
          <h2 className="mb-2 text-xl font-bold text-red-800 dark:text-red-200">Error Loading Projects</h2>
          <p className="text-red-700 dark:text-red-300">
            {error.message}
          </p>
          <ActionButton
            variant="danger"
            onClick={() => fetchGraphicsProjects()}
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
        <title>Graphics Projects | Jezweb Hub</title>
      </Helmet>
      
      <PageHeading
        title="Graphics Projects"
        description="Manage design and visual assets projects"
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
            <label htmlFor="graphicsType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Graphics Type
            </label>
            <select
              id="graphicsType"
              name="graphicsType"
              value={filters.graphicsType}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
              disabled={loading}
            >
              <option value="">All Types</option>
              {GRAPHICS_TYPE_OPTIONS.map((option) => (
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
      {graphicsProjects.length === 0 ? (
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
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            ></path>
          </svg>
          <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
            No graphics projects found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {filters.status || filters.organisation || filters.graphicsType || filters.searchTerm
              ? 'No projects match your filters. Try adjusting your search criteria.'
              : 'Create your first graphics project to get started'}
          </p>
        </div>
      ) : viewMode === 'table' ? (
        <ProjectTable
          projects={graphicsProjects}
          isLoading={loading}
          onViewProject={handleViewProject}
          onEditProject={handleEditProject}
          onDeleteProject={handleDeleteProject}
          onSort={handleSortChange}
          sortField={sortField}
          sortDirection={sortDirection}
          additionalColumns={[
            {
              header: 'Graphics Type',
              accessor: 'graphicsType',
              cell: (project) => project.graphicsType || '—'
            },
            {
              header: 'Deliverables',
              accessor: 'deliverables',
              cell: (project) => {
                if (!project.deliverables) {
                  return '—';
                }
                
                // Collect all deliverable types into a single array
                const allDeliverables: string[] = [
                  ...(project.deliverables.fileFormats || []),
                  ...(project.deliverables.dimensions || [])
                ];
                
                // Add print specifications if available
                if (project.deliverables.printSpecifications) {
                  if (project.deliverables.printSpecifications.paperType) {
                    allDeliverables.push(project.deliverables.printSpecifications.paperType);
                  }
                  if (project.deliverables.printSpecifications.finish) {
                    allDeliverables.push(project.deliverables.printSpecifications.finish);
                  }
                }
                
                // Add digital specifications if available
                if (project.deliverables.digitalSpecifications) {
                  if (project.deliverables.digitalSpecifications.resolution) {
                    allDeliverables.push(project.deliverables.digitalSpecifications.resolution);
                  }
                  if (project.deliverables.digitalSpecifications.colorMode) {
                    allDeliverables.push(project.deliverables.digitalSpecifications.colorMode);
                  }
                }
                
                if (allDeliverables.length === 0) {
                  return '—';
                }
                
                return (
                  <div className="flex flex-wrap gap-1">
                    {allDeliverables.slice(0, 2).map((deliverable, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                      >
                        {deliverable}
                      </span>
                    ))}
                    {allDeliverables.length > 2 && (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        +{allDeliverables.length - 2} more
                      </span>
                    )}
                  </div>
                );
              }
            }
          ]}
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {graphicsProjects.map((project) => (
            <ProjectCard
              key={project.projectId}
              project={project}
              onViewProject={handleViewProject}
              onEditProject={handleEditProject}
              onDeleteProject={handleDeleteProject}
              additionalInfo={
                <>
                  <InfoItem 
                    label="Graphics Type" 
                    value={project.graphicsType} 
                    direction="horizontal"
                  />
                  {project.deliverables && (
                    <div className="mt-2">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Deliverables:
                      </span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {/* File Formats */}
                        {project.deliverables.fileFormats && project.deliverables.fileFormats.slice(0, 2).map((format, index) => (
                          <span
                            key={`format-${index}`}
                            className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                          >
                            {format}
                          </span>
                        ))}
                        
                        {/* Dimensions */}
                        {project.deliverables.dimensions && project.deliverables.dimensions.slice(0,
                          project.deliverables.fileFormats ?
                            Math.max(0, 2 - project.deliverables.fileFormats.length) : 2
                        ).map((dimension, index) => (
                          <span
                            key={`dimension-${index}`}
                            className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          >
                            {dimension}
                          </span>
                        ))}
                        
                        {/* Show more indicator if needed */}
                        {((project.deliverables.fileFormats?.length || 0) +
                          (project.deliverables.dimensions?.length || 0) > 2) && (
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                            +more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  {project.designRequirements && project.designRequirements.colorPalette && project.designRequirements.colorPalette.length > 0 && (
                    <div className="mt-2 flex items-center">
                      <span className="mr-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                        Brand Colors:
                      </span>
                      <div className="flex space-x-1">
                        {project.designRequirements.colorPalette.slice(0, 3).map((color, index) => (
                          <div
                            key={index}
                            className="h-4 w-4 rounded-full border border-gray-300 dark:border-gray-600"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
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

export default GraphicsProjects;