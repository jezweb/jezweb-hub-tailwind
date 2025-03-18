/**
 * ContentProjectView Component
 * 
 * This component displays detailed information about a specific content project.
 * It provides functionality for viewing, editing, and managing a content project.
 */

import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useContentProjects } from '../../hooks/projects/useContentProjects';
import { Container } from '../../components/ui/design-system/Container';
import { PageHeading } from '../../components/ui/design-system/PageHeading';
import { ProjectDetail } from '../../components/projects/ProjectDetail';
import { Card } from '../../components/ui/design-system/Card';
import { InfoItem } from '../../components/ui/design-system/InfoItem';
import { ActionButton } from '../../components/ui/design-system/ActionButton';

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

// Define the calendar item interface
interface CalendarItem {
  title: string;
  date: string;
  status: 'draft' | 'scheduled' | 'published';
  topic: string;
  platform: string;
}

/**
 * ContentProjectView component
 * 
 * @returns {JSX.Element} The rendered ContentProjectView page
 */
const ContentProjectView: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  
  // Get content project data and actions from the useContentProjects hook
  const {
    selectedProject,
    loading,
    error,
    fetchContentProjectById,
    deleteContentProject,
    updateContentProject
  } = useContentProjects();
  
  // Fetch content project data on component mount
  useEffect(() => {
    if (projectId) {
      fetchContentProjectById(projectId);
    }
  }, [projectId, fetchContentProjectById]);
  
  // Handle edit project action
  const handleEditProject = (projectId: string) => {
    navigate(`/projects/content/${projectId}/edit`);
  };
  
  // Handle delete project action
  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this content project?')) {
      try {
        await deleteContentProject(projectId);
        navigate('/projects/content');
      } catch (error) {
        console.error('Error deleting content project:', error);
      }
    }
  };
  
  // Handle status change action
  const handleStatusChange = async (projectId: string, status: string) => {
    try {
      await updateContentProject(projectId, { status });
      // Refresh project data
      fetchContentProjectById(projectId);
    } catch (error) {
      console.error('Error updating content project status:', error);
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
            onClick={() => navigate('/projects/content')}
            className="mt-4"
          >
            Back to Content Projects
          </ActionButton>
        </div>
      </Container>
    );
  }
  
  // Sample calendar items for demonstration
  const calendarItems: CalendarItem[] = [
    {
      title: 'Blog Post: 10 SEO Tips',
      date: '2025-04-15',
      status: 'scheduled',
      topic: 'SEO',
      platform: 'Website Blog'
    },
    {
      title: 'Social Media Post: New Product Launch',
      date: '2025-04-10',
      status: 'draft',
      topic: 'Product Launch',
      platform: 'Instagram'
    },
    {
      title: 'Email Newsletter: April Edition',
      date: '2025-04-01',
      status: 'published',
      topic: 'Monthly Update',
      platform: 'Email'
    }
  ];
  
  return (
    <Container>
      <Helmet>
        <title>{selectedProject.projectName} | Content Project | Jezweb Hub</title>
      </Helmet>
      
      <PageHeading
        title={selectedProject.projectName}
        description="Content Project Details"
        backLink={{
          to: '/projects/content',
          label: 'Back to Content Projects'
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
                
                {/* Content Details */}
                <div>
                  <h3 className="mb-3 text-lg font-medium text-gray-900 dark:text-white">
                    Content Details
                  </h3>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <InfoItem 
                      label="Content Type" 
                      value={selectedProject.contentType} 
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
                
                {/* Content Strategy */}
                {selectedProject.contentStrategy && (
                  <div>
                    <h3 className="mb-3 text-lg font-medium text-gray-900 dark:text-white">
                      Content Strategy
                    </h3>
                    
                    <div className="space-y-4">
                      {/* Target Audience */}
                      {selectedProject.contentStrategy.targetAudience && (
                        <div>
                          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Target Audience
                          </h4>
                          <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-700/50">
                            <p className="text-gray-700 dark:text-gray-300">
                              {selectedProject.contentStrategy.targetAudience}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {/* Goals */}
                      {selectedProject.contentStrategy.goals && selectedProject.contentStrategy.goals.length > 0 && (
                        <div>
                          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Goals
                          </h4>
                          <div className="space-y-2">
                            {selectedProject.contentStrategy.goals.map((goal, index) => (
                              <div key={index} className="rounded-md bg-gray-50 p-3 dark:bg-gray-700/50">
                                <p className="text-gray-700 dark:text-gray-300">
                                  {goal}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Tone */}
                      {selectedProject.contentStrategy.tone && (
                        <div>
                          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Tone of Voice
                          </h4>
                          <InfoItem
                            label="Tone"
                            value={selectedProject.contentStrategy.tone}
                            direction="vertical"
                          />
                        </div>
                      )}
                      
                      {/* Style */}
                      {selectedProject.contentStrategy.style && (
                        <div>
                          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Style
                          </h4>
                          <InfoItem
                            label="Style"
                            value={selectedProject.contentStrategy.style}
                            direction="vertical"
                          />
                        </div>
                      )}
                      
                      {/* Key Messages */}
                      {selectedProject.contentStrategy.keyMessages && selectedProject.contentStrategy.keyMessages.length > 0 && (
                        <div>
                          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Key Messages
                          </h4>
                          <div className="space-y-2">
                            {selectedProject.contentStrategy.keyMessages.map((message, index) => (
                              <div key={index} className="rounded-md bg-gray-50 p-3 dark:bg-gray-700/50">
                                <p className="text-gray-700 dark:text-gray-300">
                                  {message}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Content Pillars */}
                      {selectedProject.contentStrategy.contentPillars && selectedProject.contentStrategy.contentPillars.length > 0 && (
                        <div>
                          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Content Pillars
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedProject.contentStrategy.contentPillars.map((pillar, index) => (
                              <span 
                                key={index} 
                                className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                              >
                                {pillar}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Content Calendar */}
                {selectedProject.contentCalendar && (
                  <div>
                    <h3 className="mb-3 text-lg font-medium text-gray-900 dark:text-white">
                      Content Calendar
                    </h3>
                    
                    <div className="space-y-4">
                      {/* Frequency */}
                      {selectedProject.contentCalendar.frequency && (
                        <InfoItem 
                          label="Publishing Frequency" 
                          value={selectedProject.contentCalendar.frequency} 
                          direction="vertical"
                        />
                      )}
                      
                      {/* Platforms */}
                      {selectedProject.contentCalendar.platforms && selectedProject.contentCalendar.platforms.length > 0 && (
                        <div>
                          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Platforms
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedProject.contentCalendar.platforms.map((platform, index) => (
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
                      
                      {/* Schedule */}
                      {selectedProject.contentCalendar.schedule && (
                        <div>
                          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Schedule Details
                          </h4>
                          <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-700/50">
                            <p className="text-gray-700 dark:text-gray-300">
                              {selectedProject.contentCalendar.schedule}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {/* Topics */}
                      {selectedProject.contentCalendar.topics && selectedProject.contentCalendar.topics.length > 0 && (
                        <div>
                          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Planned Topics
                          </h4>
                          <div className="space-y-2">
                            {selectedProject.contentCalendar.topics.map((topic, index) => (
                              <div key={index} className="rounded-md bg-gray-50 p-3 dark:bg-gray-700/50">
                                <p className="text-gray-700 dark:text-gray-300">
                                  {topic}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Calendar Items */}
                      <div>
                        <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Upcoming Content
                        </h4>
                        <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                              <tr>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                  Title
                                </th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                  Date
                                </th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                  Status
                                </th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                  Details
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                              {calendarItems.map((item, index) => (
                                <tr key={index}>
                                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 dark:text-white">
                                    {item.title}
                                  </td>
                                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                    {formatDate(item.date)}
                                  </td>
                                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                                      item.status === 'published' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                      item.status === 'scheduled' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                                      item.status === 'draft' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                                      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                    }`}>
                                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                    <div>{item.topic}</div>
                                    <div className="text-xs text-gray-400 dark:text-gray-500">
                                      Platform: {item.platform}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Content Creation */}
                {selectedProject.contentCreation && (
                  <div>
                    <h3 className="mb-3 text-lg font-medium text-gray-900 dark:text-white">
                      Content Creation
                    </h3>
                    
                    <div className="space-y-4">
                      {/* Writers */}
                      {selectedProject.contentCreation.writers && selectedProject.contentCreation.writers.length > 0 && (
                        <div>
                          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Writers
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedProject.contentCreation.writers.map((writer, index) => (
                              <span 
                                key={index} 
                                className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300"
                              >
                                {writer}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Editors */}
                      {selectedProject.contentCreation.editors && selectedProject.contentCreation.editors.length > 0 && (
                        <div>
                          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Editors
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedProject.contentCreation.editors.map((editor, index) => (
                              <span 
                                key={index} 
                                className="rounded-full bg-pink-100 px-3 py-1 text-xs font-medium text-pink-800 dark:bg-pink-900/30 dark:text-pink-300"
                              >
                                {editor}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Approvers */}
                      {selectedProject.contentCreation.approvers && selectedProject.contentCreation.approvers.length > 0 && (
                        <div>
                          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Approvers
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedProject.contentCreation.approvers.map((approver, index) => (
                              <span 
                                key={index} 
                                className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                              >
                                {approver}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Workflow */}
                      {selectedProject.contentCreation.workflow && (
                        <div>
                          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Workflow
                          </h4>
                          <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-700/50">
                            <p className="text-gray-700 dark:text-gray-300">
                              {selectedProject.contentCreation.workflow}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {/* Guidelines */}
                      {selectedProject.contentCreation.guidelines && (
                        <div>
                          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Guidelines
                          </h4>
                          <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-700/50">
                            <p className="text-gray-700 dark:text-gray-300">
                              {selectedProject.contentCreation.guidelines}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Content Distribution */}
                {selectedProject.contentDistribution && (
                  <div>
                    <h3 className="mb-3 text-lg font-medium text-gray-900 dark:text-white">
                      Content Distribution
                    </h3>
                    
                    <div className="space-y-4">
                      {/* Channels */}
                      {selectedProject.contentDistribution.channels && selectedProject.contentDistribution.channels.length > 0 && (
                        <div>
                          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Distribution Channels
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedProject.contentDistribution.channels.map((channel, index) => (
                              <span 
                                key={index} 
                                className="rounded-full bg-teal-100 px-3 py-1 text-xs font-medium text-teal-800 dark:bg-teal-900/30 dark:text-teal-300"
                              >
                                {channel}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Schedule */}
                      {selectedProject.contentDistribution.schedule && (
                        <div>
                          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Distribution Schedule
                          </h4>
                          <InfoItem
                            label="Schedule"
                            value={selectedProject.contentDistribution.schedule}
                            direction="vertical"
                          />
                        </div>
                      )}
                      
                      {/* Automation */}
                      {selectedProject.contentDistribution.automation !== undefined && (
                        <div className="flex items-center">
                          <div className={`mr-2 h-4 w-4 rounded-full ${selectedProject.contentDistribution.automation ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                          <span className="text-gray-700 dark:text-gray-300">
                            {selectedProject.contentDistribution.automation ? 'Distribution Automation Enabled' : 'No Distribution Automation'}
                          </span>
                        </div>
                      )}
                      
                      {/* Promotion Strategy */}
                      {selectedProject.contentDistribution.promotionStrategy && (
                        <div>
                          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Promotion Strategy
                          </h4>
                          <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-700/50">
                            <p className="text-gray-700 dark:text-gray-300">
                              {selectedProject.contentDistribution.promotionStrategy}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Content Performance */}
                {selectedProject.contentPerformance && (
                  <div>
                    <h3 className="mb-3 text-lg font-medium text-gray-900 dark:text-white">
                      Content Performance
                    </h3>
                    
                    <div className="space-y-4">
                      {/* Metrics */}
                      {selectedProject.contentPerformance.metrics && selectedProject.contentPerformance.metrics.length > 0 && (
                        <div>
                          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Key Metrics
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedProject.contentPerformance.metrics.map((metric, index) => (
                              <span 
                                key={index} 
                                className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-medium text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300"
                              >
                                {metric}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Tools */}
                      {selectedProject.contentPerformance.tools && selectedProject.contentPerformance.tools.length > 0 && (
                        <div>
                          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Analytics Tools
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedProject.contentPerformance.tools.map((tool, index) => (
                              <span 
                                key={index} 
                                className="rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-800 dark:bg-violet-900/30 dark:text-violet-300"
                              >
                                {tool}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Reporting Frequency */}
                      {selectedProject.contentPerformance.reportingFrequency && (
                        <InfoItem 
                          label="Reporting Frequency" 
                          value={selectedProject.contentPerformance.reportingFrequency} 
                          direction="vertical"
                        />
                      )}
                      
                      {/* Benchmarks */}
                      {selectedProject.contentPerformance.benchmarks && selectedProject.contentPerformance.benchmarks.length > 0 && (
                        <div>
                          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Performance Benchmarks
                          </h4>
                          <div className="space-y-2">
                            {selectedProject.contentPerformance.benchmarks.map((benchmark, index) => (
                              <div key={index} className="rounded-md bg-gray-50 p-3 dark:bg-gray-700/50">
                                <p className="text-gray-700 dark:text-gray-300">
                                  {benchmark}
                                </p>
                              </div>
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
                  onClick={() => navigate(`/projects/content/${projectId}/tasks`)}
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

export default ContentProjectView;