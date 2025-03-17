/**
 * useQuotesWithOrganisations Hook
 * 
 * This hook provides functionality for managing the relationship between quotes and organisations.
 * It allows linking and unlinking quotes to/from organisations.
 */

import { useState, useCallback } from 'react';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

/**
 * useQuotesWithOrganisations hook interface
 */
export const useQuotesWithOrganisations = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  /**
   * Link a quote to an organisation
   * 
   * @param quoteId - The ID of the quote to link
   * @param organisationId - The ID of the organisation to link to
   * @param organisationName - The name of the organisation (for display purposes)
   */
  const linkQuoteToOrganisation = useCallback(async (
    quoteId: string,
    organisationId: string,
    organisationName: string
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      // Update the quote with the organisation reference
      const quoteRef = doc(db, 'quotes', quoteId);
      
      await updateDoc(quoteRef, {
        organisationId,
        organisationName,
        updatedAt: new Date().toISOString()
      });
      
      return true;
    } catch (err) {
      console.error('Error linking quote to organisation:', err);
      setError(err instanceof Error ? err : new Error('Failed to link quote to organisation'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Unlink a quote from an organisation
   * 
   * @param quoteId - The ID of the quote to unlink
   */
  const unlinkQuoteFromOrganisation = useCallback(async (quoteId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Update the quote to remove the organisation reference
      const quoteRef = doc(db, 'quotes', quoteId);
      
      await updateDoc(quoteRef, {
        organisationId: null,
        organisationName: null,
        updatedAt: new Date().toISOString()
      });
      
      return true;
    } catch (err) {
      console.error('Error unlinking quote from organisation:', err);
      setError(err instanceof Error ? err : new Error('Failed to unlink quote from organisation'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Get all quotes for a specific organisation
   * 
   * @param organisationId - The ID of the organisation to get quotes for
   */
  const getQuotesByOrganisationId = useCallback(async (organisationId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would query Firestore
      // For now, we'll just return a placeholder
      return [];
    } catch (err) {
      console.error('Error getting quotes by organisation ID:', err);
      setError(err instanceof Error ? err : new Error('Failed to get quotes by organisation ID'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  return {
    loading,
    error,
    linkQuoteToOrganisation,
    unlinkQuoteFromOrganisation,
    getQuotesByOrganisationId
  };
};