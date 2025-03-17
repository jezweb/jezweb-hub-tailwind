/**
 * QuoteCreateWithDesignSystem Page
 * 
 * This is an example of the QuoteCreate page refactored to use the design system components.
 * It demonstrates how to use the design system to create a consistent UI.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuotes } from '../../../hooks/quotes/useQuotes';
import QuoteForm from '../components/QuoteForm';
import { QuoteFormData } from '../../../types/Quote';

// Import design system components
import { 
  Container, 
  PageHeading, 
  ErrorMessage,
  ActionButton
} from '../../../components/ui/design-system';

/**
 * QuoteCreateWithDesignSystem component
 * 
 * This component demonstrates how to use the design system components
 * to create a consistent UI for the quote creation page.
 */
const QuoteCreateWithDesignSystem: React.FC = () => {
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
  
  // Handle retry action
  const handleRetry = () => {
    setError(null);
  };
  
  return (
    <Container>
      <PageHeading
        title="Create Quote"
        description="Create a new quote or proposal for a client"
        backLink={{
          to: '/quotes',
          label: 'Back to Quotes'
        }}
      />
      
      {/* Error Message */}
      {(error || submitError) && (
        <ErrorMessage
          title="Error creating quote"
          message={error || (submitError && submitError.message) || 'An unexpected error occurred'}
          onRetry={handleRetry}
        />
      )}
      
      {/* Quote Form */}
      <QuoteForm
        isSubmitting={submitting}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </Container>
  );
};

export default QuoteCreateWithDesignSystem;