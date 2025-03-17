/**
 * QuoteCard Component
 * 
 * A standardized card component for displaying quote information in a card layout.
 * This component ensures consistent styling for quote cards across the quotes module.
 */

import React from 'react';
import { Quote, QuoteStatus } from '../../../types/Quote';
import { formatDate, formatCurrency } from '../../../utils/formatters';
import { QuoteStatusBadge } from './QuoteStatusBadge';
import { QuoteActionButton } from './QuoteActionButton';

interface QuoteCardProps {
  quote: Quote;
  onViewQuote?: (quoteId: string) => void;
  onEditQuote?: (quoteId: string) => void;
  onDeleteQuote?: (quoteId: string) => void;
  className?: string;
}

/**
 * QuoteCard component
 * 
 * @param {Quote} quote - The quote data to display
 * @param {Function} onViewQuote - Handler for viewing a quote
 * @param {Function} onEditQuote - Handler for editing a quote
 * @param {Function} onDeleteQuote - Handler for deleting a quote
 * @param {string} className - Additional CSS classes
 */
export const QuoteCard: React.FC<QuoteCardProps> = ({
  quote,
  onViewQuote,
  onEditQuote,
  onDeleteQuote,
  className = ''
}) => {
  return (
    <div className={`rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 ${className}`}>
      {/* Card Header */}
      <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {quote.subject || 'Untitled Quote'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Quote #{quote.quoteNumber || quote.quoteId}
            </p>
          </div>
          <QuoteStatusBadge status={quote.status} />
        </div>
      </div>
      
      {/* Card Content */}
      <div className="px-4 py-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">
              Date
            </span>
            <span className="block text-sm text-gray-900 dark:text-white">
              {formatDate(quote.quoteDate)}
            </span>
          </div>
          
          <div>
            <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">
              Expiry
            </span>
            <span className="block text-sm text-gray-900 dark:text-white">
              {formatDate(quote.expiryDate)}
            </span>
          </div>
          
          <div>
            <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">
              Items
            </span>
            <span className="block text-sm text-gray-900 dark:text-white">
              {quote.items?.length || 0}
            </span>
          </div>
          
          <div>
            <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">
              Total
            </span>
            <span className="block text-sm font-medium text-gray-900 dark:text-white">
              {formatCurrency(quote.total || 0)}
            </span>
          </div>
        </div>
        
        {quote.organisationId && (
          <div className="mt-3">
            <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">
              Organisation
            </span>
            <span className="block text-sm text-gray-900 dark:text-white">
              {quote.organisationName || quote.organisationId}
            </span>
          </div>
        )}
      </div>
      
      {/* Card Footer */}
      <div className="flex justify-end space-x-2 border-t border-gray-200 px-4 py-3 dark:border-gray-700">
        {onViewQuote && (
          <QuoteActionButton
            variant="outline"
            onClick={() => onViewQuote(quote.quoteId)}
            title="View quote details"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="ml-1">View</span>
          </QuoteActionButton>
        )}
        
        {onEditQuote && (
          <QuoteActionButton
            variant="secondary"
            onClick={() => onEditQuote(quote.quoteId)}
            title="Edit quote"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span className="ml-1">Edit</span>
          </QuoteActionButton>
        )}
        
        {onDeleteQuote && (
          <QuoteActionButton
            variant="danger"
            onClick={() => onDeleteQuote(quote.quoteId)}
            title="Delete quote"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span className="ml-1">Delete</span>
          </QuoteActionButton>
        )}
      </div>
    </div>
  );
};