/**
 * useWebsitesWithOrganisations Hook
 * 
 * This custom hook extends the useWebsites hook to include organisation information
 * for each website. It fetches websites and their associated organisations, and
 * provides a combined data structure for use in components.
 */

import { useState, useEffect, useCallback } from 'react';
import { useWebsites } from './useWebsites';
import { organisationService } from '../../services/OrganisationService';
import { WebsiteWithOrganisation } from '../../types/Website';

/**
 * Interface for the return value of the useWebsitesWithOrganisations hook
 */
interface UseWebsitesWithOrganisationsReturn {
  // Data states
  websitesWithOrganisations: WebsiteWithOrganisation[];
  selectedWebsiteWithOrganisation: WebsiteWithOrganisation | null;
  
  // Loading states
  loading: boolean;
  loadingWebsite: boolean;
  
  // Error states
  error: Error | null;
  websiteError: Error | null;
  
  // Actions
  fetchWebsitesWithOrganisations: (
    filters?: { field: string; operator: string; value: any }[],
    sortField?: string,
    sortDirection?: 'asc' | 'desc',
    maxResults?: number
  ) => Promise<void>;
  fetchWebsiteWithOrganisationById: (id: string) => Promise<void>;
  searchWebsitesWithOrganisations: (searchTerm: string, maxResults?: number) => Promise<void>;
  clearSelectedWebsiteWithOrganisation: () => void;
}

/**
 * Custom hook for managing websites with organisation information
 * 
 * @returns Object containing website data with organisation information, loading states, error states, and actions
 */
export const useWebsitesWithOrganisations = (): UseWebsitesWithOrganisationsReturn => {
  // Get websites data and actions from the useWebsites hook
  const {
    websites,
    selectedWebsite,
    loading,
    loadingWebsite,
    error,
    websiteError,
    fetchWebsites,
    fetchWebsiteById,
    searchWebsites,
    clearSelectedWebsite
  } = useWebsites();
  
  // State for websites with organisation information
  const [websitesWithOrganisations, setWebsitesWithOrganisations] = useState<WebsiteWithOrganisation[]>([]);
  const [selectedWebsiteWithOrganisation, setSelectedWebsiteWithOrganisation] = useState<WebsiteWithOrganisation | null>(null);

  /**
   * Fetch organisation information for a list of websites
   */
  const fetchOrganisationInfo = useCallback(async (websitesList: WebsiteWithOrganisation[]): Promise<WebsiteWithOrganisation[]> => {
    // Get unique organisation IDs
    const organisationIds = [...new Set(websitesList.map(website => website.organisationId))];
    
    // Fetch organisation information for each ID
    const organisationPromises = organisationIds.map(id => organisationService.getOrganisationById(id));
    const organisations = await Promise.all(organisationPromises);
    
    // Create a map of organisation ID to organisation name
    const organisationMap = new Map();
    organisations.forEach(org => {
      if (org) {
        organisationMap.set(org.organisationId, {
          organisationId: org.organisationId,
          organisationName: org.organisationName
        });
      }
    });
    
    // Add organisation information to each website
    return websitesList.map(website => ({
      ...website,
      organisation: organisationMap.get(website.organisationId) || undefined
    }));
  }, []);

  /**
   * Fetch websites with organisation information
   */
  const fetchWebsitesWithOrganisations = useCallback(async (
    filters?: { field: string; operator: string; value: any }[],
    sortField?: string,
    sortDirection?: 'asc' | 'desc',
    maxResults?: number
  ): Promise<void> => {
    // Fetch websites
    await fetchWebsites(filters, sortField, sortDirection, maxResults);
  }, [fetchWebsites]);

  /**
   * Fetch a single website with organisation information by ID
   */
  const fetchWebsiteWithOrganisationById = useCallback(async (id: string): Promise<void> => {
    // Fetch website
    await fetchWebsiteById(id);
  }, [fetchWebsiteById]);

  /**
   * Search websites with organisation information
   */
  const searchWebsitesWithOrganisations = useCallback(async (
    searchTerm: string,
    maxResults?: number
  ): Promise<void> => {
    // Search websites
    await searchWebsites(searchTerm, maxResults);
  }, [searchWebsites]);

  /**
   * Clear the selected website with organisation
   */
  const clearSelectedWebsiteWithOrganisation = useCallback((): void => {
    clearSelectedWebsite();
  }, [clearSelectedWebsite]);

  // Update websitesWithOrganisations when websites change
  useEffect(() => {
    if (websites.length > 0) {
      // Add organisation information to websites
      fetchOrganisationInfo(websites as WebsiteWithOrganisation[])
        .then(websitesWithOrgs => {
          setWebsitesWithOrganisations(websitesWithOrgs);
        })
        .catch(err => {
          console.error('Error fetching organisation information:', err);
        });
    } else {
      setWebsitesWithOrganisations([]);
    }
  }, [websites, fetchOrganisationInfo]);

  // Update selectedWebsiteWithOrganisation when selectedWebsite changes
  useEffect(() => {
    if (selectedWebsite) {
      // Add organisation information to selected website
      fetchOrganisationInfo([selectedWebsite as WebsiteWithOrganisation])
        .then(websitesWithOrgs => {
          setSelectedWebsiteWithOrganisation(websitesWithOrgs[0]);
        })
        .catch(err => {
          console.error('Error fetching organisation information for selected website:', err);
        });
    } else {
      setSelectedWebsiteWithOrganisation(null);
    }
  }, [selectedWebsite, fetchOrganisationInfo]);

  // Return the hook's API
  return {
    // Data states
    websitesWithOrganisations,
    selectedWebsiteWithOrganisation,
    
    // Loading states
    loading,
    loadingWebsite,
    
    // Error states
    error,
    websiteError,
    
    // Actions
    fetchWebsitesWithOrganisations,
    fetchWebsiteWithOrganisationById,
    searchWebsitesWithOrganisations,
    clearSelectedWebsiteWithOrganisation
  };
};