/**
 * SEOProjectView Component
 * 
 * This component displays detailed information about a specific SEO project.
 * It provides functionality for viewing, editing, and managing an SEO project.
 */

import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useSeoProjects } from '../../hooks/projects/useSeoProjects';
import { Container } from '../../components/ui/design-system/Container';
import { PageHeading } from '../../components/ui/design-system/PageHeading';
import { ProjectDetail } from '../../components/projects/ProjectDetail';
import { Card } from '../../components/ui/design-system/Card';
import { InfoItem } from '../../components/ui/design-system/InfoItem';
import { ActionButton } from '../../components/ui/design-system/ActionButton';

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

/**
 * SEOProjectView component
 * 
 * @returns {JSX.Element} The rendered SEOProjectView page
 */
const SEOProjectView: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  
  // Get SEO project data and actions from the useSeoProjects hook
  const {
    selectedProject,
    loading,
    error,
    fetchSeoProjectById,
    deleteSeoProject,
    updateSeoProject
  } = useSeoProjects();
  
  // Fetch SEO project data on component mount
  useEffect(() => {
    if (projectId) {
      fetchSeoProjectById(projectId);
    }
  }, [projectId, fetchSeoProjectById]);
  
  // Handle edit project action
  const handleEditProject = (projectId: string) => {
    navigate(`/projects/seo/${projectId}/edit`);
  };
  
  // Handle delete project action
  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this SEO project?')) {
      try {
        await deleteSeoProject(projectId);
        navigate('/projects/seo');
      } catch (error) {
        console.error('Error deleting SEO project:', error);
      }
    }
  };
  
  // Handle status change action
  const handleStatusChange = async (projectId: string, status: string) => {
    try {
      await updateSeoProject(projectId, { status });
      // Refresh project data
      fetchSeoProjectById(projectId);
    } catch (error) {
      console.error('Error updating SEO project status:', error);
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
            onClick={() => navigate('/projects/seo')}
            className="mt-4"
          >
            Back to SEO Projects
          </ActionButton>
        </div>
      </Container>
    );
  }
  
  return (
    <Container>
      <Helmet>
        <title>{selectedProject.projectName} | SEO Project | Jezweb Hub</title>
      </Helmet>
      
      <PageHeading
        title={selectedProject.projectName}
        description="SEO Project Details"
        backLink={{
          to: '/projects/seo',
          label: 'Back to SEO Projects'
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
                
                {/* SEO Details */}
                <div>
                  <h3 className="mb-3 text-lg font-medium text-gray-900 dark:text-white">
                    SEO Details
                  </h3>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <InfoItem 
                      label="SEO Type" 
                      value={selectedProject.seoType} 
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
                  
                  {/* Target Keywords */}
                  {selectedProject.targetKeywords && selectedProject.targetKeywords.length > 0 && (
                    <div className="mt-4">
                      <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Target Keywords
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.targetKeywords.map((keyword, index) => (
                          <span 
                            key={index} 
                            className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Competitor Analysis */}
                {selectedProject.competitorAnalysis && (
                  <div>
                    <h3 className="mb-3 text-lg font-medium text-gray-900 dark:text-white">
                      Competitor Analysis
                    </h3>
                    
                    <div className="space-y-4">
                      {/* Competitors */}
                      {selectedProject.competitorAnalysis.competitors && selectedProject.competitorAnalysis.competitors.length > 0 && (
                        <div>
                          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Competitors
                          </h4>
                          <div className="space-y-2">
                            {selectedProject.competitorAnalysis.competitors.map((competitor, index) => (
                              <div key={index} className="rounded-md bg-gray-50 p-3 dark:bg-gray-700/50">
                                <p className="text-gray-700 dark:text-gray-300">
                                  {competitor}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Competitor Keywords */}
                      {selectedProject.competitorAnalysis.competitorKeywords && selectedProject.competitorAnalysis.competitorKeywords.length > 0 && (
                        <div>
                          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Competitor Keywords
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedProject.competitorAnalysis.competitorKeywords.map((keyword, index) => (
                              <span 
                                key={index} 
                                className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Competitor Backlinks */}
                      {selectedProject.competitorAnalysis.competitorBacklinks && selectedProject.competitorAnalysis.competitorBacklinks.length > 0 && (
                        <div>
                          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Competitor Backlinks
                          </h4>
                          <div className="space-y-2">
                            {selectedProject.competitorAnalysis.competitorBacklinks.map((backlink, index) => (
                              <div key={index} className="rounded-md bg-gray-50 p-3 dark:bg-gray-700/50">
                                <a 
                                  href={backlink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline dark:text-blue-400"
                                >
                                  {backlink}
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* SEO Audit */}
                {selectedProject.seoAudit && (
                  <div>
                    <h3 className="mb-3 text-lg font-medium text-gray-900 dark:text-white">
                      SEO Audit
                    </h3>
                    
                    <div className="space-y-4">
                      {/* Technical Issues */}
                      {selectedProject.seoAudit.technicalIssues && selectedProject.seoAudit.technicalIssues.length > 0 && (
                        <div>
                          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Technical Issues
                          </h4>
                          <div className="space-y-2">
                            {selectedProject.seoAudit.technicalIssues.map((issue, index) => (
                              <div key={index} className="rounded-md bg-gray-50 p-3 dark:bg-gray-700/50">
                                <p className="text-gray-700 dark:text-gray-300">
                                  {issue}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Content Issues */}
                      {selectedProject.seoAudit.contentIssues && selectedProject.seoAudit.contentIssues.length > 0 && (
                        <div>
                          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Content Issues
                          </h4>
                          <div className="space-y-2">
                            {selectedProject.seoAudit.contentIssues.map((issue, index) => (
                              <div key={index} className="rounded-md bg-gray-50 p-3 dark:bg-gray-700/50">
                                <p className="text-gray-700 dark:text-gray-300">
                                  {issue}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* On-Page Issues */}
                      {selectedProject.seoAudit.onPageIssues && selectedProject.seoAudit.onPageIssues.length > 0 && (
                        <div>
                          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            On-Page Issues
                          </h4>
                          <div className="space-y-2">
                            {selectedProject.seoAudit.onPageIssues.map((issue, index) => (
                              <div key={index} className="rounded-md bg-gray-50 p-3 dark:bg-gray-700/50">
                                <p className="text-gray-700 dark:text-gray-300">
                                  {issue}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Off-Page Issues */}
                      {selectedProject.seoAudit.offPageIssues && selectedProject.seoAudit.offPageIssues.length > 0 && (
                        <div>
                          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Off-Page Issues
                          </h4>
                          <div className="space-y-2">
                            {selectedProject.seoAudit.offPageIssues.map((issue, index) => (
                              <div key={index} className="rounded-md bg-gray-50 p-3 dark:bg-gray-700/50">
                                <p className="text-gray-700 dark:text-gray-300">
                                  {issue}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Performance Issues */}
                      {selectedProject.seoAudit.performanceIssues && selectedProject.seoAudit.performanceIssues.length > 0 && (
                        <div>
                          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Performance Issues
                          </h4>
                          <div className="space-y-2">
                            {selectedProject.seoAudit.performanceIssues.map((issue, index) => (
                              <div key={index} className="rounded-md bg-gray-50 p-3 dark:bg-gray-700/50">
                                <p className="text-gray-700 dark:text-gray-300">
                                  {issue}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* SEO Strategy */}
                {selectedProject.seoStrategy && (
                  <div>
                    <h3 className="mb-3 text-lg font-medium text-gray-900 dark:text-white">
                      SEO Strategy
                    </h3>
                    
                    <div className="space-y-4">
                      {/* Keyword Strategy */}
                      {selectedProject.seoStrategy.keywordStrategy && (
                        <div>
                          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Keyword Strategy
                          </h4>
                          <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-700/50">
                            <p className="text-gray-700 dark:text-gray-300">
                              {selectedProject.seoStrategy.keywordStrategy}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {/* Content Strategy */}
                      {selectedProject.seoStrategy.contentStrategy && (
                        <div>
                          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Content Strategy
                          </h4>
                          <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-700/50">
                            <p className="text-gray-700 dark:text-gray-300">
                              {selectedProject.seoStrategy.contentStrategy}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {/* Link Building Strategy */}
                      {selectedProject.seoStrategy.linkBuildingStrategy && (
                        <div>
                          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Link Building Strategy
                          </h4>
                          <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-700/50">
                            <p className="text-gray-700 dark:text-gray-300">
                              {selectedProject.seoStrategy.linkBuildingStrategy}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {/* Local SEO Strategy */}
                      {selectedProject.seoStrategy.localSeoStrategy && (
                        <div>
                          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Local SEO Strategy
                          </h4>
                          <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-700/50">
                            <p className="text-gray-700 dark:text-gray-300">
                              {selectedProject.seoStrategy.localSeoStrategy}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {/* Technical SEO Strategy */}
                      {selectedProject.seoStrategy.technicalSeoStrategy && (
                        <div>
                          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Technical SEO Strategy
                          </h4>
                          <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-700/50">
                            <p className="text-gray-700 dark:text-gray-300">
                              {selectedProject.seoStrategy.technicalSeoStrategy}
                            </p>
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
          {/* Reporting */}
          {selectedProject.reporting && (
            <Card
              header={
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Reporting
                </h3>
              }
            >
              <div className="space-y-4">
                {/* Reporting Frequency */}
                {selectedProject.reporting.reportingFrequency && (
                  <InfoItem 
                    label="Reporting Frequency" 
                    value={selectedProject.reporting.reportingFrequency} 
                    direction="vertical"
                  />
                )}
                
                {/* Key Metrics */}
                {selectedProject.reporting.keyMetrics && selectedProject.reporting.keyMetrics.length > 0 && (
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Key Metrics
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.reporting.keyMetrics.map((metric, index) => (
                        <span 
                          key={index} 
                          className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300"
                        >
                          {metric}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Custom Dashboard */}
                {selectedProject.reporting.customDashboard !== undefined && (
                  <div className="flex items-center">
                    <div className={`mr-2 h-4 w-4 rounded-full ${selectedProject.reporting.customDashboard ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      {selectedProject.reporting.customDashboard ? 'Custom Dashboard Available' : 'No Custom Dashboard'}
                    </span>
                  </div>
                )}
                
                {/* Client Access */}
                {selectedProject.reporting.clientAccess !== undefined && (
                  <div className="flex items-center">
                    <div className={`mr-2 h-4 w-4 rounded-full ${selectedProject.reporting.clientAccess ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      {selectedProject.reporting.clientAccess ? 'Client Has Access' : 'No Client Access'}
                    </span>
                  </div>
                )}
                
                {!selectedProject.reporting.reportingFrequency && 
                 (!selectedProject.reporting.keyMetrics || selectedProject.reporting.keyMetrics.length === 0) && 
                 selectedProject.reporting.customDashboard === undefined && 
                 selectedProject.reporting.clientAccess === undefined && (
                  <p className="text-gray-500 dark:text-gray-400">
                    No reporting information available.
                  </p>
                )}
              </div>
            </Card>
          )}
          
          {/* Analytics */}
          {selectedProject.analytics && (
            <Card
              header={
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Analytics
                </h3>
              }
            >
              <div className="space-y-4">
                {/* Analytics Setup */}
                {selectedProject.analytics.analyticsSetup !== undefined && (
                  <div className="flex items-center">
                    <div className={`mr-2 h-4 w-4 rounded-full ${selectedProject.analytics.analyticsSetup ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      {selectedProject.analytics.analyticsSetup ? 'Analytics Setup Complete' : 'Analytics Setup Pending'}
                    </span>
                  </div>
                )}
                
                {/* Search Console Setup */}
                {selectedProject.analytics.searchConsoleSetup !== undefined && (
                  <div className="flex items-center">
                    <div className={`mr-2 h-4 w-4 rounded-full ${selectedProject.analytics.searchConsoleSetup ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      {selectedProject.analytics.searchConsoleSetup ? 'Search Console Setup Complete' : 'Search Console Setup Pending'}
                    </span>
                  </div>
                )}
                
                {/* Conversion Tracking */}
                {selectedProject.analytics.conversionTracking !== undefined && (
                  <div className="flex items-center">
                    <div className={`mr-2 h-4 w-4 rounded-full ${selectedProject.analytics.conversionTracking ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      {selectedProject.analytics.conversionTracking ? 'Conversion Tracking Enabled' : 'No Conversion Tracking'}
                    </span>
                  </div>
                )}
                
                {/* Goal Tracking */}
                {selectedProject.analytics.goalTracking !== undefined && (
                  <div className="flex items-center">
                    <div className={`mr-2 h-4 w-4 rounded-full ${selectedProject.analytics.goalTracking ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      {selectedProject.analytics.goalTracking ? 'Goal Tracking Enabled' : 'No Goal Tracking'}
                    </span>
                  </div>
                )}
                
                {/* Custom Reports */}
                {selectedProject.analytics.customReports !== undefined && (
                  <div className="flex items-center">
                    <div className={`mr-2 h-4 w-4 rounded-full ${selectedProject.analytics.customReports ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      {selectedProject.analytics.customReports ? 'Custom Reports Available' : 'No Custom Reports'}
                    </span>
                  </div>
                )}
                
                {selectedProject.analytics.analyticsSetup === undefined && 
                 selectedProject.analytics.searchConsoleSetup === undefined && 
                 selectedProject.analytics.conversionTracking === undefined && 
                 selectedProject.analytics.goalTracking === undefined && 
                 selectedProject.analytics.customReports === undefined && (
                  <p className="text-gray-500 dark:text-gray-400">
                    No analytics information available.
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
                  onClick={() => navigate(`/projects/seo/${projectId}/tasks`)}
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

export default SEOProjectView;