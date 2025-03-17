/**
 * useQuotesWithContacts Hook
 * 
 * This hook provides functionality for managing the relationship between quotes and contacts.
 * It allows linking and unlinking quotes to/from contacts.
 */

import { useState, useCallback } from 'react';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

/**
 * useQuotesWithContacts hook interface
 */
export const useQuotesWithContacts = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  /**
   * Link a quote to a contact
   * 
   * @param quoteId - The ID of the quote to link
   * @param contactId - The ID of the contact to link to
   * @param contactName - The name of the contact (for display purposes)
   */
  const linkQuoteToContact = useCallback(async (
    quoteId: string,
    contactId: string,
    contactName: string
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      // Update the quote with the contact reference
      const quoteRef = doc(db, 'quotes', quoteId);
      
      await updateDoc(quoteRef, {
        contactId,
        contactName,
        updatedAt: new Date().toISOString()
      });
      
      return true;
    } catch (err) {
      console.error('Error linking quote to contact:', err);
      setError(err instanceof Error ? err : new Error('Failed to link quote to contact'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Unlink a quote from a contact
   * 
   * @param quoteId - The ID of the quote to unlink
   */
  const unlinkQuoteFromContact = useCallback(async (quoteId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Update the quote to remove the contact reference
      const quoteRef = doc(db, 'quotes', quoteId);
      
      await updateDoc(quoteRef, {
        contactId: null,
        contactName: null,
        updatedAt: new Date().toISOString()
      });
      
      return true;
    } catch (err) {
      console.error('Error unlinking quote from contact:', err);
      setError(err instanceof Error ? err : new Error('Failed to unlink quote from contact'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Get all quotes for a specific contact
   * 
   * @param contactId - The ID of the contact to get quotes for
   */
  const getQuotesByContactId = useCallback(async (contactId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would query Firestore
      // For now, we'll just return a placeholder
      return [];
    } catch (err) {
      console.error('Error getting quotes by contact ID:', err);
      setError(err instanceof Error ? err : new Error('Failed to get quotes by contact ID'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  return {
    loading,
    error,
    linkQuoteToContact,
    unlinkQuoteFromContact,
    getQuotesByContactId
  };
};