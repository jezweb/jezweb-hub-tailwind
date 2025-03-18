/**
 * AppProjectView Component
 * 
 * This component displays detailed information about a specific app project.
 * It provides functionality for viewing, editing, and managing an app project.
 */

import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAppProjects } from '../../hooks/projects/useAppProjects';
import { Container } from '../../components/ui/design-system/Container';
import { PageHeading } from '../../components/ui/design-system/PageHeading';
import { ProjectDetail } from '../../components/projects/ProjectDetail';
import { Card } from '../../components/ui/design-system/Card';
import { InfoItem } from '../../components/ui/design-system/InfoItem';
import { ActionButton } from '../../components/ui/design-system/ActionButton';

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

/**
 * AppProjectView component
 * 
 * @returns {JSX.Element} The rendered AppProjectView page
 */
const AppProjectView: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  
  // Get app project data and actions from the useAppProjects hook
  const {
    selectedProject,
    loading,
    error,
    fetchAppProjectById,
    deleteAppProject,
    updateAppProject
  } = useAppProjects();
  
  // Fetch app project data on component mount
  useEffect(() => {
    if (projectId) {
      fetchAppProjectById(projectId);
    }
  }, [projectId, fetchAppProjectById]);
  
  // Handle edit project action
  const handleEditProject = (projectId: string) => {
    navigate(`/projects/app/${projectId}/edit`);
  };
  
  // Handle delete project action
  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this app project?')) {
      try {
        await deleteAppProject(projectId);
        navigate('/projects/app');
      } catch (error) {
        console.error('Error deleting app project:', error);
      }
    }
  };
  
  // Handle status change action
  const handleStatusChange = async (projectId: string, status: string) => {
    try {
      await updateAppProject(projectId, { status });
      // Refresh project data
      fetchAppProjectById(projectId);
    } catch (error) {
      console.error('Error updating app project status:', error);
    }
  };
  
  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
  
  // Show loading state
  if (loading && !selectedProject) {
    return (
      <Container>
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900 dark:border-white"></div>
          <span className="ml-2">Loading project details...</span>
        </div>
      </Container>
    );
  }
  
  // Show error state
  if (error || !selectedProject) {
    return (
      <Container>
        <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center dark:border-red-700 dark:bg-red-900/20">
          <h2 className="mb-2 text-xl font-bold text-red-800 dark:text-red-200">Error Loading Project</h2>
          <p className="text-red-700 dark:text-red-300">
            {error?.message || 'Project not found'}
          </p>
          <ActionButton
            variant="danger"
            onClick={() => navigate('/projects/app')}
            className="mt-4"
          >
            Back to App Projects
          </ActionButton>
        </div>
      </Container>
    );
  }
  
  return (
    <Container>
      <Helmet>
        <title>{selectedProject.projectName} | App Project | Jezweb Hub</title>
      </Helmet>
      
      <PageHeading
        title={selectedProject.projectName}
        description="App Project Details"
        backLink={{
          to: '/projects/app',
          label: 'Back to App Projects'
        }}
      />
      
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Project Details */}
        <div className="lg:col-span-2">
          <ProjectDetail
            project={selectedProject}
            isLoading={loading}
            onEdit={handleEditProject}
            onDelete={handleDeleteProject}
            onStatusChange={handleStatusChange}
            statusOptions={STATUS_OPTIONS}
            additionalSections={
              <>
                {/* Project Brief */}
                {selectedProject.projectBrief && (
                  <div>
                    <h3 className="mb-3 text-lg font-medium text-gray-900 dark:text-white">
                      Project Brief
                    </h3>
                    
                    <div className="rounded-md bg-gray-50 p-4 dark:bg-gray-700/50">
                      {selectedProject.projectBriefHTML ? (
                        <div 
                          dangerouslySetInnerHTML={{ __html: selectedProject.projectBriefHTML }} 
                          className="prose prose-sm max-w-none dark:prose-invert"
                        />
                      ) : (
                        <p className="text-gray-700 dark:text-gray-300">
                          {selectedProject.projectBrief}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                
                {/* App Details */}
                <div>
                  <h3 className="mb-3 text-lg font-medium text-gray-900 dark:text-white">
                    App Details
                  </h3>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <InfoItem 
                      label="App Type" 
                      value={selectedProject.appType} 
                      direction="vertical"
                      emphasized
                    />
                    
                    {selectedProject.budget !== undefined && (
                      <InfoItem 
                        label="Budget" 
                        value={`$${selectedProject.budget.toLocaleString()}`} 
                        direction="vertical"
                        emphasized
                      />
                    )}
                  </div>
                  
                  {/* Platforms */}
                  {selectedProject.platforms && selectedProject.platforms.length > 0 && (
                    <div className="mt-4">
                      <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Platforms
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.platforms.map((platform, index) => (
                          <span 
                            key={index} 
                            className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                          >
                            {platform}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* App Requirements */}
                {selectedProject.appRequirements && (
                  <div>
                    <h3 className="mb-3 text-lg font-medium text-gray-900 dark:text-white">
                      App Requirements
                    </h3>
                    
                    <div className="space-y-4">
                      {/* Features */}
                      {selectedProject.appRequirements.features && selectedProject.appRequirements.features.length > 0 && (
                        <div>
                          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Features
                          </h4>
                          <div className="space-y-2">
                            {selectedProject.appRequirements.features.map((feature, index) => (
                              <div key={index} className="rounded-md bg-gray-50 p-3 dark:bg-gray-700/50">
                                <p className="text-gray-700 dark:text-gray-300">
                                  {feature}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* User Roles */}
                      {selectedProject.appRequirements.userRoles && selectedProject.appRequirements.userRoles.length > 0 && (
                        <div>
                          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            User Roles
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedProject.appRequirements.userRoles.map((role, index) => (
                              <span 
                                key={index} 
                                className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300"
                              >
                                {role}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Integrations */}
                      {selectedProject.appRequirements.integrations && selectedProject.appRequirements.integrations.length > 0 && (
                        <div>
                          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Integrations
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedProject.appRequirements.integrations.map((integration, index) => (
                              <span 
                                key={index} 
                                className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                              >
                                {integration}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Security Requirements */}
                      {selectedProject.appRequirements.securityRequirements && selectedProject.appRequirements.securityRequirements.length > 0 && (
                        <div>
                          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Security Requirements
                          </h4>
                          <div className="space-y-2">
                            {selectedProject.appRequirements.securityRequirements.map((requirement, index) => (
                              <div key={index} className="rounded-md bg-gray-50 p-3 dark:bg-gray-700/50">
                                <p className="text-gray-700 dark:text-gray-300">
                                  {requirement}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Performance Requirements */}
                      {selectedProject.appRequirements.performanceRequirements && selectedProject.appRequirements.performanceRequirements.length > 0 && (
                        <div>
                          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Performance Requirements
                          </h4>
                          <div className="space-y-2">
                            {selectedProject.appRequirements.performanceRequirements.map((requirement, index) => (
                              <div key={index} className="rounded-md bg-gray-50 p-3 dark:bg-gray-700/50">
                                <p className="text-gray-700 dark:text-gray-300">
                                  {requirement}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Technical Specifications */}
                {selectedProject.technicalSpecifications && (
                  <div>
                    <h3 className="mb-3 text-lg font-medium text-gray-900 dark:text-white">
                      Technical Specifications
                    </h3>
                    
                    <div className="space-y-4">
                      {/* Frontend Technology */}
                      {selectedProject.technicalSpecifications.frontendTechnology && (
                        <InfoItem 
                          label="Frontend Technology" 
                          value={selectedProject.technicalSpecifications.frontendTechnology} 
                          direction="vertical"
                        />
                      )}
                      
                      {/* Backend Technology */}
                      {selectedProject.technicalSpecifications.backendTechnology && (
                        <InfoItem 
                          label="Backend Technology" 
                          value={selectedProject.technicalSpecifications.backendTechnology} 
                          direction="vertical"
                        />
                      )}
                      
                      {/* Database */}
                      {selectedProject.technicalSpecifications.database && (
                        <InfoItem 
                          label="Database" 
                          value={selectedProject.technicalSpecifications.database} 
                          direction="vertical"
                        />
                      )}
                      
                      {/* Authentication */}
                      {selectedProject.technicalSpecifications.authentication && (
                        <InfoItem 
                          label="Authentication" 
                          value={selectedProject.technicalSpecifications.authentication} 
                          direction="vertical"
                        />
                      )}
                      
                      {/* Hosting */}
                      {selectedProject.technicalSpecifications.hosting && (
                        <InfoItem 
                          label="Hosting" 
                          value={selectedProject.technicalSpecifications.hosting} 
                          direction="vertical"
                        />
                      )}
                      
                      {/* APIs */}
                      {selectedProject.technicalSpecifications.apis && selectedProject.technicalSpecifications.apis.length > 0 && (
                        <div>
                          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            APIs
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedProject.technicalSpecifications.apis.map((api, index) => (
                              <span 
                                key={index} 
                                className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                              >
                                {api}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Third-Party Services */}
                      {selectedProject.technicalSpecifications.thirdPartyServices && selectedProject.technicalSpecifications.thirdPartyServices.length > 0 && (
                        <div>
                          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Third-Party Services
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedProject.technicalSpecifications.thirdPartyServices.map((service, index) => (
                              <span 
                                key={index} 
                                className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300"
                              >
                                {service}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Budget Information */}
                {(selectedProject.budget !== undefined || selectedProject.costs !== undefined) && (
                  <div>
                    <h3 className="mb-3 text-lg font-medium text-gray-900 dark:text-white">
                      Budget Information
                    </h3>
                    
                    <div className="grid gap-4 sm:grid-cols-2">
                      {selectedProject.budget !== undefined && (
                        <InfoItem 
                          label="Budget" 
                          value={`$${selectedProject.budget.toLocaleString()}`} 
                          direction="vertical"
                          emphasized
                        />
                      )}
                      
                      {selectedProject.costs !== undefined && (
                        <InfoItem 
                          label="Costs" 
                          value={`$${selectedProject.costs.toLocaleString()}`} 
                          direction="vertical"
                        />
                      )}
                    </div>
                  </div>
                )}
              </>
            }
          />
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Design Specifications */}
          {selectedProject.designSpecifications && (
            <Card
              header={
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Design Specifications
                </h3>
              }
            >
              <div className="space-y-4">
                {/* Wireframes */}
                {selectedProject.designSpecifications.wireframes !== undefined && (
                  <div className="flex items-center">
                    <div className={`mr-2 h-4 w-4 rounded-full ${selectedProject.designSpecifications.wireframes ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      {selectedProject.designSpecifications.wireframes ? 'Wireframes Required' : 'No Wireframes Required'}
                    </span>
                  </div>
                )}
                
                {/* Mockups */}
                {selectedProject.designSpecifications.mockups !== undefined && (
                  <div className="flex items-center">
                    <div className={`mr-2 h-4 w-4 rounded-full ${selectedProject.designSpecifications.mockups ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      {selectedProject.designSpecifications.mockups ? 'Mockups Required' : 'No Mockups Required'}
                    </span>
                  </div>
                )}
                
                {/* Prototypes */}
                {selectedProject.designSpecifications.prototypes !== undefined && (
                  <div className="flex items-center">
                    <div className={`mr-2 h-4 w-4 rounded-full ${selectedProject.designSpecifications.prototypes ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      {selectedProject.designSpecifications.prototypes ? 'Prototypes Required' : 'No Prototypes Required'}
                    </span>
                  </div>
                )}
                
                {/* Design System */}
                {selectedProject.designSpecifications.designSystem !== undefined && (
                  <div className="flex items-center">
                    <div className={`mr-2 h-4 w-4 rounded-full ${selectedProject.designSpecifications.designSystem ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      {selectedProject.designSpecifications.designSystem ? 'Design System Required' : 'No Design System Required'}
                    </span>
                  </div>
                )}
                
                {/* Brand Guidelines */}
                {selectedProject.designSpecifications.brandGuidelines && (
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Brand Guidelines
                    </h4>
                    <div className="rounded-md bg-gray-50 p-3 text-sm text-gray-700 dark:bg-gray-700/50 dark:text-gray-300">
                      {selectedProject.designSpecifications.brandGuidelines}
                    </div>
                  </div>
                )}
                
                {selectedProject.designSpecifications.wireframes === undefined && 
                 selectedProject.designSpecifications.mockups === undefined && 
                 selectedProject.designSpecifications.prototypes === undefined && 
                 selectedProject.designSpecifications.designSystem === undefined && 
                 !selectedProject.designSpecifications.brandGuidelines && (
                  <p className="text-gray-500 dark:text-gray-400">
                    No design specifications available.
                  </p>
                )}
              </div>
            </Card>
          )}
          
          {/* Development */}
          {selectedProject.development && (
            <Card
              header={
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Development
                </h3>
              }
            >
              <div className="space-y-4">
                {/* Repository */}
                {selectedProject.development.repository && (
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Repository
                    </h4>
                    <a 
                      href={selectedProject.development.repository}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block rounded-md bg-gray-100 p-2 text-blue-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-blue-400 dark:hover:bg-gray-600"
                    >
                      View Repository
                    </a>
                  </div>
                )}
                
                {/* Deployment Strategy */}
                {selectedProject.development.deploymentStrategy && (
                  <InfoItem 
                    label="Deployment Strategy" 
                    value={selectedProject.development.deploymentStrategy} 
                    direction="vertical"
                  />
                )}
                
                {/* CI/CD Pipeline */}
                {selectedProject.development.cicdPipeline && (
                  <InfoItem 
                    label="CI/CD Pipeline" 
                    value={selectedProject.development.cicdPipeline} 
                    direction="vertical"
                  />
                )}
                
                {/* Testing Strategy */}
                {selectedProject.development.testingStrategy && (
                  <InfoItem 
                    label="Testing Strategy" 
                    value={selectedProject.development.testingStrategy} 
                    direction="vertical"
                  />
                )}
                
                {/* Environment Setup */}
                {selectedProject.development.environmentSetup && (
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Environment Setup
                    </h4>
                    <div className="space-y-2">
                      {selectedProject.development.environmentSetup.development !== undefined && (
                        <div className="flex items-center">
                          <div className={`mr-2 h-4 w-4 rounded-full ${selectedProject.development.environmentSetup.development ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                          <span className="text-gray-700 dark:text-gray-300">
                            Development Environment
                          </span>
                        </div>
                      )}
                      
                      {selectedProject.development.environmentSetup.staging !== undefined && (
                        <div className="flex items-center">
                          <div className={`mr-2 h-4 w-4 rounded-full ${selectedProject.development.environmentSetup.staging ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                          <span className="text-gray-700 dark:text-gray-300">
                            Staging Environment
                          </span>
                        </div>
                      )}
                      
                      {selectedProject.development.environmentSetup.production !== undefined && (
                        <div className="flex items-center">
                          <div className={`mr-2 h-4 w-4 rounded-full ${selectedProject.development.environmentSetup.production ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                          <span className="text-gray-700 dark:text-gray-300">
                            Production Environment
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {!selectedProject.development.repository && 
                 !selectedProject.development.deploymentStrategy && 
                 !selectedProject.development.cicdPipeline && 
                 !selectedProject.development.testingStrategy && 
                 (!selectedProject.development.environmentSetup || 
                  (selectedProject.development.environmentSetup.development === undefined && 
                   selectedProject.development.environmentSetup.staging === undefined && 
                   selectedProject.development.environmentSetup.production === undefined)) && (
                  <p className="text-gray-500 dark:text-gray-400">
                    No development information available.
                  </p>
                )}
              </div>
            </Card>
          )}
          
          {/* App Store */}
          {selectedProject.appStore && (
            <Card
              header={
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  App Store
                </h3>
              }
            >
              <div className="space-y-4">
                {/* App Store Submission */}
                {selectedProject.appStore.appStoreSubmission !== undefined && (
                  <div className="flex items-center">
                    <div className={`mr-2 h-4 w-4 rounded-full ${selectedProject.appStore.appStoreSubmission ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      {selectedProject.appStore.appStoreSubmission ? 'App Store Submission Required' : 'No App Store Submission Required'}
                    </span>
                  </div>
                )}
                
                {/* Play Store Submission */}
                {selectedProject.appStore.playStoreSubmission !== undefined && (
                  <div className="flex items-center">
                    <div className={`mr-2 h-4 w-4 rounded-full ${selectedProject.appStore.playStoreSubmission ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      {selectedProject.appStore.playStoreSubmission ? 'Play Store Submission Required' : 'No Play Store Submission Required'}
                    </span>
                  </div>
                )}
                
                {/* App Store ID */}
                {selectedProject.appStore.appStoreId && (
                  <InfoItem 
                    label="App Store ID" 
                    value={selectedProject.appStore.appStoreId} 
                    direction="vertical"
                  />
                )}
                
                {/* Play Store ID */}
                {selectedProject.appStore.playStoreId && (
                  <InfoItem 
                    label="Play Store ID" 
                    value={selectedProject.appStore.playStoreId} 
                    direction="vertical"
                  />
                )}
                
                {/* App Store URL */}
                {selectedProject.appStore.appStoreUrl && (
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      App Store URL
                    </h4>
                    <a 
                      href={selectedProject.appStore.appStoreUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block rounded-md bg-gray-100 p-2 text-blue-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-blue-400 dark:hover:bg-gray-600"
                    >
                      View on App Store
                    </a>
                  </div>
                )}
                
                {/* Play Store URL */}
                {selectedProject.appStore.playStoreUrl && (
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Play Store URL
                    </h4>
                    <a 
                      href={selectedProject.appStore.playStoreUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block rounded-md bg-gray-100 p-2 text-blue-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-blue-400 dark:hover:bg-gray-600"
                    >
                      View on Play Store
                    </a>
                  </div>
                )}
                
                {/* App Version */}
                {selectedProject.appStore.appVersion && (
                  <InfoItem 
                    label="App Version" 
                    value={selectedProject.appStore.appVersion} 
                    direction="vertical"
                  />
                )}
                
                {/* Release Notes */}
                {selectedProject.appStore.releaseNotes && (
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Release Notes
                    </h4>
                    <div className="rounded-md bg-gray-50 p-3 text-sm text-gray-700 dark:bg-gray-700/50 dark:text-gray-300">
                      {selectedProject.appStore.releaseNotes}
                    </div>
                  </div>
                )}
                
                {selectedProject.appStore.appStoreSubmission === undefined && 
                 selectedProject.appStore.playStoreSubmission === undefined && 
                 !selectedProject.appStore.appStoreId && 
                 !selectedProject.appStore.playStoreId && 
                 !selectedProject.appStore.appStoreUrl && 
                 !selectedProject.appStore.playStoreUrl && 
                 !selectedProject.appStore.appVersion && 
                 !selectedProject.appStore.releaseNotes && (
                  <p className="text-gray-500 dark:text-gray-400">
                    No app store information available.
                  </p>
                )}
              </div>
            </Card>
          )}
          
          {/* Tasks */}
          <Card
            header={
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Tasks
                </h3>
                <ActionButton
                  variant="light"
                  size="small"
                  onClick={() => navigate(`/projects/app/${projectId}/tasks`)}
                >
                  View All
                </ActionButton>
              </div>
            }
          >
            <div className="space-y-4">
              {selectedProject.tasks && selectedProject.tasks.length > 0 ? (
                <ul className="space-y-2">
                  {selectedProject.tasks.slice(0, 5).map((taskId, index) => (
                    <li key={index} className="flex items-center justify-between rounded-md bg-gray-50 p-2 dark:bg-gray-700/50">
                      <span className="text-gray-700 dark:text-gray-300">Task {index + 1}</span>
                      <ActionButton
                        variant="light"
                        size="small"
                        onClick={() => navigate(`/tasks/${taskId}`)}
                      >
                        View
                      </ActionButton>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  No tasks have been created yet.
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default AppProjectView;