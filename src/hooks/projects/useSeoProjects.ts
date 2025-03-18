/**
 * useSeoProjects Hook
 * 
 * This hook provides functionality for fetching, creating, updating, and deleting SEO projects.
 * It encapsulates all the data fetching logic and state management for SEO projects.
 */

import { useState, useCallback, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';

// Define the SeoProject interface based on the schema
export interface SeoProject {
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
  seoType: string; // Local, National, International, etc.
  targetKeywords?: string[];
  competitorAnalysis?: {
    competitors?: string[];
    competitorKeywords?: string[];
    competitorBacklinks?: string[];
  };
  seoAudit?: {
    technicalIssues?: string[];
    contentIssues?: string[];
    onPageIssues?: string[];
    offPageIssues?: string[];
    performanceIssues?: string[];
  };
  seoStrategy?: {
    keywordStrategy?: string;
    contentStrategy?: string;
    linkBuildingStrategy?: string;
    localSeoStrategy?: string;
    technicalSeoStrategy?: string;
  };
  analytics?: {
    analyticsSetup?: boolean;
    searchConsoleSetup?: boolean;
    conversionTracking?: boolean;
    goalTracking?: boolean;
    customReports?: boolean;
  };
  reporting?: {
    reportingFrequency?: string;
    keyMetrics?: string[];
    customDashboard?: boolean;
    clientAccess?: boolean;
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
  seoType?: string;
}

export const useSeoProjects = () => {
  const [seoProjects, setSeoProjects] = useState<SeoProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<SeoProject | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch all SEO projects with optional filtering and sorting
   */
  const fetchSeoProjects = useCallback(async (
    filters: Filters = {},
    sortField: string = 'createdAt',
    sortDirection: 'asc' | 'desc' = 'desc'
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      // Start with a base query
      let projectsQuery = collection(db, 'seoProjects');
      
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
      
      if (filters.seoType) {
        constraints.push(where('seoType', '==', filters.seoType));
      }
      
      // Apply sorting
      constraints.push(orderBy(sortField, sortDirection));
      
      // Create the query with all constraints
      const q = query(projectsQuery, ...constraints);
      
      // Execute the query
      const querySnapshot = await getDocs(q);
      
      // Process the results
      const projects: SeoProject[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Omit<SeoProject, 'projectId'>;
        projects.push({
          projectId: doc.id,
          ...data
        });
      });
      
      setSeoProjects(projects);
    } catch (err) {
      console.error('Error fetching SEO projects:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch SEO projects'));
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch a single SEO project by ID
   */
  const fetchSeoProjectById = useCallback(async (projectId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const projectRef = doc(db, 'seoProjects', projectId);
      const projectSnapshot = await getDoc(projectRef);
      
      if (projectSnapshot.exists()) {
        const data = projectSnapshot.data() as Omit<SeoProject, 'projectId'>;
        const project: SeoProject = {
          projectId: projectSnapshot.id,
          ...data
        };
        
        setSelectedProject(project);
        return project;
      } else {
        throw new Error('SEO project not found');
      }
    } catch (err) {
      console.error('Error fetching SEO project:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch SEO project'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new SEO project
   */
  const createSeoProject = useCallback(async (projectData: Omit<SeoProject, 'projectId' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);
    
    try {
      const now = Timestamp.now();
      
      const newProject = {
        ...projectData,
        createdAt: now,
        updatedAt: now
      };
      
      const docRef = await addDoc(collection(db, 'seoProjects'), newProject);
      
      // Fetch the newly created project to get the complete data
      return await fetchSeoProjectById(docRef.id);
    } catch (err) {
      console.error('Error creating SEO project:', err);
      setError(err instanceof Error ? err : new Error('Failed to create SEO project'));
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchSeoProjectById]);

  /**
   * Update an existing SEO project
   */
  const updateSeoProject = useCallback(async (
    projectId: string,
    projectData: Partial<Omit<SeoProject, 'projectId' | 'createdAt' | 'updatedAt'>>
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const projectRef = doc(db, 'seoProjects', projectId);
      
      const updateData = {
        ...projectData,
        updatedAt: Timestamp.now()
      };
      
      await updateDoc(projectRef, updateData);
      
      // Fetch the updated project to get the complete data
      return await fetchSeoProjectById(projectId);
    } catch (err) {
      console.error('Error updating SEO project:', err);
      setError(err instanceof Error ? err : new Error('Failed to update SEO project'));
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchSeoProjectById]);

  /**
   * Delete an SEO project
   */
  const deleteSeoProject = useCallback(async (projectId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const projectRef = doc(db, 'seoProjects', projectId);
      await deleteDoc(projectRef);
      
      // Remove the deleted project from the state
      setSeoProjects(prevProjects => 
        prevProjects.filter(project => project.projectId !== projectId)
      );
      
      if (selectedProject?.projectId === projectId) {
        setSelectedProject(null);
      }
      
      return true;
    } catch (err) {
      console.error('Error deleting SEO project:', err);
      setError(err instanceof Error ? err : new Error('Failed to delete SEO project'));
      return false;
    } finally {
      setLoading(false);
    }
  }, [selectedProject]);

  /**
   * Search SEO projects by name
   */
  const searchSeoProjects = useCallback(async (searchTerm: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // For simplicity, we'll fetch all projects and filter client-side
      // In a production app, you might want to use a more efficient approach like Algolia or Firebase Extensions
      const projectsQuery = collection(db, 'seoProjects');
      const querySnapshot = await getDocs(projectsQuery);
      
      const projects: SeoProject[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Omit<SeoProject, 'projectId'>;
        const project: SeoProject = {
          projectId: doc.id,
          ...data
        };
        
        // Check if the project name contains the search term (case-insensitive)
        if (project.projectName.toLowerCase().includes(searchTerm.toLowerCase())) {
          projects.push(project);
        }
      });
      
      setSeoProjects(projects);
      return projects;
    } catch (err) {
      console.error('Error searching SEO projects:', err);
      setError(err instanceof Error ? err : new Error('Failed to search SEO projects'));
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    seoProjects,
    selectedProject,
    loading,
    error,
    fetchSeoProjects,
    fetchSeoProjectById,
    createSeoProject,
    updateSeoProject,
    deleteSeoProject,
    searchSeoProjects
  };
};