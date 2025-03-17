/**
 * QuoteCardWithDesignSystem Component
 * 
 * This is an example of the QuoteCard component refactored to use the design system components.
 * It demonstrates how to use the design system to create a consistent UI for displaying quotes in a card format.
 */

import React from 'react';
import { Quote } from '../../../types/Quote';
import { formatDate, formatCurrency } from '../../../utils/formatters';

// Import design system components
import { 
  Card, 
  StatusBadge, 
  InfoItem,
  ActionButton
} from '../../../components/ui/design-system';

interface QuoteCardWithDesignSystemProps {
  /** The quote data to display */
  quote: Quote;
  
  /** Callback function for viewing the quote */
  onViewQuote: (quoteId: string) => void;
  
  /** Callback function for editing the quote */
  onEditQuote: (quoteId: string) => void;
  
  /** Callback function for deleting the quote */
  onDeleteQuote: (quoteId: string) => void;
}

/**
 * QuoteCardWithDesignSystem component
 * 
 * This component demonstrates how to use the design system components
 * to create a consistent UI for displaying quotes in a card format.
 */
const QuoteCardWithDesignSystem: React.FC<QuoteCardWithDesignSystemProps> = ({
  quote,
  onViewQuote,
  onEditQuote,
  onDeleteQuote
}) => {
  // Handle view quote action
  const handleView = () => {
    onViewQuote(quote.quoteId);
  };
  
  // Handle edit quote action
  const handleEdit = () => {
    onEditQuote(quote.quoteId);
  };
  
  // Handle delete quote action
  const handleDelete = () => {
    onDeleteQuote(quote.quoteId);
  };
  
  return (
    <Card
      className="h-full"
      header={
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate" title={quote.subject}>
            {quote.subject}
          </h3>
          <StatusBadge status={quote.status} />
        </div>
      }
      footer={
        <div className="flex justify-between">
          <ActionButton
            variant="secondary"
            size="small"
            onClick={handleView}
            iconBefore={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            }
          >
            View
          </ActionButton>
          
          <div className="space-x-2">
            <ActionButton
              variant="light"
              size="small"
              onClick={handleEdit}
              iconBefore={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              }
            >
              Edit
            </ActionButton>
            
            <ActionButton
              variant="danger"
              size="small"
              onClick={handleDelete}
              iconBefore={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              }
            >
              Delete
            </ActionButton>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Organisation */}
        {quote.organisationId && quote.organisationName && (
          <InfoItem
            label="Organisation"
            value={quote.organisationName}
            emphasized
          />
        )}
        
        {/* Quote ID */}
        <InfoItem
          label="Quote ID"
          value={quote.quoteNumber || `Q-${quote.quoteId.substring(0, 8)}`}
        />
        
        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <InfoItem
            label="Quote Date"
            value={formatDate(quote.quoteDate)}
          />
          
          <InfoItem
            label="Expiry Date"
            value={formatDate(quote.expiryDate)}
          />
        </div>
        
        {/* Items and Total */}
        <div className="grid grid-cols-2 gap-4">
          <InfoItem
            label="Items"
            value={quote.items?.length || 0}
          />
          
          <InfoItem
            label="Total"
            value={formatCurrency(quote.total || 0)}
            emphasized
          />
        </div>
      </div>
    </Card>
  );
};

export default QuoteCardWithDesignSystem;