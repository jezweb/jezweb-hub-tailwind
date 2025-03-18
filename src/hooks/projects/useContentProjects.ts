/**
 * useContentProjects Hook
 * 
 * This hook provides functionality for fetching, creating, updating, and deleting content projects.
 * It encapsulates all the data fetching logic and state management for content projects.
 */

import { useState, useCallback, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';

// Define the ContentProject interface based on the schema
export interface ContentProject {
  projectId: string;
  organisationId: string;
  projectName: string;
  projectBrief: string;
  projectBriefHTML: string;
  status: string;
  startDate?: string;
  dueDate?: string;
  assignedTo?: string;
  budget?: number;
  costs?: number;
  contentType: string; // Blog, Social Media, Email, etc.
  contentStrategy?: {
    targetAudience?: string;
    goals?: string[];
    tone?: string;
    style?: string;
    keyMessages?: string[];
    contentPillars?: string[];
  };
  contentCalendar?: {
    frequency?: string;
    platforms?: string[];
    schedule?: string;
    topics?: string[];
  };
  contentCreation?: {
    writers?: string[];
    editors?: string[];
    approvers?: string[];
    workflow?: string;
    guidelines?: string;
  };
  contentDistribution?: {
    channels?: string[];
    schedule?: string;
    automation?: boolean;
    promotionStrategy?: string;
  };
  contentPerformance?: {
    metrics?: string[];
    tools?: string[];
    reportingFrequency?: string;
    benchmarks?: string[];
  };
  assignments: {
    projectOwner?: string;
    leadOwner?: string;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
  tasks: string[];
}

interface Filters {
  status?: string;
  organisationId?: string;
  assignedTo?: string;
  contentType?: string;
}

export const useContentProjects = () => {
  const [contentProjects, setContentProjects] = useState<ContentProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<ContentProject | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch all content projects with optional filtering and sorting
   */
  const fetchContentProjects = useCallback(async (
    filters: Filters = {},
    sortField: string = 'createdAt',
    sortDirection: 'asc' | 'desc' = 'desc'
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      // Start with a base query
      let projectsQuery = collection(db, 'contentProjects');
      
      // Apply filters if provided
      const constraints = [];
      
      if (filters.status) {
        constraints.push(where('status', '==', filters.status));
      }
      
      if (filters.organisationId) {
        constraints.push(where('organisationId', '==', filters.organisationId));
      }
      
      if (filters.assignedTo) {
        constraints.push(where('assignedTo', '==', filters.assignedTo));
      }
      
      if (filters.contentType) {
        constraints.push(where('contentType', '==', filters.contentType));
      }
      
      // Apply sorting
      constraints.push(orderBy(sortField, sortDirection));
      
      // Create the query with all constraints
      const q = query(projectsQuery, ...constraints);
      
      // Execute the query
      const querySnapshot = await getDocs(q);
      
      // Process the results
      const projects: ContentProject[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Omit<ContentProject, 'projectId'>;
        projects.push({
          projectId: doc.id,
          ...data
        });
      });
      
      setContentProjects(projects);
    } catch (err) {
      console.error('Error fetching content projects:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch content projects'));
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch a single content project by ID
   */
  const fetchContentProjectById = useCallback(async (projectId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const projectRef = doc(db, 'contentProjects', projectId);
      const projectSnapshot = await getDoc(projectRef);
      
      if (projectSnapshot.exists()) {
        const data = projectSnapshot.data() as Omit<ContentProject, 'projectId'>;
        const project: ContentProject = {
          projectId: projectSnapshot.id,
          ...data
        };
        
        setSelectedProject(project);
        return project;
      } else {
        throw new Error('Content project not found');
      }
    } catch (err) {
      console.error('Error fetching content project:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch content project'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new content project
   */
  const createContentProject = useCallback(async (projectData: Omit<ContentProject, 'projectId' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);
    
    try {
      const now = Timestamp.now();
      
      const newProject = {
        ...projectData,
        createdAt: now,
        updatedAt: now
      };
      
      const docRef = await addDoc(collection(db, 'contentProjects'), newProject);
      
      // Fetch the newly created project to get the complete data
      return await fetchContentProjectById(docRef.id);
    } catch (err) {
      console.error('Error creating content project:', err);
      setError(err instanceof Error ? err : new Error('Failed to create content project'));
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchContentProjectById]);

  /**
   * Update an existing content project
   */
  const updateContentProject = useCallback(async (
    projectId: string,
    projectData: Partial<Omit<ContentProject, 'projectId' | 'createdAt' | 'updatedAt'>>
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const projectRef = doc(db, 'contentProjects', projectId);
      
      const updateData = {
        ...projectData,
        updatedAt: Timestamp.now()
      };
      
      await updateDoc(projectRef, updateData);
      
      // Fetch the updated project to get the complete data
      return await fetchContentProjectById(projectId);
    } catch (err) {
      console.error('Error updating content project:', err);
      setError(err instanceof Error ? err : new Error('Failed to update content project'));
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchContentProjectById]);

  /**
   * Delete a content project
   */
  const deleteContentProject = useCallback(async (projectId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const projectRef = doc(db, 'contentProjects', projectId);
      await deleteDoc(projectRef);
      
      // Remove the deleted project from the state
      setContentProjects(prevProjects => 
        prevProjects.filter(project => project.projectId !== projectId)
      );
      
      if (selectedProject?.projectId === projectId) {
        setSelectedProject(null);
      }
      
      return true;
    } catch (err) {
      console.error('Error deleting content project:', err);
      setError(err instanceof Error ? err : new Error('Failed to delete content project'));
      return false;
    } finally {
      setLoading(false);
    }
  }, [selectedProject]);

  /**
   * Search content projects by name
   */
  const searchContentProjects = useCallback(async (searchTerm: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // For simplicity, we'll fetch all projects and filter client-side
      // In a production app, you might want to use a more efficient approach like Algolia or Firebase Extensions
      const projectsQuery = collection(db, 'contentProjects');
      const querySnapshot = await getDocs(projectsQuery);
      
      const projects: ContentProject[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Omit<ContentProject, 'projectId'>;
        const project: ContentProject = {
          projectId: doc.id,
          ...data
        };
        
        // Check if the project name contains the search term (case-insensitive)
        if (project.projectName.toLowerCase().includes(searchTerm.toLowerCase())) {
          projects.push(project);
        }
      });
      
      setContentProjects(projects);
      return projects;
    } catch (err) {
      console.error('Error searching content projects:', err);
      setError(err instanceof Error ? err : new Error('Failed to search content projects'));
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    contentProjects,
    selectedProject,
    loading,
    error,
    fetchContentProjects,
    fetchContentProjectById,
    createContentProject,
    updateContentProject,
    deleteContentProject,
    searchContentProjects
  };
};