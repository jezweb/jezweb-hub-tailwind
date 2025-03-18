/**
 * useAppProjects Hook
 * 
 * This hook provides functionality for fetching, creating, updating, and deleting app projects.
 * It encapsulates all the data fetching logic and state management for app projects.
 */

import { useState, useCallback, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';

// Define the AppProject interface based on the schema
export interface AppProject {
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
  appType: string; // Mobile, Web, Desktop, etc.
  platforms?: string[]; // iOS, Android, Web, etc.
  appRequirements?: {
    features?: string[];
    userRoles?: string[];
    integrations?: string[];
    securityRequirements?: string[];
    performanceRequirements?: string[];
  };
  technicalSpecifications?: {
    frontendTechnology?: string;
    backendTechnology?: string;
    database?: string;
    apis?: string[];
    hosting?: string;
    authentication?: string;
    thirdPartyServices?: string[];
  };
  designSpecifications?: {
    wireframes?: boolean;
    mockups?: boolean;
    prototypes?: boolean;
    designSystem?: boolean;
    brandGuidelines?: string;
  };
  development?: {
    repository?: string;
    deploymentStrategy?: string;
    cicdPipeline?: string;
    testingStrategy?: string;
    environmentSetup?: {
      development?: boolean;
      staging?: boolean;
      production?: boolean;
    };
  };
  appStore?: {
    appStoreSubmission?: boolean;
    playStoreSubmission?: boolean;
    appStoreId?: string;
    playStoreId?: string;
    appStoreUrl?: string;
    playStoreUrl?: string;
    appVersion?: string;
    releaseNotes?: string;
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
  appType?: string;
  platform?: string;
}

export const useAppProjects = () => {
  const [appProjects, setAppProjects] = useState<AppProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<AppProject | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch all app projects with optional filtering and sorting
   */
  const fetchAppProjects = useCallback(async (
    filters: Filters = {},
    sortField: string = 'createdAt',
    sortDirection: 'asc' | 'desc' = 'desc'
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      // Start with a base query
      let projectsQuery = collection(db, 'appProjects');
      
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
      
      if (filters.appType) {
        constraints.push(where('appType', '==', filters.appType));
      }
      
      if (filters.platform) {
        constraints.push(where('platforms', 'array-contains', filters.platform));
      }
      
      // Apply sorting
      constraints.push(orderBy(sortField, sortDirection));
      
      // Create the query with all constraints
      const q = query(projectsQuery, ...constraints);
      
      // Execute the query
      const querySnapshot = await getDocs(q);
      
      // Process the results
      const projects: AppProject[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Omit<AppProject, 'projectId'>;
        projects.push({
          projectId: doc.id,
          ...data
        });
      });
      
      setAppProjects(projects);
    } catch (err) {
      console.error('Error fetching app projects:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch app projects'));
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch a single app project by ID
   */
  const fetchAppProjectById = useCallback(async (projectId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const projectRef = doc(db, 'appProjects', projectId);
      const projectSnapshot = await getDoc(projectRef);
      
      if (projectSnapshot.exists()) {
        const data = projectSnapshot.data() as Omit<AppProject, 'projectId'>;
        const project: AppProject = {
          projectId: projectSnapshot.id,
          ...data
        };
        
        setSelectedProject(project);
        return project;
      } else {
        throw new Error('App project not found');
      }
    } catch (err) {
      console.error('Error fetching app project:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch app project'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new app project
   */
  const createAppProject = useCallback(async (projectData: Omit<AppProject, 'projectId' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);
    
    try {
      const now = Timestamp.now();
      
      const newProject = {
        ...projectData,
        createdAt: now,
        updatedAt: now
      };
      
      const docRef = await addDoc(collection(db, 'appProjects'), newProject);
      
      // Fetch the newly created project to get the complete data
      return await fetchAppProjectById(docRef.id);
    } catch (err) {
      console.error('Error creating app project:', err);
      setError(err instanceof Error ? err : new Error('Failed to create app project'));
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchAppProjectById]);

  /**
   * Update an existing app project
   */
  const updateAppProject = useCallback(async (
    projectId: string,
    projectData: Partial<Omit<AppProject, 'projectId' | 'createdAt' | 'updatedAt'>>
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const projectRef = doc(db, 'appProjects', projectId);
      
      const updateData = {
        ...projectData,
        updatedAt: Timestamp.now()
      };
      
      await updateDoc(projectRef, updateData);
      
      // Fetch the updated project to get the complete data
      return await fetchAppProjectById(projectId);
    } catch (err) {
      console.error('Error updating app project:', err);
      setError(err instanceof Error ? err : new Error('Failed to update app project'));
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchAppProjectById]);

  /**
   * Delete an app project
   */
  const deleteAppProject = useCallback(async (projectId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const projectRef = doc(db, 'appProjects', projectId);
      await deleteDoc(projectRef);
      
      // Remove the deleted project from the state
      setAppProjects(prevProjects => 
        prevProjects.filter(project => project.projectId !== projectId)
      );
      
      if (selectedProject?.projectId === projectId) {
        setSelectedProject(null);
      }
      
      return true;
    } catch (err) {
      console.error('Error deleting app project:', err);
      setError(err instanceof Error ? err : new Error('Failed to delete app project'));
      return false;
    } finally {
      setLoading(false);
    }
  }, [selectedProject]);

  /**
   * Search app projects by name
   */
  const searchAppProjects = useCallback(async (searchTerm: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // For simplicity, we'll fetch all projects and filter client-side
      // In a production app, you might want to use a more efficient approach like Algolia or Firebase Extensions
      const projectsQuery = collection(db, 'appProjects');
      const querySnapshot = await getDocs(projectsQuery);
      
      const projects: AppProject[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Omit<AppProject, 'projectId'>;
        const project: AppProject = {
          projectId: doc.id,
          ...data
        };
        
        // Check if the project name contains the search term (case-insensitive)
        if (project.projectName.toLowerCase().includes(searchTerm.toLowerCase())) {
          projects.push(project);
        }
      });
      
      setAppProjects(projects);
      return projects;
    } catch (err) {
      console.error('Error searching app projects:', err);
      setError(err instanceof Error ? err : new Error('Failed to search app projects'));
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    appProjects,
    selectedProject,
    loading,
    error,
    fetchAppProjects,
    fetchAppProjectById,
    createAppProject,
    updateAppProject,
    deleteAppProject,
    searchAppProjects
  };
};