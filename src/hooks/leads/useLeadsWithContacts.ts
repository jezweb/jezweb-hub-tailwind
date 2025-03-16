/**
 * useLeadsWithContacts Hook
 * 
 * This custom hook provides functionality for managing the relationship
 * between leads and contacts. It encapsulates the logic for linking
 * and unlinking leads to/from contacts.
 */

import { useState, useCallback } from 'react';
import * as LeadService from '../../services/LeadService';

interface ContactDetails {
  fullName: string;
  email: string;
  phone?: string;
  jobTitle?: string;
}

interface UseLeadsWithContactsReturn {
  // Loading and error states
  linking: boolean;
  unlinking: boolean;
  linkError: Error | null;
  unlinkError: Error | null;
  
  // Actions
  linkLeadToContact: (leadId: string, contactId: string, contactDetails: ContactDetails) => Promise<void>;
  unlinkLeadFromContact: (leadId: string, contactId: string) => Promise<void>;
}

/**
 * Custom hook for managing lead-contact relationships
 * 
 * @returns Object containing loading states, error states, and actions
 */
export const useLeadsWithContacts = (): UseLeadsWithContactsReturn => {
  // Loading states
  const [linking, setLinking] = useState<boolean>(false);
  const [unlinking, setUnlinking] = useState<boolean>(false);
  
  // Error states
  const [linkError, setLinkError] = useState<Error | null>(null);
  const [unlinkError, setUnlinkError] = useState<Error | null>(null);
  
  /**
   * Link a lead to a contact
   * @param leadId - The ID of the lead to link
   * @param contactId - The ID of the contact to link to
   * @param contactDetails - The details of the contact to link to
   */
  const linkLeadToContact = useCallback(async (
    leadId: string,
    contactId: string,
    contactDetails: ContactDetails
  ): Promise<void> => {
    setLinking(true);
    setLinkError(null);
    
    try {
      // Get the current lead
      const lead = await LeadService.getLeadById(leadId);
      
      if (!lead) {
        throw new Error(`Lead ${leadId} not found`);
      }
      
      // Get the current contact IDs or initialize an empty array
      const contactIds = lead.contactIds || [];
      
      // Check if the contact is already linked
      if (contactIds.includes(contactId)) {
        // Contact already linked, no need to update
        return;
      }
      
      // Add the contact ID to the array
      const updatedContactIds = [...contactIds, contactId];
      
      // Update the lead with the new contact IDs
      await LeadService.updateLead(leadId, {
        contactIds: updatedContactIds
      });
    } catch (err) {
      console.error(`Error linking lead ${leadId} to contact ${contactId}:`, err);
      setLinkError(err instanceof Error ? err : new Error(`Failed to link lead to contact`));
      throw err;
    } finally {
      setLinking(false);
    }
  }, []);
  
  /**
   * Unlink a lead from a contact
   * @param leadId - The ID of the lead to unlink
   * @param contactId - The ID of the contact to unlink from
   */
  const unlinkLeadFromContact = useCallback(async (
    leadId: string,
    contactId: string
  ): Promise<void> => {
    setUnlinking(true);
    setUnlinkError(null);
    
    try {
      // Get the current lead
      const lead = await LeadService.getLeadById(leadId);
      
      if (!lead) {
        throw new Error(`Lead ${leadId} not found`);
      }
      
      // Get the current contact IDs or initialize an empty array
      const contactIds = lead.contactIds || [];
      
      // Check if the contact is linked
      if (!contactIds.includes(contactId)) {
        // Contact not linked, no need to update
        return;
      }
      
      // Remove the contact ID from the array
      const updatedContactIds = contactIds.filter(id => id !== contactId);
      
      // Update the lead with the new contact IDs
      await LeadService.updateLead(leadId, {
        contactIds: updatedContactIds
      });
    } catch (err) {
      console.error(`Error unlinking lead ${leadId} from contact ${contactId}:`, err);
      setUnlinkError(err instanceof Error ? err : new Error(`Failed to unlink lead from contact`));
      throw err;
    } finally {
      setUnlinking(false);
    }
  }, []);
  
  return {
    // Loading and error states
    linking,
    unlinking,
    linkError,
    unlinkError,
    
    // Actions
    linkLeadToContact,
    unlinkLeadFromContact
  };
};