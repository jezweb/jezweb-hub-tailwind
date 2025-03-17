/**
 * QuoteCreate Page
 * 
 * This page provides a form for creating a new quote.
 * It uses the QuoteForm component and handles form submission.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuotes } from '../../hooks/quotes/useQuotes';
import QuoteForm from './components/QuoteForm';
import { QuoteFormData } from '../../types/Quote';

/**
 * QuoteCreate component
 */
const QuoteCreate: React.FC = () => {
  const navigate = useNavigate();
  const { createQuote, submitting, submitError } = useQuotes();
  const [error, setError] = useState<string | null>(null);
  
  // Handle form submission
  const handleSubmit = async (data: QuoteFormData) => {
    try {
      setError(null);
      const quoteId = await createQuote(data);
      
      // Navigate to the quote view page after successful creation
      navigate(`/quotes/${quoteId}`);
    } catch (err) {
      console.error('Error creating quote:', err);
      setError('Failed to create quote. Please try again.');
    }
  };
  
  // Handle cancel action
  const handleCancel = () => {
    navigate('/quotes');
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Quote</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Create a new quote or proposal for a client
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
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error creating quote</h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                <p>{error || (submitError && submitError.message) || 'An unexpected error occurred'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Quote Form */}
      <QuoteForm
        isSubmitting={submitting}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default QuoteCreate;