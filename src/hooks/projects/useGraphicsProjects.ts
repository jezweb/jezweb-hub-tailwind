/**
 * useGraphicsProjects Hook
 * 
 * This hook provides functionality for fetching, creating, updating, and deleting graphics projects.
 * It encapsulates all the data fetching logic and state management for graphics projects.
 */

import { useState, useCallback, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';

// Define the GraphicsProject interface based on the schema
export interface GraphicsProject {
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
  graphicsType: string; // Logo, Branding, Print, Digital, etc.
  designRequirements?: {
    colorPalette?: string[];
    typography?: {
      primaryFont?: string;
      secondaryFont?: string;
      fontSizes?: string[];
    };
    styleGuide?: boolean;
    brandGuidelines?: string;
    moodBoard?: boolean;
  };
  deliverables?: {
    fileFormats?: string[];
    dimensions?: string[];
    printSpecifications?: {
      paperType?: string;
      finish?: string;
      quantity?: number;
    };
    digitalSpecifications?: {
      fileSize?: string;
      resolution?: string;
      colorMode?: string;
    };
  };
  revisions?: {
    allowedRevisions?: number;
    currentRevision?: number;
    revisionHistory?: {
      [key: string]: {
        date: string;
        comments: string;
        status: string;
      }
    };
  };
  assets?: {
    logos?: string[];
    images?: string[];
    illustrations?: string[];
    mockups?: string[];
    sourceFiles?: string[];
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
  graphicsType?: string;
}

export const useGraphicsProjects = () => {
  const [graphicsProjects, setGraphicsProjects] = useState<GraphicsProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<GraphicsProject | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch all graphics projects with optional filtering and sorting
   */
  const fetchGraphicsProjects = useCallback(async (
    filters: Filters = {},
    sortField: string = 'createdAt',
    sortDirection: 'asc' | 'desc' = 'desc'
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      // Start with a base query
      let projectsQuery = collection(db, 'graphicsProjects');
      
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
      
      if (filters.graphicsType) {
        constraints.push(where('graphicsType', '==', filters.graphicsType));
      }
      
      // Apply sorting
      constraints.push(orderBy(sortField, sortDirection));
      
      // Create the query with all constraints
      const q = query(projectsQuery, ...constraints);
      
      // Execute the query
      const querySnapshot = await getDocs(q);
      
      // Process the results
      const projects: GraphicsProject[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Omit<GraphicsProject, 'projectId'>;
        projects.push({
          projectId: doc.id,
          ...data
        });
      });
      
      setGraphicsProjects(projects);
    } catch (err) {
      console.error('Error fetching graphics projects:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch graphics projects'));
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch a single graphics project by ID
   */
  const fetchGraphicsProjectById = useCallback(async (projectId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const projectRef = doc(db, 'graphicsProjects', projectId);
      const projectSnapshot = await getDoc(projectRef);
      
      if (projectSnapshot.exists()) {
        const data = projectSnapshot.data() as Omit<GraphicsProject, 'projectId'>;
        const project: GraphicsProject = {
          projectId: projectSnapshot.id,
          ...data
        };
        
        setSelectedProject(project);
        return project;
      } else {
        throw new Error('Graphics project not found');
      }
    } catch (err) {
      console.error('Error fetching graphics project:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch graphics project'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new graphics project
   */
  const createGraphicsProject = useCallback(async (projectData: Omit<GraphicsProject, 'projectId' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);
    
    try {
      const now = Timestamp.now();
      
      const newProject = {
        ...projectData,
        createdAt: now,
        updatedAt: now
      };
      
      const docRef = await addDoc(collection(db, 'graphicsProjects'), newProject);
      
      // Fetch the newly created project to get the complete data
      return await fetchGraphicsProjectById(docRef.id);
    } catch (err) {
      console.error('Error creating graphics project:', err);
      setError(err instanceof Error ? err : new Error('Failed to create graphics project'));
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchGraphicsProjectById]);

  /**
   * Update an existing graphics project
   */
  const updateGraphicsProject = useCallback(async (
    projectId: string,
    projectData: Partial<Omit<GraphicsProject, 'projectId' | 'createdAt' | 'updatedAt'>>
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const projectRef = doc(db, 'graphicsProjects', projectId);
      
      const updateData = {
        ...projectData,
        updatedAt: Timestamp.now()
      };
      
      await updateDoc(projectRef, updateData);
      
      // Fetch the updated project to get the complete data
      return await fetchGraphicsProjectById(projectId);
    } catch (err) {
      console.error('Error updating graphics project:', err);
      setError(err instanceof Error ? err : new Error('Failed to update graphics project'));
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchGraphicsProjectById]);

  /**
   * Delete a graphics project
   */
  const deleteGraphicsProject = useCallback(async (projectId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const projectRef = doc(db, 'graphicsProjects', projectId);
      await deleteDoc(projectRef);
      
      // Remove the deleted project from the state
      setGraphicsProjects(prevProjects => 
        prevProjects.filter(project => project.projectId !== projectId)
      );
      
      if (selectedProject?.projectId === projectId) {
        setSelectedProject(null);
      }
      
      return true;
    } catch (err) {
      console.error('Error deleting graphics project:', err);
      setError(err instanceof Error ? err : new Error('Failed to delete graphics project'));
      return false;
    } finally {
      setLoading(false);
    }
  }, [selectedProject]);

  /**
   * Search graphics projects by name
   */
  const searchGraphicsProjects = useCallback(async (searchTerm: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // For simplicity, we'll fetch all projects and filter client-side
      // In a production app, you might want to use a more efficient approach like Algolia or Firebase Extensions
      const projectsQuery = collection(db, 'graphicsProjects');
      const querySnapshot = await getDocs(projectsQuery);
      
      const projects: GraphicsProject[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Omit<GraphicsProject, 'projectId'>;
        const project: GraphicsProject = {
          projectId: doc.id,
          ...data
        };
        
        // Check if the project name contains the search term (case-insensitive)
        if (project.projectName.toLowerCase().includes(searchTerm.toLowerCase())) {
          projects.push(project);
        }
      });
      
      setGraphicsProjects(projects);
      return projects;
    } catch (err) {
      console.error('Error searching graphics projects:', err);
      setError(err instanceof Error ? err : new Error('Failed to search graphics projects'));
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    graphicsProjects,
    selectedProject,
    loading,
    error,
    fetchGraphicsProjects,
    fetchGraphicsProjectById,
    createGraphicsProject,
    updateGraphicsProject,
    deleteGraphicsProject,
    searchGraphicsProjects
  };
};