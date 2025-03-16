/**
 * useLeads Hook
 * 
 * This custom hook provides functionality for managing leads in the application.
 * It encapsulates the logic for fetching, creating, updating, and deleting leads,
 * as well as handling loading and error states.
 * 
 * The hook allows components to:
 * - Fetch all leads or a specific lead
 * - Create new leads
 * - Update existing leads
 * - Delete leads
 * - Search for leads
 * - Get leads by organisation or contact
 */

import { useState, useCallback } from 'react';
import * as LeadService from '../../services/LeadService';
import { Lead, LeadFormData } from '../../types/Lead';

interface UseLeadsReturn {
  // Data states
  leads: Lead[];
  selectedLead: Lead | null;
  
  // Loading states
  loading: boolean;
  loadingLead: boolean;
  submitting: boolean;
  
  // Error states
  error: Error | null;
  leadError: Error | null;
  submitError: Error | null;
  
  // CRUD operations
  fetchLeads: (filters?: any, sortField?: string, sortDirection?: 'asc' | 'desc', maxResults?: number) => Promise<void>;
  fetchLeadById: (leadId: string) => Promise<void>;
  createLead: (leadData: LeadFormData) => Promise<string>;
  updateLead: (leadId: string, leadData: Partial<LeadFormData>) => Promise<void>;
  deleteLead: (leadId: string) => Promise<void>;
  
  // Search and filter operations
  searchLeads: (searchTerm: string, maxResults?: number) => Promise<void>;
  getLeadsByOrganisation: (organisationId: string) => Promise<void>;
  getLeadsByContact: (contactId: string) => Promise<void>;
}

/**
 * Custom hook for managing leads
 * 
 * @returns Object containing lead data, loading states, error states, and actions
 */
export const useLeads = (): UseLeadsReturn => {
  // Data states
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  
  // Loading states
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingLead, setLoadingLead] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  
  // Error states
  const [error, setError] = useState<Error | null>(null);
  const [leadError, setLeadError] = useState<Error | null>(null);
  const [submitError, setSubmitError] = useState<Error | null>(null);
  
  /**
   * Fetch all leads with optional filters
   */
  const fetchLeads = useCallback(async (
    filters?: any,
    sortField: string = 'createdAt',
    sortDirection: 'asc' | 'desc' = 'desc',
    maxResults?: number
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const fetchedLeads = await LeadService.getLeads(filters, sortField, sortDirection, maxResults);
      setLeads(fetchedLeads);
    } catch (err) {
      console.error('Error fetching leads:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch leads'));
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Fetch a lead by ID
   */
  const fetchLeadById = useCallback(async (leadId: string) => {
    setLoadingLead(true);
    setLeadError(null);
    
    try {
      const lead = await LeadService.getLeadById(leadId);
      setSelectedLead(lead);
    } catch (err) {
      console.error(`Error fetching lead ${leadId}:`, err);
      setLeadError(err instanceof Error ? err : new Error(`Failed to fetch lead ${leadId}`));
    } finally {
      setLoadingLead(false);
    }
  }, []);
  
  /**
   * Create a new lead
   */
  const createLead = useCallback(async (leadData: LeadFormData): Promise<string> => {
    setSubmitting(true);
    setSubmitError(null);
    
    try {
      const leadId = await LeadService.createLead(leadData);
      
      // Refresh the leads list
      await fetchLeads();
      
      return leadId;
    } catch (err) {
      console.error('Error creating lead:', err);
      setSubmitError(err instanceof Error ? err : new Error('Failed to create lead'));
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, [fetchLeads]);
  
  /**
   * Update an existing lead
   */
  const updateLead = useCallback(async (leadId: string, leadData: Partial<LeadFormData>): Promise<void> => {
    setSubmitting(true);
    setSubmitError(null);
    
    try {
      await LeadService.updateLead(leadId, leadData);
      
      // Refresh the selected lead
      if (selectedLead && selectedLead.leadId === leadId) {
        await fetchLeadById(leadId);
      }
      
      // Refresh the leads list
      await fetchLeads();
    } catch (err) {
      console.error(`Error updating lead ${leadId}:`, err);
      setSubmitError(err instanceof Error ? err : new Error(`Failed to update lead ${leadId}`));
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, [fetchLeadById, fetchLeads, selectedLead]);
  
  /**
   * Delete a lead
   */
  const deleteLead = useCallback(async (leadId: string): Promise<void> => {
    setSubmitting(true);
    setSubmitError(null);
    
    try {
      await LeadService.deleteLead(leadId);
      
      // Clear selected lead if it's the one being deleted
      if (selectedLead && selectedLead.leadId === leadId) {
        setSelectedLead(null);
      }
      
      // Refresh the leads list
      await fetchLeads();
    } catch (err) {
      console.error(`Error deleting lead ${leadId}:`, err);
      setSubmitError(err instanceof Error ? err : new Error(`Failed to delete lead ${leadId}`));
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, [fetchLeads, selectedLead]);
  
  /**
   * Search leads by term
   */
  const searchLeads = useCallback(async (searchTerm: string, maxResults: number = 10): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const searchResults = await LeadService.searchLeads(searchTerm, maxResults);
      setLeads(searchResults);
    } catch (err) {
      console.error(`Error searching leads with term "${searchTerm}":`, err);
      setError(err instanceof Error ? err : new Error(`Failed to search leads with term "${searchTerm}"`));
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Get leads by organisation
   */
  const getLeadsByOrganisation = useCallback(async (organisationId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const organisationLeads = await LeadService.getLeadsByOrganisation(organisationId);
      setLeads(organisationLeads);
    } catch (err) {
      console.error(`Error getting leads for organisation ${organisationId}:`, err);
      setError(err instanceof Error ? err : new Error(`Failed to get leads for organisation ${organisationId}`));
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Get leads by contact
   */
  const getLeadsByContact = useCallback(async (contactId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const contactLeads = await LeadService.getLeadsByContact(contactId);
      setLeads(contactLeads);
    } catch (err) {
      console.error(`Error getting leads for contact ${contactId}:`, err);
      setError(err instanceof Error ? err : new Error(`Failed to get leads for contact ${contactId}`));
    } finally {
      setLoading(false);
    }
  }, []);
  
  return {
    // Data states
    leads,
    selectedLead,
    
    // Loading states
    loading,
    loadingLead,
    submitting,
    
    // Error states
    error,
    leadError,
    submitError,
    
    // CRUD operations
    fetchLeads,
    fetchLeadById,
    createLead,
    updateLead,
    deleteLead,
    
    // Search and filter operations
    searchLeads,
    getLeadsByOrganisation,
    getLeadsByContact
  };
};