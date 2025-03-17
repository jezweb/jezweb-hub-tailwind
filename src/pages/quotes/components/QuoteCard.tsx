/**
 * QuoteCard Component
 * 
 * This component displays a quote in a card format with key information
 * and action buttons for viewing, editing, and deleting quotes.
 */

import React from 'react';
import { Quote, QuoteStatus } from '../../../types/Quote';
import { formatCurrency, formatDate } from '../../../utils/formatters';

interface QuoteCardProps {
  quote: Quote;
  onViewQuote: (quoteId: string) => void;
  onEditQuote: (quoteId: string) => void;
  onDeleteQuote: (quoteId: string) => void;
}

/**
 * QuoteCard component
 */
const QuoteCard: React.FC<QuoteCardProps> = ({
  quote,
  onViewQuote,
  onEditQuote,
  onDeleteQuote
}) => {
  // Get status color based on status
  const getStatusColor = (status: QuoteStatus): string => {
    switch (status) {
      case QuoteStatus.DRAFT:
        return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case QuoteStatus.SENT:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case QuoteStatus.ACCEPTED:
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case QuoteStatus.REJECTED:
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case QuoteStatus.EXPIRED:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      default:
        return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };
  
  // Get status label with proper formatting
  const getStatusLabel = (status: QuoteStatus): string => {
    switch (status) {
      case QuoteStatus.DRAFT:
        return 'Draft';
      case QuoteStatus.SENT:
        return 'Sent';
      case QuoteStatus.ACCEPTED:
        return 'Accepted';
      case QuoteStatus.REJECTED:
        return 'Rejected';
      case QuoteStatus.EXPIRED:
        return 'Expired';
      default:
        return 'Unknown';
    }
  };
  
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {quote.quoteNumber}
          </h3>
          <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(quote.status)}`}>
            {getStatusLabel(quote.status)}
          </span>
        </div>
      </div>
      
      <div className="px-4 py-3">
        <div className="mb-4">
          <h4 className="text-base font-medium text-gray-900 dark:text-white">
            {quote.subject}
          </h4>
          
          {quote.organisationName && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {quote.organisationName}
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Date</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {formatDate(quote.quoteDate)}
            </p>
          </div>
          
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Expiry</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {formatDate(quote.expiryDate)}
            </p>
          </div>
          
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Items</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {quote.items.length}
            </p>
          </div>
          
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {formatCurrency(quote.total)}
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => onViewQuote(quote.quoteId)}
          className="flex flex-1 items-center justify-center border-r border-gray-200 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:border-gray-700 dark:text-blue-400 dark:hover:bg-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          View
        </button>
        
        <button
          onClick={() => onEditQuote(quote.quoteId)}
          className="flex flex-1 items-center justify-center border-r border-gray-200 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 dark:border-gray-700 dark:text-indigo-400 dark:hover:bg-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit
        </button>
        
        <button
          onClick={() => onDeleteQuote(quote.quoteId)}
          className="flex flex-1 items-center justify-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete
        </button>
      </div>
    </div>
  );
};

export default QuoteCard;