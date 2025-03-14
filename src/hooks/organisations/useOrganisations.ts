/**
 * useOrganisations Hook
 * 
 * This custom hook provides an interface for interacting with organisation data in React components.
 * It wraps the OrganisationService and provides state management for organisations, loading states,
 * and error handling.
 * 
 * The hook follows the React Hooks pattern and provides a clean API for components to fetch,
 * create, update, and delete organisations.
 */

import { useState, useEffect, useCallback } from 'react';
import { organisationService } from '../../services/OrganisationService';
import { Organisation, OrganisationFormData } from '../../types/Organisation';

/**
 * Interface for the return value of the useOrganisations hook
 */
interface UseOrganisationsReturn {
  // Data states
  organisations: Organisation[];
  selectedOrganisation: Organisation | null;
  
  // Loading states
  loading: boolean;
  loadingOrganisation: boolean;
  submitting: boolean;
  
  // Error states
  error: Error | null;
  organisationError: Error | null;
  submitError: Error | null;
  
  // Actions
  fetchOrganisations: (
    filters?: { field: string; operator: string; value: any }[],
    sortField?: string,
    sortDirection?: 'asc' | 'desc',
    maxResults?: number
  ) => Promise<void>;
  fetchOrganisationById: (id: string) => Promise<void>;
  createOrganisation: (data: OrganisationFormData) => Promise<string>;
  updateOrganisation: (id: string, data: Partial<OrganisationFormData>) => Promise<void>;
  deleteOrganisation: (id: string) => Promise<void>;
  searchOrganisations: (searchTerm: string, maxResults?: number) => Promise<void>;
  clearSelectedOrganisation: () => void;
  clearErrors: () => void;
}

/**
 * Custom hook for managing organisations
 * 
 * @returns Object containing organisation data, loading states, error states, and actions
 */
export const useOrganisations = (): UseOrganisationsReturn => {
  // Data states
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [selectedOrganisation, setSelectedOrganisation] = useState<Organisation | null>(null);
  
  // Loading states
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingOrganisation, setLoadingOrganisation] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  
  // Error states
  const [error, setError] = useState<Error | null>(null);
  const [organisationError, setOrganisationError] = useState<Error | null>(null);
  const [submitError, setSubmitError] = useState<Error | null>(null);

  /**
   * Fetch organisations with optional filtering
   */
  const fetchOrganisations = useCallback(async (
    filters?: { field: string; operator: string; value: any }[],
    sortField?: string,
    sortDirection?: 'asc' | 'desc',
    maxResults?: number
  ): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await organisationService.getOrganisations(
        filters,
        sortField,
        sortDirection,
        maxResults
      );
      setOrganisations(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch organisations'));
      console.error('Error fetching organisations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch a single organisation by ID
   */
  const fetchOrganisationById = useCallback(async (id: string): Promise<void> => {
    setLoadingOrganisation(true);
    setOrganisationError(null);
    
    try {
      const data = await organisationService.getOrganisationById(id);
      setSelectedOrganisation(data);
    } catch (err) {
      setOrganisationError(err instanceof Error ? err : new Error('Failed to fetch organisation'));
      console.error('Error fetching organisation:', err);
    } finally {
      setLoadingOrganisation(false);
    }
  }, []);

  /**
   * Create a new organisation
   */
  const createOrganisation = useCallback(async (data: OrganisationFormData): Promise<string> => {
    setSubmitting(true);
    setSubmitError(null);
    
    try {
      const id = await organisationService.createOrganisation(data);
      // Refresh the organisations list
      fetchOrganisations();
      return id;
    } catch (err) {
      setSubmitError(err instanceof Error ? err : new Error('Failed to create organisation'));
      console.error('Error creating organisation:', err);
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, [fetchOrganisations]);

  /**
   * Update an existing organisation
   */
  const updateOrganisation = useCallback(async (
    id: string, 
    data: Partial<OrganisationFormData>
  ): Promise<void> => {
    setSubmitting(true);
    setSubmitError(null);
    
    try {
      await organisationService.updateOrganisation(id, data);
      
      // Update the selected organisation if it's the one being updated
      if (selectedOrganisation && selectedOrganisation.organisationId === id) {
        fetchOrganisationById(id);
      }
      
      // Refresh the organisations list
      fetchOrganisations();
    } catch (err) {
      setSubmitError(err instanceof Error ? err : new Error('Failed to update organisation'));
      console.error('Error updating organisation:', err);
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, [fetchOrganisations, fetchOrganisationById, selectedOrganisation]);

  /**
   * Delete an organisation
   */
  const deleteOrganisation = useCallback(async (id: string): Promise<void> => {
    setSubmitting(true);
    setSubmitError(null);
    
    try {
      await organisationService.deleteOrganisation(id);
      
      // Clear the selected organisation if it's the one being deleted
      if (selectedOrganisation && selectedOrganisation.organisationId === id) {
        setSelectedOrganisation(null);
      }
      
      // Refresh the organisations list
      fetchOrganisations();
    } catch (err) {
      setSubmitError(err instanceof Error ? err : new Error('Failed to delete organisation'));
      console.error('Error deleting organisation:', err);
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, [fetchOrganisations, selectedOrganisation]);

  /**
   * Search organisations by name
   */
  const searchOrganisations = useCallback(async (
    searchTerm: string,
    maxResults: number = 10
  ): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await organisationService.searchOrganisationsByName(searchTerm, maxResults);
      setOrganisations(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to search organisations'));
      console.error('Error searching organisations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Clear the selected organisation
   */
  const clearSelectedOrganisation = useCallback((): void => {
    setSelectedOrganisation(null);
  }, []);

  /**
   * Clear all errors
   */
  const clearErrors = useCallback((): void => {
    setError(null);
    setOrganisationError(null);
    setSubmitError(null);
  }, []);

  // Return the hook's API
  return {
    // Data states
    organisations,
    selectedOrganisation,
    
    // Loading states
    loading,
    loadingOrganisation,
    submitting,
    
    // Error states
    error,
    organisationError,
    submitError,
    
    // Actions
    fetchOrganisations,
    fetchOrganisationById,
    createOrganisation,
    updateOrganisation,
    deleteOrganisation,
    searchOrganisations,
    clearSelectedOrganisation,
    clearErrors
  };
};