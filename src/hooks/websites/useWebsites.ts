/**
 * useWebsites Hook
 * 
 * This custom hook provides an interface for interacting with website data in React components.
 * It wraps the WebsiteService and provides state management for websites, loading states,
 * and error handling.
 * 
 * The hook follows the React Hooks pattern and provides a clean API for components to fetch,
 * create, update, and delete websites.
 */

import { useState, useEffect, useCallback } from 'react';
import { websiteService } from '../../services/WebsiteService';
import { Website, WebsiteFormData } from '../../types/Website';

/**
 * Interface for the return value of the useWebsites hook
 */
interface UseWebsitesReturn {
  // Data states
  websites: Website[];
  selectedWebsite: Website | null;
  
  // Loading states
  loading: boolean;
  loadingWebsite: boolean;
  submitting: boolean;
  
  // Error states
  error: Error | null;
  websiteError: Error | null;
  submitError: Error | null;
  
  // Actions
  fetchWebsites: (
    filters?: { field: string; operator: string; value: any }[],
    sortField?: string,
    sortDirection?: 'asc' | 'desc',
    maxResults?: number
  ) => Promise<void>;
  fetchWebsiteById: (id: string) => Promise<void>;
  createWebsite: (data: WebsiteFormData) => Promise<string>;
  updateWebsite: (id: string, data: Partial<WebsiteFormData>) => Promise<void>;
  deleteWebsite: (id: string) => Promise<void>;
  searchWebsites: (searchTerm: string, maxResults?: number) => Promise<void>;
  getWebsitesByOrganisation: (organisationId: string) => Promise<void>;
  clearSelectedWebsite: () => void;
  clearErrors: () => void;
}

/**
 * Custom hook for managing websites
 * 
 * @returns Object containing website data, loading states, error states, and actions
 */
export const useWebsites = (): UseWebsitesReturn => {
  // Data states
  const [websites, setWebsites] = useState<Website[]>([]);
  const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null);
  
  // Loading states
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingWebsite, setLoadingWebsite] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  
  // Error states
  const [error, setError] = useState<Error | null>(null);
  const [websiteError, setWebsiteError] = useState<Error | null>(null);
  const [submitError, setSubmitError] = useState<Error | null>(null);

  /**
   * Fetch websites with optional filtering
   */
  const fetchWebsites = useCallback(async (
    filters?: { field: string; operator: string; value: any }[],
    sortField?: string,
    sortDirection?: 'asc' | 'desc',
    maxResults?: number
  ): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await websiteService.getWebsites(
        filters,
        sortField,
        sortDirection,
        maxResults
      );
      setWebsites(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch websites'));
      console.error('Error fetching websites:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch a single website by ID
   */
  const fetchWebsiteById = useCallback(async (id: string): Promise<void> => {
    setLoadingWebsite(true);
    setWebsiteError(null);
    
    try {
      const data = await websiteService.getWebsiteById(id);
      setSelectedWebsite(data);
    } catch (err) {
      setWebsiteError(err instanceof Error ? err : new Error('Failed to fetch website'));
      console.error('Error fetching website:', err);
    } finally {
      setLoadingWebsite(false);
    }
  }, []);

  /**
   * Create a new website
   */
  const createWebsite = useCallback(async (data: WebsiteFormData): Promise<string> => {
    setSubmitting(true);
    setSubmitError(null);
    
    try {
      const id = await websiteService.createWebsite(data);
      // Refresh the websites list
      fetchWebsites();
      return id;
    } catch (err) {
      setSubmitError(err instanceof Error ? err : new Error('Failed to create website'));
      console.error('Error creating website:', err);
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, [fetchWebsites]);

  /**
   * Update an existing website
   */
  const updateWebsite = useCallback(async (
    id: string, 
    data: Partial<WebsiteFormData>
  ): Promise<void> => {
    setSubmitting(true);
    setSubmitError(null);
    
    try {
      await websiteService.updateWebsite(id, data);
      
      // Update the selected website if it's the one being updated
      if (selectedWebsite && selectedWebsite.websiteId === id) {
        fetchWebsiteById(id);
      }
      
      // Refresh the websites list
      fetchWebsites();
    } catch (err) {
      setSubmitError(err instanceof Error ? err : new Error('Failed to update website'));
      console.error('Error updating website:', err);
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, [fetchWebsites, fetchWebsiteById, selectedWebsite]);

  /**
   * Delete a website
   */
  const deleteWebsite = useCallback(async (id: string): Promise<void> => {
    setSubmitting(true);
    setSubmitError(null);
    
    try {
      await websiteService.deleteWebsite(id);
      
      // Clear the selected website if it's the one being deleted
      if (selectedWebsite && selectedWebsite.websiteId === id) {
        setSelectedWebsite(null);
      }
      
      // Refresh the websites list
      fetchWebsites();
    } catch (err) {
      setSubmitError(err instanceof Error ? err : new Error('Failed to delete website'));
      console.error('Error deleting website:', err);
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, [fetchWebsites, selectedWebsite]);

  /**
   * Search websites by domain
   */
  const searchWebsites = useCallback(async (
    searchTerm: string,
    maxResults: number = 10
  ): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await websiteService.searchWebsitesByDomain(searchTerm, maxResults);
      setWebsites(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to search websites'));
      console.error('Error searching websites:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get websites by organisation ID
   */
  const getWebsitesByOrganisation = useCallback(async (
    organisationId: string
  ): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await websiteService.getWebsitesByOrganisation(organisationId);
      setWebsites(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get websites by organisation'));
      console.error('Error getting websites by organisation:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Clear the selected website
   */
  const clearSelectedWebsite = useCallback((): void => {
    setSelectedWebsite(null);
  }, []);

  /**
   * Clear all errors
   */
  const clearErrors = useCallback((): void => {
    setError(null);
    setWebsiteError(null);
    setSubmitError(null);
  }, []);

  // Return the hook's API
  return {
    // Data states
    websites,
    selectedWebsite,
    
    // Loading states
    loading,
    loadingWebsite,
    submitting,
    
    // Error states
    error,
    websiteError,
    submitError,
    
    // Actions
    fetchWebsites,
    fetchWebsiteById,
    createWebsite,
    updateWebsite,
    deleteWebsite,
    searchWebsites,
    getWebsitesByOrganisation,
    clearSelectedWebsite,
    clearErrors
  };
};