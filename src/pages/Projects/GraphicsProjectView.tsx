/**
 * GraphicsProjectView Component
 * 
 * This component displays detailed information about a specific graphics project.
 * It provides functionality for viewing, editing, and managing a graphics project.
 */

import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useGraphicsProjects } from '../../hooks/projects/useGraphicsProjects';
import { Container } from '../../components/ui/design-system/Container';
import { PageHeading } from '../../components/ui/design-system/PageHeading';
import { ProjectDetail } from '../../components/projects/ProjectDetail';
import { Card } from '../../components/ui/design-system/Card';
import { InfoItem } from '../../components/ui/design-system/InfoItem';
import { ActionButton } from '../../components/ui/design-system/ActionButton';

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

/**
 * GraphicsProjectView component
 * 
 * @returns {JSX.Element} The rendered GraphicsProjectView page
 */
const GraphicsProjectView: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  
  // Get graphics project data and actions from the useGraphicsProjects hook
  const {
    selectedProject,
    loading,
    error,
    fetchGraphicsProjectById,
    deleteGraphicsProject,
    updateGraphicsProject
  } = useGraphicsProjects();
  
  // Fetch graphics project data on component mount
  useEffect(() => {
    if (projectId) {
      fetchGraphicsProjectById(projectId);
    }
  }, [projectId, fetchGraphicsProjectById]);
  
  // Handle edit project action
  const handleEditProject = (projectId: string) => {
    navigate(`/projects/graphics/${projectId}/edit`);
  };
  
  // Handle delete project action
  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this graphics project?')) {
      try {
        await deleteGraphicsProject(projectId);
        navigate('/projects/graphics');
      } catch (error) {
        console.error('Error deleting graphics project:', error);
      }
    }
  };
  
  // Handle status change action
  const handleStatusChange = async (projectId: string, status: string) => {
    try {
      await updateGraphicsProject(projectId, { status });
      // Refresh project data
      fetchGraphicsProjectById(projectId);
    } catch (error) {
      console.error('Error updating graphics project status:', error);
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
            onClick={() => navigate('/projects/graphics')}
            className="mt-4"
          >
            Back to Graphics Projects
          </ActionButton>
        </div>
      </Container>
    );
  }
  
  return (
    <Container>
      <Helmet>
        <title>{selectedProject.projectName} | Graphics Project | Jezweb Hub</title>
      </Helmet>
      
      <PageHeading
        title={selectedProject.projectName}
        description="Graphics Project Details"
        backLink={{
          to: '/projects/graphics',
          label: 'Back to Graphics Projects'
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
                
                {/* Graphics Details */}
                <div>
                  <h3 className="mb-3 text-lg font-medium text-gray-900 dark:text-white">
                    Graphics Details
                  </h3>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <InfoItem 
                      label="Graphics Type" 
                      value={selectedProject.graphicsType} 
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
                </div>
                
                {/* Design Requirements */}
                {selectedProject.designRequirements && (
                  <div>
                    <h3 className="mb-3 text-lg font-medium text-gray-900 dark:text-white">
                      Design Requirements
                    </h3>
                    
                    <div className="space-y-4">
                      {/* Color Palette */}
                      {selectedProject.designRequirements.colorPalette && selectedProject.designRequirements.colorPalette.length > 0 && (
                        <div>
                          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Color Palette
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedProject.designRequirements.colorPalette.map((color, index) => (
                              <div key={index} className="flex items-center">
                                <div 
                                  className="mr-2 h-6 w-6 rounded-full border border-gray-300 dark:border-gray-600" 
                                  style={{ backgroundColor: color }}
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                  {color}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Typography */}
                      {selectedProject.designRequirements.typography && (
                        <div>
                          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Typography
                          </h4>
                          <div className="grid gap-2 sm:grid-cols-2">
                            {selectedProject.designRequirements.typography.primaryFont && (
                              <InfoItem 
                                label="Primary Font" 
                                value={selectedProject.designRequirements.typography.primaryFont} 
                                direction="vertical"
                              />
                            )}
                            
                            {selectedProject.designRequirements.typography.secondaryFont && (
                              <InfoItem 
                                label="Secondary Font" 
                                value={selectedProject.designRequirements.typography.secondaryFont} 
                                direction="vertical"
                              />
                            )}
                          </div>
                          
                          {selectedProject.designRequirements.typography.fontSizes && selectedProject.designRequirements.typography.fontSizes.length > 0 && (
                            <div className="mt-2">
                              <h5 className="mb-1 text-xs font-medium text-gray-700 dark:text-gray-300">
                                Font Sizes
                              </h5>
                              <div className="flex flex-wrap gap-1">
                                {selectedProject.designRequirements.typography.fontSizes.map((size, index) => (
                                  <span 
                                    key={index} 
                                    className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300"
                                  >
                                    {size}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Style Guide */}
                      {selectedProject.designRequirements.styleGuide !== undefined && (
                        <div className="flex items-center">
                          <div className={`mr-2 h-4 w-4 rounded-full ${selectedProject.designRequirements.styleGuide ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                          <span className="text-gray-700 dark:text-gray-300">
                            {selectedProject.designRequirements.styleGuide ? 'Style Guide Required' : 'No Style Guide Required'}
                          </span>
                        </div>
                      )}
                      
                      {/* Brand Guidelines */}
                      {selectedProject.designRequirements.brandGuidelines && (
                        <div>
                          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Brand Guidelines
                          </h4>
                          <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-700/50">
                            <p className="text-gray-700 dark:text-gray-300">
                              {selectedProject.designRequirements.brandGuidelines}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {/* Mood Board */}
                      {selectedProject.designRequirements.moodBoard !== undefined && (
                        <div className="flex items-center">
                          <div className={`mr-2 h-4 w-4 rounded-full ${selectedProject.designRequirements.moodBoard ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                          <span className="text-gray-700 dark:text-gray-300">
                            {selectedProject.designRequirements.moodBoard ? 'Mood Board Required' : 'No Mood Board Required'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Deliverables */}
                {selectedProject.deliverables && (
                  <div>
                    <h3 className="mb-3 text-lg font-medium text-gray-900 dark:text-white">
                      Deliverables
                    </h3>
                    
                    <div className="space-y-4">
                      {/* File Formats */}
                      {selectedProject.deliverables.fileFormats && selectedProject.deliverables.fileFormats.length > 0 && (
                        <div>
                          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            File Formats
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedProject.deliverables.fileFormats.map((format, index) => (
                              <span 
                                key={index} 
                                className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                              >
                                {format}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Dimensions */}
                      {selectedProject.deliverables.dimensions && selectedProject.deliverables.dimensions.length > 0 && (
                        <div>
                          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Dimensions
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedProject.deliverables.dimensions.map((dimension, index) => (
                              <span 
                                key={index} 
                                className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300"
                              >
                                {dimension}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Print Specifications */}
                      {selectedProject.deliverables.printSpecifications && (
                        <div>
                          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Print Specifications
                          </h4>
                          <div className="grid gap-2 sm:grid-cols-3">
                            {selectedProject.deliverables.printSpecifications.paperType && (
                              <InfoItem 
                                label="Paper Type" 
                                value={selectedProject.deliverables.printSpecifications.paperType} 
                                direction="vertical"
                              />
                            )}
                            
                            {selectedProject.deliverables.printSpecifications.finish && (
                              <InfoItem 
                                label="Finish" 
                                value={selectedProject.deliverables.printSpecifications.finish} 
                                direction="vertical"
                              />
                            )}
                            
                            {selectedProject.deliverables.printSpecifications.quantity !== undefined && (
                              <InfoItem 
                                label="Quantity" 
                                value={selectedProject.deliverables.printSpecifications.quantity.toString()} 
                                direction="vertical"
                              />
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Digital Specifications */}
                      {selectedProject.deliverables.digitalSpecifications && (
                        <div>
                          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Digital Specifications
                          </h4>
                          <div className="grid gap-2 sm:grid-cols-3">
                            {selectedProject.deliverables.digitalSpecifications.fileSize && (
                              <InfoItem 
                                label="File Size" 
                                value={selectedProject.deliverables.digitalSpecifications.fileSize} 
                                direction="vertical"
                              />
                            )}
                            
                            {selectedProject.deliverables.digitalSpecifications.resolution && (
                              <InfoItem 
                                label="Resolution" 
                                value={selectedProject.deliverables.digitalSpecifications.resolution} 
                                direction="vertical"
                              />
                            )}
                            
                            {selectedProject.deliverables.digitalSpecifications.colorMode && (
                              <InfoItem 
                                label="Color Mode" 
                                value={selectedProject.deliverables.digitalSpecifications.colorMode} 
                                direction="vertical"
                              />
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Revisions */}
                {selectedProject.revisions && (
                  <div>
                    <h3 className="mb-3 text-lg font-medium text-gray-900 dark:text-white">
                      Revisions
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        {selectedProject.revisions.allowedRevisions !== undefined && (
                          <InfoItem 
                            label="Allowed Revisions" 
                            value={selectedProject.revisions.allowedRevisions.toString()} 
                            direction="vertical"
                          />
                        )}
                        
                        {selectedProject.revisions.currentRevision !== undefined && (
                          <InfoItem 
                            label="Current Revision" 
                            value={selectedProject.revisions.currentRevision.toString()} 
                            direction="vertical"
                          />
                        )}
                      </div>
                      
                      {/* Revision History */}
                      {selectedProject.revisions.revisionHistory && Object.keys(selectedProject.revisions.revisionHistory).length > 0 && (
                        <div>
                          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Revision History
                          </h4>
                          <div className="space-y-2">
                            {Object.entries(selectedProject.revisions.revisionHistory).map(([revisionId, revision]) => (
                              <div key={revisionId} className="rounded-md border border-gray-200 p-3 dark:border-gray-700">
                                <div className="mb-1 flex items-center justify-between">
                                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    Revision {revisionId}
                                  </span>
                                  <div className="flex items-center">
                                    <span className="mr-2 text-xs text-gray-500 dark:text-gray-400">
                                      {formatDate(revision.date)}
                                    </span>
                                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                      revision.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                      revision.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                                      revision.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                                      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                    }`}>
                                      {revision.status.charAt(0).toUpperCase() + revision.status.slice(1)}
                                    </span>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                  {revision.comments}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Assets */}
                {selectedProject.assets && (
                  <div>
                    <h3 className="mb-3 text-lg font-medium text-gray-900 dark:text-white">
                      Assets
                    </h3>
                    
                    <div className="space-y-4">
                      {/* Logos */}
                      {selectedProject.assets.logos && selectedProject.assets.logos.length > 0 && (
                        <div>
                          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Logos
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedProject.assets.logos.map((logo, index) => (
                              <a 
                                key={index} 
                                href={logo} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center rounded-md bg-gray-50 px-3 py-2 text-sm text-blue-600 hover:bg-gray-100 dark:bg-gray-700/50 dark:text-blue-400 dark:hover:bg-gray-700"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                </svg>
                                Logo {index + 1}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Images */}
                      {selectedProject.assets.images && selectedProject.assets.images.length > 0 && (
                        <div>
                          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Images
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedProject.assets.images.map((image, index) => (
                              <a 
                                key={index} 
                                href={image} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center rounded-md bg-gray-50 px-3 py-2 text-sm text-blue-600 hover:bg-gray-100 dark:bg-gray-700/50 dark:text-blue-400 dark:hover:bg-gray-700"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                </svg>
                                Image {index + 1}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Illustrations */}
                      {selectedProject.assets.illustrations && selectedProject.assets.illustrations.length > 0 && (
                        <div>
                          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Illustrations
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedProject.assets.illustrations.map((illustration, index) => (
                              <a 
                                key={index} 
                                href={illustration} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center rounded-md bg-gray-50 px-3 py-2 text-sm text-blue-600 hover:bg-gray-100 dark:bg-gray-700/50 dark:text-blue-400 dark:hover:bg-gray-700"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                                Illustration {index + 1}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Mockups */}
                      {selectedProject.assets.mockups && selectedProject.assets.mockups.length > 0 && (
                        <div>
                          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Mockups
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedProject.assets.mockups.map((mockup, index) => (
                              <a 
                                key={index} 
                                href={mockup} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center rounded-md bg-gray-50 px-3 py-2 text-sm text-blue-600 hover:bg-gray-100 dark:bg-gray-700/50 dark:text-blue-400 dark:hover:bg-gray-700"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
                                </svg>
                                Mockup {index + 1}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Source Files */}
                      {selectedProject.assets.sourceFiles && selectedProject.assets.sourceFiles.length > 0 && (
                        <div>
                          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Source Files
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedProject.assets.sourceFiles.map((sourceFile, index) => (
                              <a 
                                key={index} 
                                href={sourceFile} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center rounded-md bg-gray-50 px-3 py-2 text-sm text-blue-600 hover:bg-gray-100 dark:bg-gray-700/50 dark:text-blue-400 dark:hover:bg-gray-700"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1H8a3 3 0 00-3 3v1.5a1.5 1.5 0 01-3 0V6z" clipRule="evenodd" />
                                  <path d="M6 12a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2H2h2a2 2 0 002-2v-2z" />
                                </svg>
                                Source File {index + 1}
                              </a>
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
          {/* Assignments */}
          <Card
            header={
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Assignments
              </h3>
            }
          >
            <div className="space-y-4">
              {selectedProject.assignments.projectOwner && (
                <InfoItem 
                  label="Project Owner" 
                  value={selectedProject.assignments.projectOwner} 
                  direction="vertical"
                />
              )}
              
              {selectedProject.assignments.leadOwner && (
                <InfoItem 
                  label="Lead Owner" 
                  value={selectedProject.assignments.leadOwner} 
                  direction="vertical"
                />
              )}
              
              {selectedProject.assignedTo && (
                <InfoItem 
                  label="Assigned To" 
                  value={selectedProject.assignedTo} 
                  direction="vertical"
                />
              )}
              
              {!selectedProject.assignments.projectOwner && 
               !selectedProject.assignments.leadOwner && 
               !selectedProject.assignedTo && (
                <p className="text-gray-500 dark:text-gray-400">
                  No assignments have been made yet.
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
                  onClick={() => navigate(`/projects/graphics/${projectId}/tasks`)}
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
          
          {/* Dates */}
          <Card
            header={
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Important Dates
              </h3>
            }
          >
            <div className="space-y-4">
              {selectedProject.startDate && (
                <InfoItem 
                  label="Start Date" 
                  value={formatDate(selectedProject.startDate)} 
                  direction="vertical"
                />
              )}
              
              {selectedProject.dueDate && (
                <InfoItem 
                  label="Due Date" 
                  value={formatDate(selectedProject.dueDate)} 
                  direction="vertical"
                  emphasized
                />
              )}
              
              <InfoItem 
                label="Created" 
                value={formatDate(selectedProject.createdAt.toDate().toISOString())} 
                direction="vertical"
              />
              
              <InfoItem 
                label="Last Updated" 
                value={formatDate(selectedProject.updatedAt.toDate().toISOString())} 
                direction="vertical"
              />
            </div>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default GraphicsProjectView;