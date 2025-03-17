/**
 * QuoteEdit Page
 * 
 * This page provides a form for editing an existing quote.
 * It fetches the quote data, populates the form, and handles form submission.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuotes } from '../../hooks/quotes/useQuotes';
import QuoteForm from './components/QuoteForm';
import { QuoteFormData } from '../../types/Quote';

/**
 * QuoteEdit component
 */
const QuoteEdit: React.FC = () => {
  const { quoteId } = useParams<{ quoteId: string }>();
  const navigate = useNavigate();
  
  const {
    selectedQuote,
    loadingQuote,
    quoteError,
    submitting,
    submitError,
    fetchQuoteById,
    updateQuote
  } = useQuotes();
  
  const [error, setError] = useState<string | null>(null);
  
  // Fetch quote data on component mount
  useEffect(() => {
    if (quoteId) {
      fetchQuoteById(quoteId);
    }
  }, [quoteId, fetchQuoteById]);
  
  // Handle form submission
  const handleSubmit = async (data: QuoteFormData) => {
    if (!quoteId) return;
    
    try {
      setError(null);
      await updateQuote(quoteId, data);
      
      // Navigate to the quote view page after successful update
      navigate(`/quotes/${quoteId}`);
    } catch (err) {
      console.error('Error updating quote:', err);
      setError('Failed to update quote. Please try again.');
    }
  };
  
  // Handle cancel action
  const handleCancel = () => {
    navigate(`/quotes/${quoteId}`);
  };
  
  // Show loading state
  if (loadingQuote) {
    return (
      <div className="container mx-auto flex items-center justify-center px-4 py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900 dark:border-white"></div>
        <span className="ml-2">Loading quote data...</span>
      </div>
    );
  }
  
  // Show error state
  if (quoteError || !selectedQuote) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center dark:border-red-700 dark:bg-red-900/20">
          <h2 className="mb-2 text-xl font-bold text-red-800 dark:text-red-200">Error Loading Quote</h2>
          <p className="text-red-700 dark:text-red-300">
            {quoteError?.message || 'Quote not found'}
          </p>
          <button
            onClick={() => navigate('/quotes')}
            className="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Back to Quotes
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Quote</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Update quote information for {selectedQuote.subject}
        </p>
      </div>
      
      {/* Error Message */}
      {(error || submitError) && (
        <div className="mb-6 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400 dark:text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error updating quote</h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                <p>{error || (submitError && submitError.message) || 'An unexpected error occurred'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Quote Form */}
      <QuoteForm
        quote={selectedQuote}
        isSubmitting={submitting}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default QuoteEdit;