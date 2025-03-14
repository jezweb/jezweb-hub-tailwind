/**
 * useContactsWithOrganisations Hook
 * 
 * This custom hook extends the useContacts hook to include organisation information
 * for each contact. It fetches contacts and their associated organisations, and
 * provides a clean API for components to access contacts with organisation data.
 * 
 * This hook is particularly useful for displaying contacts with their organisation
 * information in lists or grids, and for filtering contacts by organisation.
 */

import { useState, useEffect, useCallback } from 'react';
import { useContacts } from './useContacts';
import { useOrganisationContacts } from './useOrganisationContacts';
import { organisationService } from '../../services/OrganisationService';
import { Contact } from '../../types/Contact';
import { Organisation } from '../../types/Organisation';

/**
 * ContactWithOrganisation interface extending Contact with organisation information
 */
export interface ContactWithOrganisation extends Contact {
  primaryOrganisation?: {
    organisationId: string;
    organisationName: string;
    role?: string;
  };
}

/**
 * Interface for the return value of the useContactsWithOrganisations hook
 */
interface UseContactsWithOrganisationsReturn {
  // Data states
  contactsWithOrganisations: ContactWithOrganisation[];
  organisations: Organisation[];
  
  // Loading states
  loading: boolean;
  loadingOrganisations: boolean;
  
  // Error states
  error: Error | null;
  organisationsError: Error | null;
  
  // Actions
  fetchContactsWithOrganisations: () => Promise<void>;
  searchContactsWithOrganisations: (searchTerm: string) => Promise<void>;
  filterContactsByOrganisation: (organisationId: string | null) => void;
  filterContactsByRole: (role: string | null) => void;
  filterContactsByStatus: (status: string | null) => void;
}

/**
 * Custom hook for managing contacts with organisation information
 * 
 * @returns Object containing contact data with organisations, loading states, error states, and actions
 */
