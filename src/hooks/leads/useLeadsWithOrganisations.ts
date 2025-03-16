/**
 * useLeadsWithOrganisations Hook
 * 
 * This custom hook provides functionality for managing the relationship
 * between leads and organisations. It encapsulates the logic for linking
 * and unlinking leads to/from organisations.
 */

import { useState, useCallback } from 'react';
import * as LeadService from '../../services/LeadService';

interface UseLeadsWithOrganisationsReturn {
  // Loading and error states
  linking: boolean;
  unlinking: boolean;
  linkError: Error | null;
  unlinkError: Error | null;
  
  // Actions
  linkLeadToOrganisation: (leadId: string, organisationId: string, organisationName: string) => Promise<void>;
  unlinkLeadFromOrganisation: (leadId: string) => Promise<void>;
}

/**
 * Custom hook for managing lead-organisation relationships
 * 
 * @returns Object containing loading states, error states, and actions
 */
export const useLeadsWithOrganisations = (): UseLeadsWithOrganisationsReturn => {
  // Loading states
  const [linking, setLinking] = useState<boolean>(false);
  const [unlinking, setUnlinking] = useState<boolean>(false);
  
  // Error states
  const [linkError, setLinkError] = useState<Error | null>(null);
  const [unlinkError, setUnlinkError] = useState<Error | null>(null);
  
  /**
   * Link a lead to an organisation
   * @param leadId - The ID of the lead to link
   * @param organisationId - The ID of the organisation to link to
   * @param organisationName - The name of the organisation to link to
   */
  const linkLeadToOrganisation = useCallback(async (
    leadId: string,
    organisationId: string,
    organisationName: string
  ): Promise<void> => {
    setLinking(true);
    setLinkError(null);
    
    try {
      // Update the lead with the organisation information
      await LeadService.updateLead(leadId, {
        organisationId,
        organisationName
      });
    } catch (err) {
      console.error(`Error linking lead ${leadId} to organisation ${organisationId}:`, err);
      setLinkError(err instanceof Error ? err : new Error(`Failed to link lead to organisation`));
      throw err;
    } finally {
      setLinking(false);
    }
  }, []);
  
  /**
   * Unlink a lead from its organisation
   * @param leadId - The ID of the lead to unlink
   */
  const unlinkLeadFromOrganisation = useCallback(async (leadId: string): Promise<void> => {
    setUnlinking(true);
    setUnlinkError(null);
    
    try {
      // Update the lead to remove the organisation information
      await LeadService.updateLead(leadId, {
        organisationId: null,
        organisationName: null
      });
    } catch (err) {
      console.error(`Error unlinking lead ${leadId} from organisation:`, err);
      setUnlinkError(err instanceof Error ? err : new Error(`Failed to unlink lead from organisation`));
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
    linkLeadToOrganisation,
    unlinkLeadFromOrganisation
  };
};