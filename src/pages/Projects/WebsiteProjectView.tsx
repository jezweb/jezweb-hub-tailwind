/**
 * WebsiteProjectView Component
 * 
 * This component displays detailed information about a specific website project.
 * It provides functionality for viewing, editing, and managing a website project.
 */

import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useWebsiteProjects } from '../../hooks/projects/useWebsiteProjects';
import { Container } from '../../components/ui/design-system/Container';
import { PageHeading } from '../../components/ui/design-system/PageHeading';
import { ProjectDetail } from '../../components/projects/ProjectDetail';
import { Card } from '../../components/ui/design-system/Card';
import { InfoItem } from '../../components/ui/design-system/InfoItem';
import { ActionButton } from '../../components/ui/design-system/ActionButton';

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
 * WebsiteProjectView component
 * 
 * @returns {JSX.Element} The rendered WebsiteProjectView page
 */
const WebsiteProjectView: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  
  // Get website project data and actions from the useWebsiteProjects hook
  const {
    selectedProject,
    loading,
    error,
    fetchWebsiteProjectById,
    deleteWebsiteProject,
    updateWebsiteProject
  } = useWebsiteProjects();
  
  // Fetch website project data on component mount
  useEffect(() => {
    if (projectId) {
      fetchWebsiteProjectById(projectId);
    }
  }, [projectId, fetchWebsiteProjectById]);
  
  // Handle edit project action
  const handleEditProject = (projectId: string) => {
    navigate(`/projects/website/${projectId}/edit`);
  };
  
  // Handle delete project action
  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this website project?')) {
      try {
        await deleteWebsiteProject(projectId);
        navigate('/projects/website');
      } catch (error) {
        console.error('Error deleting website project:', error);
      }
    }
  };
  
  // Handle status change action
  const handleStatusChange = async (projectId: string, status: string) => {
    try {
      await updateWebsiteProject(projectId, { status });
      // Refresh project data
      fetchWebsiteProjectById(projectId);
    } catch (error) {
      console.error('Error updating website project status:', error);
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
            onClick={() => navigate('/projects/website')}
            className="mt-4"
          >
            Back to Website Projects
          </ActionButton>
        </div>
      </Container>
    );
  }
  
  return (
    <Container>
      <Helmet>
        <title>{selectedProject.projectName} | Website Project | Jezweb Hub</title>
      </Helmet>
      
      <PageHeading
        title={selectedProject.projectName}
        description="Website Project Details"
        backLink={{
          to: '/projects/website',
          label: 'Back to Website Projects'
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
          {/* Credentials */}
          <Card
            header={
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Credentials
              </h3>
            }
          >
            <div className="space-y-4">
              {selectedProject.credentials?.stagingLogins && (
                <InfoItem 
                  label="Staging Logins" 
                  value={selectedProject.credentials.stagingLogins} 
                  direction="vertical"
                />
              )}
              
              {selectedProject.credentials?.clientLogins && (
                <InfoItem 
                  label="Client Logins" 
                  value={selectedProject.credentials.clientLogins} 
                  direction="vertical"
                />
              )}
              
              {(!selectedProject.credentials?.stagingLogins && !selectedProject.credentials?.clientLogins) && (
                <p className="text-gray-500 dark:text-gray-400">
                  No credentials have been added yet.
                </p>
              )}
            </div>
          </Card>
          
          {/* Files */}
          <Card
            header={
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Files
              </h3>
            }
          >
            <div className="space-y-4">
              {selectedProject.credentials?.clientFiles && selectedProject.credentials.clientFiles.length > 0 ? (
                <div>
                  <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Client Files
                  </h4>
                  <ul className="space-y-2">
                    {selectedProject.credentials.clientFiles.map((file, index) => (
                      <li key={index} className="text-blue-600 dark:text-blue-400">
                        <a href={file} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {file.split('/').pop()}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              
              {selectedProject.credentials?.customerDbFiles && selectedProject.credentials.customerDbFiles.length > 0 ? (
                <div>
                  <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Customer Database Files
                  </h4>
                  <ul className="space-y-2">
                    {selectedProject.credentials.customerDbFiles.map((file, index) => (
                      <li key={index} className="text-blue-600 dark:text-blue-400">
                        <a href={file} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {file.split('/').pop()}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              
              {(!selectedProject.credentials?.clientFiles || selectedProject.credentials.clientFiles.length === 0) && 
               (!selectedProject.credentials?.customerDbFiles || selectedProject.credentials.customerDbFiles.length === 0) && (
                <p className="text-gray-500 dark:text-gray-400">
                  No files have been uploaded yet.
                </p>
              )}
            </div>
          </Card>
          
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
                  onClick={() => navigate(`/projects/website/${projectId}/tasks`)}
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

export default WebsiteProjectView;