export const useContactsWithOrganisations = (): UseContactsWithOrganisationsReturn => {
  // Get contacts data and actions from the useContacts hook
  const {
    contacts,
    loading,
    error,
    fetchContacts,
    searchContacts
  } = useContacts();
  
  // Get organisation-contact relationship data and actions
  const {
    fetchOrganisationsByContact,
    loading: loadingRelationships,
    error: relationshipsError
  } = useOrganisationContacts();
  
  // State for contacts with organisations
  const [contactsWithOrganisations, setContactsWithOrganisations] = useState<ContactWithOrganisation[]>([]);
  
  // State for organisations
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  
  // State for loading organisations
  const [loadingOrganisations, setLoadingOrganisations] = useState<boolean>(false);
  
  // State for organisations error
  const [organisationsError, setOrganisationsError] = useState<Error | null>(null);
  
  // State for filtered contacts
  const [filteredContacts, setFilteredContacts] = useState<ContactWithOrganisation[]>([]);
  
  // State for filters
  const [organisationFilter, setOrganisationFilter] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
  /**
   * Fetch all organisations
   */
  const fetchOrganisations = useCallback(async (): Promise<void> => {
    setLoadingOrganisations(true);
    setOrganisationsError(null);
    
    try {
      const data = await organisationService.getOrganisations();
      setOrganisations(data);
    } catch (err) {
      setOrganisationsError(err instanceof Error ? err : new Error('Failed to fetch organisations'));
      console.error('Error fetching organisations:', err);
    } finally {
      setLoadingOrganisations(false);
    }
  }, []);
  
  /**
   * Fetch contacts with their organisation information
   */
  const fetchContactsWithOrganisations = useCallback(async (): Promise<void> => {
    // Fetch contacts
    await fetchContacts();
    
    // Fetch organisations
    await fetchOrganisations();
  }, [fetchContacts, fetchOrganisations]);
  
  /**
   * Search contacts with their organisation information
   */
  const searchContactsWithOrganisations = useCallback(async (searchTerm: string): Promise<void> => {
    // Search contacts
    await searchContacts(searchTerm);
  }, [searchContacts]);
  
  /**
   * Filter contacts by organisation
   */
  const filterContactsByOrganisation = useCallback((organisationId: string | null): void => {
    setOrganisationFilter(organisationId);
  }, []);
  
  /**
   * Filter contacts by role
   */
  const filterContactsByRole = useCallback((role: string | null): void => {
    setRoleFilter(role);
  }, []);
  
  /**
   * Filter contacts by status
   */
  const filterContactsByStatus = useCallback((status: string | null): void => {
    setStatusFilter(status);
  }, []);
  
  /**
   * Apply filters to contacts
   */
  const applyFilters = useCallback((): void => {
    let filtered = [...contactsWithOrganisations];

    console.log('Applying filters:', { 
      organisationFilter, 
      roleFilter, 
      statusFilter,
      contactsCount: contactsWithOrganisations.length
    });
    
    // Apply organisation filter
    if (organisationFilter) {
      filtered = filtered.filter(contact => 
        contact.primaryOrganisation?.organisationId === organisationFilter
      );
    }
    
    // Apply role filter
    if (roleFilter) {
      filtered = filtered.filter(contact => 
        contact.primaryOrganisation?.role === roleFilter || contact.role === roleFilter
      );
      console.log('After role filter:', { 
        filteredCount: filtered.length,
        sampleContact: filtered.length > 0 ? filtered[0] : null });
    }
    
    // Apply status filter
    if (statusFilter) {
      // TODO: Implement status filtering when status field is added to contacts
      filtered = filtered.filter(contact => contact.status === statusFilter);
      console.log('After status filter:', { 
        filteredCount: filtered.length,
        sampleContact: filtered.length > 0 ? filtered[0] : null });
    }
    
    setFilteredContacts(filtered);
  }, [contactsWithOrganisations, organisationFilter, roleFilter, statusFilter]);
  
  /**
   * Effect to fetch organisation information for contacts
   */
  useEffect(() => {
    const fetchOrganisationInfo = async () => {
      if (!contacts.length) return;
      
      const contactsWithOrgs: ContactWithOrganisation[] = [];
      
      for (const contact of contacts) {
        try {
          // Fetch organisations for this contact
          const orgRelationships = await fetchOrganisationsByContact(contact.contactId);
          
          // Find primary organisation or first in the list
          const primaryRelationship = orgRelationships.find(rel => rel.isPrimary) || orgRelationships[0];
          
          if (primaryRelationship) {
            // Fetch organisation details
            const organisation = await organisationService.getOrganisationById(primaryRelationship.organisationId);
            
            if (organisation) {
              contactsWithOrgs.push({
                ...contact,
                primaryOrganisation: {
                  organisationId: organisation.organisationId,
                  organisationName: organisation.organisationName,
                  role: primaryRelationship.role
                }
              });
            } else {
              contactsWithOrgs.push(contact);
            }
          } else {
            contactsWithOrgs.push(contact);
          }
        } catch (err) {
          console.error(`Error fetching organisation for contact ${contact.contactId}:`, err);
          contactsWithOrgs.push(contact);
        }
      }
      
      setContactsWithOrganisations(contactsWithOrgs);
    };
    
    fetchOrganisationInfo();
  }, [contacts, fetchOrganisationsByContact]);
  
  /**
   * Effect to apply filters when filter values or contacts change
   */
  useEffect(() => {
    applyFilters();
  }, [contactsWithOrganisations, organisationFilter, roleFilter, statusFilter, applyFilters]);
  
  // Return the hook's API
  return {
    // Data states
    contactsWithOrganisations: filteredContacts.length > 0 ? filteredContacts : contactsWithOrganisations,
    organisations,
    
    // Loading states
    loading: loading || loadingRelationships,
    loadingOrganisations,
    
    // Error states
    error,
    organisationsError: organisationsError || relationshipsError,
    
    // Actions
    fetchContactsWithOrganisations,
    searchContactsWithOrganisations,
    filterContactsByOrganisation,
    filterContactsByRole,
    filterContactsByStatus
  };
};