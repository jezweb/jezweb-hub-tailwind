/**
 * useWebsiteProjects Hook
 * 
 * This hook provides functionality for fetching, creating, updating, and deleting website projects.
 * It encapsulates all the data fetching logic and state management for website projects.
 */

import { useState, useCallback, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';

// Define the WebsiteProject interface based on the schema
export interface WebsiteProject {
  projectId: string;
  organisationId: string;
  websiteId?: string;
  projectName: string;
  projectBrief: string;
  projectBriefHTML: string;
  status: string;
  startDate?: string;
  dueDate?: string;
  assignedTo?: string;
  budget?: number;
  costs?: number;
  credentials?: {
    stagingLogins?: string;
    clientLogins?: string;
    customerDbFiles?: string[];
    clientFiles?: string[];
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
}

export const useWebsiteProjects = () => {
  const [websiteProjects, setWebsiteProjects] = useState<WebsiteProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<WebsiteProject | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch all website projects with optional filtering and sorting
   */
  const fetchWebsiteProjects = useCallback(async (
    filters: Filters = {},
    sortField: string = 'createdAt',
    sortDirection: 'asc' | 'desc' = 'desc'
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      // Start with a base query
      let projectsQuery = collection(db, 'websiteProjects');
      
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
      
      // Apply sorting
      constraints.push(orderBy(sortField, sortDirection));
      
      // Create the query with all constraints
      const q = query(projectsQuery, ...constraints);
      
      // Execute the query
      const querySnapshot = await getDocs(q);
      
      // Process the results
      const projects: WebsiteProject[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Omit<WebsiteProject, 'projectId'>;
        projects.push({
          projectId: doc.id,
          ...data
        });
      });
      
      setWebsiteProjects(projects);
    } catch (err) {
      console.error('Error fetching website projects:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch website projects'));
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch a single website project by ID
   */
  const fetchWebsiteProjectById = useCallback(async (projectId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const projectRef = doc(db, 'websiteProjects', projectId);
      const projectSnapshot = await getDoc(projectRef);
      
      if (projectSnapshot.exists()) {
        const data = projectSnapshot.data() as Omit<WebsiteProject, 'projectId'>;
        const project: WebsiteProject = {
          projectId: projectSnapshot.id,
          ...data
        };
        
        setSelectedProject(project);
        return project;
      } else {
        throw new Error('Website project not found');
      }
    } catch (err) {
      console.error('Error fetching website project:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch website project'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new website project
   */
  const createWebsiteProject = useCallback(async (projectData: Omit<WebsiteProject, 'projectId' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);
    
    try {
      const now = Timestamp.now();
      
      const newProject = {
        ...projectData,
        createdAt: now,
        updatedAt: now
      };
      
      const docRef = await addDoc(collection(db, 'websiteProjects'), newProject);
      
      // Fetch the newly created project to get the complete data
      return await fetchWebsiteProjectById(docRef.id);
    } catch (err) {
      console.error('Error creating website project:', err);
      setError(err instanceof Error ? err : new Error('Failed to create website project'));
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchWebsiteProjectById]);

  /**
   * Update an existing website project
   */
  const updateWebsiteProject = useCallback(async (
    projectId: string,
    projectData: Partial<Omit<WebsiteProject, 'projectId' | 'createdAt' | 'updatedAt'>>
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const projectRef = doc(db, 'websiteProjects', projectId);
      
      const updateData = {
        ...projectData,
        updatedAt: Timestamp.now()
      };
      
      await updateDoc(projectRef, updateData);
      
      // Fetch the updated project to get the complete data
      return await fetchWebsiteProjectById(projectId);
    } catch (err) {
      console.error('Error updating website project:', err);
      setError(err instanceof Error ? err : new Error('Failed to update website project'));
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchWebsiteProjectById]);

  /**
   * Delete a website project
   */
  const deleteWebsiteProject = useCallback(async (projectId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const projectRef = doc(db, 'websiteProjects', projectId);
      await deleteDoc(projectRef);
      
      // Remove the deleted project from the state
      setWebsiteProjects(prevProjects => 
        prevProjects.filter(project => project.projectId !== projectId)
      );
      
      if (selectedProject?.projectId === projectId) {
        setSelectedProject(null);
      }
      
      return true;
    } catch (err) {
      console.error('Error deleting website project:', err);
      setError(err instanceof Error ? err : new Error('Failed to delete website project'));
      return false;
    } finally {
      setLoading(false);
    }
  }, [selectedProject]);

  /**
   * Search website projects by name
   */
  const searchWebsiteProjects = useCallback(async (searchTerm: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // For simplicity, we'll fetch all projects and filter client-side
      // In a production app, you might want to use a more efficient approach like Algolia or Firebase Extensions
      const projectsQuery = collection(db, 'websiteProjects');
      const querySnapshot = await getDocs(projectsQuery);
      
      const projects: WebsiteProject[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Omit<WebsiteProject, 'projectId'>;
        const project: WebsiteProject = {
          projectId: doc.id,
          ...data
        };
        
        // Check if the project name contains the search term (case-insensitive)
        if (project.projectName.toLowerCase().includes(searchTerm.toLowerCase())) {
          projects.push(project);
        }
      });
      
      setWebsiteProjects(projects);
      return projects;
    } catch (err) {
      console.error('Error searching website projects:', err);
      setError(err instanceof Error ? err : new Error('Failed to search website projects'));
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    websiteProjects,
    selectedProject,
    loading,
    error,
    fetchWebsiteProjects,
    fetchWebsiteProjectById,
    createWebsiteProject,
    updateWebsiteProject,
    deleteWebsiteProject,
    searchWebsiteProjects
  };
};