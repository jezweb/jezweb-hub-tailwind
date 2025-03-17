/**
 * useQuotesWithLeads Hook
 * 
 * This hook provides functionality for managing the relationship between quotes and leads.
 * It allows linking and unlinking quotes to/from leads.
 */

import { useState, useCallback } from 'react';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

/**
 * useQuotesWithLeads hook interface
 */
export const useQuotesWithLeads = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  /**
   * Link a quote to a lead
   * 
   * @param quoteId - The ID of the quote to link
   * @param leadId - The ID of the lead to link to
   * @param leadName - The name of the lead (for display purposes)
   */
  const linkQuoteToLead = useCallback(async (
    quoteId: string,
    leadId: string,
    leadName: string
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      // Update the quote with the lead reference
      const quoteRef = doc(db, 'quotes', quoteId);
      
      await updateDoc(quoteRef, {
        leadId,
        leadName,
        updatedAt: new Date().toISOString()
      });
      
      return true;
    } catch (err) {
      console.error('Error linking quote to lead:', err);
      setError(err instanceof Error ? err : new Error('Failed to link quote to lead'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Unlink a quote from a lead
   * 
   * @param quoteId - The ID of the quote to unlink
   */
  const unlinkQuoteFromLead = useCallback(async (quoteId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Update the quote to remove the lead reference
      const quoteRef = doc(db, 'quotes', quoteId);
      
      await updateDoc(quoteRef, {
        leadId: null,
        leadName: null,
        updatedAt: new Date().toISOString()
      });
      
      return true;
    } catch (err) {
      console.error('Error unlinking quote from lead:', err);
      setError(err instanceof Error ? err : new Error('Failed to unlink quote from lead'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Get all quotes for a specific lead
   * 
   * @param leadId - The ID of the lead to get quotes for
   */
  const getQuotesByLeadId = useCallback(async (leadId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would query Firestore
      // For now, we'll just return a placeholder
      return [];
    } catch (err) {
      console.error('Error getting quotes by lead ID:', err);
      setError(err instanceof Error ? err : new Error('Failed to get quotes by lead ID'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  return {
    loading,
    error,
    linkQuoteToLead,
    unlinkQuoteFromLead,
    getQuotesByLeadId
  };
};