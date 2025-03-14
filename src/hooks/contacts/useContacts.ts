/**
 * useContacts Hook
 * 
 * This custom hook provides an interface for interacting with contact data in React components.
 * It wraps the ContactService and provides state management for contacts, loading states,
 * and error handling.
 * 
 * The hook follows the React Hooks pattern and provides a clean API for components to fetch,
 * create, update, and delete contacts.
 */

import { useState, useEffect, useCallback } from 'react';
import { contactService } from '../../services/ContactService';
import { Contact, ContactFormData } from '../../types/Contact';

/**
 * Interface for the return value of the useContacts hook
 */
interface UseContactsReturn {
  // Data states
  contacts: Contact[];
  selectedContact: Contact | null;
  
  // Loading states
  loading: boolean;
  loadingContact: boolean;
  submitting: boolean;
  
  // Error states
  error: Error | null;
  contactError: Error | null;
  submitError: Error | null;
  
  // Actions
  fetchContacts: (
    filters?: { field: string; operator: string; value: any }[],
    sortField?: string,
    sortDirection?: 'asc' | 'desc',
    maxResults?: number
  ) => Promise<void>;
  fetchContactById: (id: string) => Promise<void>;
  createContact: (data: ContactFormData) => Promise<string>;
  updateContact: (id: string, data: Partial<ContactFormData>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  searchContacts: (searchTerm: string, maxResults?: number) => Promise<void>;
  clearSelectedContact: () => void;
  clearErrors: () => void;
}

/**
 * Custom hook for managing contacts
 * 
 * @returns Object containing contact data, loading states, error states, and actions
 */
export const useContacts = (): UseContactsReturn => {
  // Data states
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  
  // Loading states
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingContact, setLoadingContact] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  
  // Error states
  const [error, setError] = useState<Error | null>(null);
  const [contactError, setContactError] = useState<Error | null>(null);
  const [submitError, setSubmitError] = useState<Error | null>(null);

  /**
   * Fetch contacts with optional filtering
   */
  const fetchContacts = useCallback(async (
    filters?: { field: string; operator: string; value: any }[],
    sortField?: string,
    sortDirection?: 'asc' | 'desc',
    maxResults?: number
  ): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await contactService.getContacts(
        filters,
        sortField,
        sortDirection,
        maxResults
      );
      setContacts(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch contacts'));
      console.error('Error fetching contacts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch a single contact by ID
   */
  const fetchContactById = useCallback(async (id: string): Promise<void> => {
    setLoadingContact(true);
    setContactError(null);
    
    try {
      const data = await contactService.getContactById(id);
      setSelectedContact(data);
    } catch (err) {
      setContactError(err instanceof Error ? err : new Error('Failed to fetch contact'));
      console.error('Error fetching contact:', err);
    } finally {
      setLoadingContact(false);
    }
  }, []);

  /**
   * Create a new contact
   */
  const createContact = useCallback(async (data: ContactFormData): Promise<string> => {
    setSubmitting(true);
    setSubmitError(null);
    
    try {
      const id = await contactService.createContact(data);
      // Refresh the contacts list
      fetchContacts();
      return id;
    } catch (err) {
      setSubmitError(err instanceof Error ? err : new Error('Failed to create contact'));
      console.error('Error creating contact:', err);
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, [fetchContacts]);

  /**
   * Update an existing contact
   */
  const updateContact = useCallback(async (
    id: string, 
    data: Partial<ContactFormData>
  ): Promise<void> => {
    setSubmitting(true);
    setSubmitError(null);
    
    try {
      await contactService.updateContact(id, data);
      
      // Update the selected contact if it's the one being updated
      if (selectedContact && selectedContact.contactId === id) {
        fetchContactById(id);
      }
      
      // Refresh the contacts list
      fetchContacts();
    } catch (err) {
      setSubmitError(err instanceof Error ? err : new Error('Failed to update contact'));
      console.error('Error updating contact:', err);
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, [fetchContacts, fetchContactById, selectedContact]);

  /**
   * Delete a contact
   */
  const deleteContact = useCallback(async (id: string): Promise<void> => {
    setSubmitting(true);
    setSubmitError(null);
    
    try {
      await contactService.deleteContact(id);
      
      // Clear the selected contact if it's the one being deleted
      if (selectedContact && selectedContact.contactId === id) {
        setSelectedContact(null);
      }
      
      // Refresh the contacts list
      fetchContacts();
    } catch (err) {
      setSubmitError(err instanceof Error ? err : new Error('Failed to delete contact'));
      console.error('Error deleting contact:', err);
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, [fetchContacts, selectedContact]);

  /**
   * Search contacts by name
   */
  const searchContacts = useCallback(async (
    searchTerm: string,
    maxResults: number = 10
  ): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await contactService.searchContactsByName(searchTerm, maxResults);
      setContacts(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to search contacts'));
      console.error('Error searching contacts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Clear the selected contact
   */
  const clearSelectedContact = useCallback((): void => {
    setSelectedContact(null);
  }, []);

  /**
   * Clear all errors
   */
  const clearErrors = useCallback((): void => {
    setError(null);
    setContactError(null);
    setSubmitError(null);
  }, []);

  // Return the hook's API
  return {
    // Data states
    contacts,
    selectedContact,
    
    // Loading states
    loading,
    loadingContact,
    submitting,
    
    // Error states
    error,
    contactError,
    submitError,
    
    // Actions
    fetchContacts,
    fetchContactById,
    createContact,
    updateContact,
    deleteContact,
    searchContacts,
    clearSelectedContact,
    clearErrors
  };
};