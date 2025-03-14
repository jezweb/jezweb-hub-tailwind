/**
 * useOrganisationContacts Hook
 * 
 * This custom hook provides an interface for managing the relationship between
 * organisations and contacts in React components. It wraps the OrganisationContactService
 * and provides state management for organisation-contact relationships, loading states,
 * and error handling.
 * 
 * The hook follows the React Hooks pattern and provides a clean API for components to fetch,
 * create, update, and delete organisation-contact relationships.
 */

import { useState, useCallback } from 'react';
import { organisationContactService } from '../../services/OrganisationContactService';
import { OrganisationContactFormData } from '../../types/OrganisationContact';
import { Contact } from '../../types/Contact';

/**
 * Interface for the return value of the useOrganisationContacts hook
 */
interface UseOrganisationContactsReturn {
  // Data states
  organisationContacts: (Contact & { 
    relationshipId: string; 
    role?: string; 
    isPrimary: boolean; 
    priority: number 
  })[];
  
  // Loading states
  loading: boolean;
  submitting: boolean;
  
  // Error states
  error: Error | null;
  submitError: Error | null;
  
  // Actions
  fetchContactsByOrganisation: (organisationId: string) => Promise<void>;
  fetchOrganisationsByContact: (contactId: string) => Promise<{ 
    organisationId: string; 
    relationshipId: string; 
    role?: string; 
    isPrimary: boolean; 
    priority: number 
  }[]>;
  addContactToOrganisation: (data: OrganisationContactFormData) => Promise<string>;
  updateOrganisationContact: (id: string, data: Partial<OrganisationContactFormData>) => Promise<void>;
  removeContactFromOrganisation: (id: string) => Promise<void>;
  clearErrors: () => void;
}

/**
 * Custom hook for managing organisation-contact relationships
 * 
 * @returns Object containing relationship data, loading states, error states, and actions
 */
export const useOrganisationContacts = (): UseOrganisationContactsReturn => {
  // Data states
  const [organisationContacts, setOrganisationContacts] = useState<(Contact & { 
    relationshipId: string; 
    role?: string; 
    isPrimary: boolean; 
    priority: number 
  })[]>([]);
  
  // Loading states
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  
  // Error states
  const [error, setError] = useState<Error | null>(null);
  const [submitError, setSubmitError] = useState<Error | null>(null);

  /**
   * Fetch all contacts for an organisation
   */
  const fetchContactsByOrganisation = useCallback(async (organisationId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await organisationContactService.getContactsByOrganisation(organisationId);
      setOrganisationContacts(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch organisation contacts'));
      console.error('Error fetching organisation contacts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch all organisations for a contact
   */
  const fetchOrganisationsByContact = useCallback(async (contactId: string): Promise<{ 
    organisationId: string; 
    relationshipId: string; 
    role?: string; 
    isPrimary: boolean; 
    priority: number 
  }[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await organisationContactService.getOrganisationsByContact(contactId);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch contact organisations'));
      console.error('Error fetching contact organisations:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Add a contact to an organisation
   */
  const addContactToOrganisation = useCallback(async (
    data: OrganisationContactFormData
  ): Promise<string> => {
    setSubmitting(true);
    setSubmitError(null);
    
    try {
      const id = await organisationContactService.createOrganisationContact(data);
      
      // Refresh the contacts list if we're viewing the same organisation
      if (data.organisationId) {
        fetchContactsByOrganisation(data.organisationId);
      }
      
      return id;
    } catch (err) {
      setSubmitError(err instanceof Error ? err : new Error('Failed to add contact to organisation'));
      console.error('Error adding contact to organisation:', err);
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, [fetchContactsByOrganisation]);

  /**
   * Update an organisation-contact relationship
   */
  const updateOrganisationContact = useCallback(async (
    id: string, 
    data: Partial<OrganisationContactFormData>
  ): Promise<void> => {
    setSubmitting(true);
    setSubmitError(null);
    
    try {
      await organisationContactService.updateOrganisationContact(id, data);
      
      // Get the current organisation ID to refresh the list
      const relationship = await organisationContactService.getOrganisationContactById(id);
      if (relationship && relationship.organisationId) {
        fetchContactsByOrganisation(relationship.organisationId);
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err : new Error('Failed to update organisation contact'));
      console.error('Error updating organisation contact:', err);
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, [fetchContactsByOrganisation]);

  /**
   * Remove a contact from an organisation
   */
  const removeContactFromOrganisation = useCallback(async (id: string): Promise<void> => {
    setSubmitting(true);
    setSubmitError(null);
    
    try {
      // Get the current organisation ID to refresh the list after deletion
      const relationship = await organisationContactService.getOrganisationContactById(id);
      const organisationId = relationship?.organisationId;
      
      await organisationContactService.deleteOrganisationContact(id);
      
      // Refresh the contacts list if we have the organisation ID
      if (organisationId) {
        fetchContactsByOrganisation(organisationId);
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err : new Error('Failed to remove contact from organisation'));
      console.error('Error removing contact from organisation:', err);
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, [fetchContactsByOrganisation]);

  /**
   * Clear all errors
   */
  const clearErrors = useCallback((): void => {
    setError(null);
    setSubmitError(null);
  }, []);

  // Return the hook's API
  return {
    // Data states
    organisationContacts,
    
    // Loading states
    loading,
    submitting,
    
    // Error states
    error,
    submitError,
    
    // Actions
    fetchContactsByOrganisation,
    fetchOrganisationsByContact,
    addContactToOrganisation,
    updateOrganisationContact,
    removeContactFromOrganisation,
    clearErrors
  };
};