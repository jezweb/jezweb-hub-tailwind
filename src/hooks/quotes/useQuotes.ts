/**
 * useQuotes Hook
 * 
 * This hook provides functionality for managing quotes in the application.
 * It handles CRUD operations, status updates, and search functionality.
 */

import { useState, useCallback } from 'react';
import { QuoteService } from '../../services/QuoteService';
import { Quote, QuoteFormData, QuoteStatus } from '../../types/Quote';

/**
 * useQuotes hook interface
 */
export const useQuotes = () => {
  // State for quotes data
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingQuote, setLoadingQuote] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [quoteError, setQuoteError] = useState<Error | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<Error | null>(null);
  
  /**
   * Fetch all quotes with optional filters and sorting
   */
  const fetchQuotes = useCallback(async (
    filters: Record<string, any> = {},
    sortField: string = 'createdAt',
    sortDirection: 'asc' | 'desc' = 'desc'
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const fetchedQuotes = await QuoteService.getAllQuotes(filters, sortField, sortDirection);
      setQuotes(fetchedQuotes);
    } catch (err) {
      console.error('Error fetching quotes:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch quotes'));
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Fetch a quote by ID
   */
  const fetchQuoteById = useCallback(async (quoteId: string) => {
    setLoadingQuote(true);
    setQuoteError(null);
    
    try {
      const quote = await QuoteService.getQuoteById(quoteId);
      setSelectedQuote(quote);
    } catch (err) {
      console.error('Error fetching quote:', err);
      setQuoteError(err instanceof Error ? err : new Error('Failed to fetch quote'));
    } finally {
      setLoadingQuote(false);
    }
  }, []);
  
  /**
   * Create a new quote
   */
  const createQuote = useCallback(async (data: QuoteFormData) => {
    setSubmitting(true);
    setSubmitError(null);
    
    try {
      const quoteId = await QuoteService.createQuote(data);
      
      // Fetch the newly created quote
      const newQuote = await QuoteService.getQuoteById(quoteId);
      
      // Update the quotes list
      setQuotes(prevQuotes => newQuote ? [...prevQuotes, newQuote] : prevQuotes);
      
      return quoteId;
    } catch (err) {
      console.error('Error creating quote:', err);
      setSubmitError(err instanceof Error ? err : new Error('Failed to create quote'));
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, []);
  
  /**
   * Update an existing quote
   */
  const updateQuote = useCallback(async (quoteId: string, data: QuoteFormData) => {
    setSubmitting(true);
    setSubmitError(null);
    
    try {
      await QuoteService.updateQuote(quoteId, data);
      
      // Fetch the updated quote
      const updatedQuote = await QuoteService.getQuoteById(quoteId);
      
      // Update the selected quote if it's the one being edited
      if (selectedQuote && selectedQuote.quoteId === quoteId) {
        setSelectedQuote(updatedQuote);
      }
      
      // Update the quotes list
      setQuotes(prevQuotes => 
        prevQuotes.map(quote => 
          quote.quoteId === quoteId && updatedQuote ? updatedQuote : quote
        )
      );
    } catch (err) {
      console.error('Error updating quote:', err);
      setSubmitError(err instanceof Error ? err : new Error('Failed to update quote'));
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, [selectedQuote]);
  
  /**
   * Update quote status
   */
  const updateQuoteStatus = useCallback(async (quoteId: string, status: QuoteStatus) => {
    setSubmitting(true);
    setSubmitError(null);
    
    try {
      await QuoteService.updateQuoteStatus(quoteId, status);
      
      // Update the selected quote if it's the one being updated
      if (selectedQuote && selectedQuote.quoteId === quoteId) {
        setSelectedQuote(prev => prev ? { ...prev, status } : null);
      }
      
      // Update the quotes list
      setQuotes(prevQuotes => 
        prevQuotes.map(quote => 
          quote.quoteId === quoteId ? { ...quote, status } : quote
        )
      );
    } catch (err) {
      console.error('Error updating quote status:', err);
      setSubmitError(err instanceof Error ? err : new Error('Failed to update quote status'));
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, [selectedQuote]);
  
  /**
   * Delete a quote
   */
  const deleteQuote = useCallback(async (quoteId: string) => {
    setSubmitting(true);
    setSubmitError(null);
    
    try {
      await QuoteService.deleteQuote(quoteId);
      
      // Clear the selected quote if it's the one being deleted
      if (selectedQuote && selectedQuote.quoteId === quoteId) {
        setSelectedQuote(null);
      }
      
      // Update the quotes list
      setQuotes(prevQuotes => prevQuotes.filter(quote => quote.quoteId !== quoteId));
    } catch (err) {
      console.error('Error deleting quote:', err);
      setSubmitError(err instanceof Error ? err : new Error('Failed to delete quote'));
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, [selectedQuote]);
  
  /**
   * Generate PDF from quote
   */
  const generateQuotePDF = useCallback(async (quoteId: string) => {
    try {
      const pdfUrl = await QuoteService.generateQuotePDF(quoteId);
      return pdfUrl;
    } catch (err) {
      console.error('Error generating quote PDF:', err);
      throw err;
    }
  }, []);
  
  /**
   * Send quote to client
   */
  const sendQuote = useCallback(async (quoteId: string) => {
    setSubmitting(true);
    setSubmitError(null);
    
    try {
      await QuoteService.sendQuote(quoteId);
      
      // Update the selected quote if it's the one being sent
      if (selectedQuote && selectedQuote.quoteId === quoteId) {
        setSelectedQuote(prev => prev ? { ...prev, status: QuoteStatus.SENT } : null);
      }
      
      // Update the quotes list
      setQuotes(prevQuotes => 
        prevQuotes.map(quote => 
          quote.quoteId === quoteId ? { ...quote, status: QuoteStatus.SENT } : quote
        )
      );
    } catch (err) {
      console.error('Error sending quote:', err);
      setSubmitError(err instanceof Error ? err : new Error('Failed to send quote'));
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, [selectedQuote]);
  
  /**
   * Search quotes by keyword
   */
  const searchQuotes = useCallback(async (keyword: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // For now, we'll just filter the quotes client-side
      // In a real implementation, this would call a server-side search
      const filteredQuotes = quotes.filter(quote => 
        quote.subject.toLowerCase().includes(keyword.toLowerCase()) ||
        quote.quoteNumber.toLowerCase().includes(keyword.toLowerCase())
      );
      
      setQuotes(filteredQuotes);
    } catch (err) {
      console.error('Error searching quotes:', err);
      setError(err instanceof Error ? err : new Error('Failed to search quotes'));
    } finally {
      setLoading(false);
    }
  }, [quotes]);
  
  return {
    quotes,
    selectedQuote,
    loading,
    loadingQuote,
    error,
    quoteError,
    submitting,
    submitError,
    fetchQuotes,
    fetchQuoteById,
    createQuote,
    updateQuote,
    updateQuoteStatus,
    deleteQuote,
    generateQuotePDF,
    sendQuote,
    searchQuotes
  };
};