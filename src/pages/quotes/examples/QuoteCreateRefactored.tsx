/**
 * QuoteCreate Page (Refactored)
 * 
 * This is an example of how to refactor the QuoteCreate page to use the design system components.
 * It demonstrates the use of standardized components for consistent styling.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuotes } from '../../../hooks/quotes/useQuotes';
import QuoteForm from '../components/QuoteForm';
import { QuoteFormData } from '../../../types/Quote';
import {
  QuoteContainer,
  QuoteHeading,
  QuoteErrorMessage,
  QuoteFormSection
} from '../../../components/quotes/design-system';

/**
 * QuoteCreateRefactored component
 * 
 * This is a refactored version of the QuoteCreate component using the design system.
 */
const QuoteCreateRefactored: React.FC = () => {
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
    <QuoteContainer>
      <QuoteHeading
        title="Create Quote"
        description="Create a new quote or proposal for a client"
        backLink={{
          to: '/quotes',
          label: 'Back to Quotes',
          onClick: () => navigate('/quotes')
        }}
      />
      
      {/* Error Message */}
      {(error || submitError) && (
        <QuoteErrorMessage
          title="Error creating quote"
          message={error || (submitError && submitError.message) || 'An unexpected error occurred'}
        />
      )}
      
      {/* Quote Form */}
      <QuoteFormSection title="Quote Details">
        <QuoteForm
          isSubmitting={submitting}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </QuoteFormSection>
    </QuoteContainer>
  );
};

export default QuoteCreateRefactored;