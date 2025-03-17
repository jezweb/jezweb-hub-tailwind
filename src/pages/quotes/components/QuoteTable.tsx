/**
 * QuoteTable Component
 * 
 * This component displays quotes in a table format with sorting, filtering,
 * and action buttons for viewing, editing, and deleting quotes.
 */

import React from 'react';
import { Quote, QuoteStatus } from '../../../types/Quote';
import { formatCurrency, formatDate } from '../../../utils/formatters';

interface QuoteTableProps {
  quotes: Quote[];
  isLoading: boolean;
  onViewQuote: (quoteId: string) => void;
  onEditQuote: (quoteId: string) => void;
  onDeleteQuote: (quoteId: string) => void;
  onSort?: (field: string) => void;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
}

/**
 * QuoteTable component
 */
const QuoteTable: React.FC<QuoteTableProps> = ({
  quotes,
  isLoading,
  onViewQuote,
  onEditQuote,
  onDeleteQuote,
  onSort,
  sortField,
  sortDirection
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
  
  // Handle sort click
  const handleSortClick = (field: string) => {
    if (onSort) {
      onSort(field);
    }
  };
  
  // Render sort indicator
  const renderSortIndicator = (field: string) => {
    if (sortField !== field) {
      return null;
    }
    
    return (
      <span className="ml-1 inline-block">
        {sortDirection === 'asc' ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </span>
    );
  };
  
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
              onClick={() => handleSortClick('quoteNumber')}
            >
              <div className="flex cursor-pointer items-center">
                Quote #
                {renderSortIndicator('quoteNumber')}
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
              onClick={() => handleSortClick('subject')}
            >
              <div className="flex cursor-pointer items-center">
                Subject
                {renderSortIndicator('subject')}
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
              onClick={() => handleSortClick('organisationName')}
            >
              <div className="flex cursor-pointer items-center">
                Organisation
                {renderSortIndicator('organisationName')}
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
              onClick={() => handleSortClick('total')}
            >
              <div className="flex cursor-pointer items-center">
                Total
                {renderSortIndicator('total')}
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
              onClick={() => handleSortClick('quoteDate')}
            >
              <div className="flex cursor-pointer items-center">
                Date
                {renderSortIndicator('quoteDate')}
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
              onClick={() => handleSortClick('status')}
            >
              <div className="flex cursor-pointer items-center">
                Status
                {renderSortIndicator('status')}
              </div>
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
          {isLoading ? (
            <tr>
              <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center justify-center">
                  <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-gray-900 dark:border-white"></div>
                  <span className="ml-2">Loading quotes...</span>
                </div>
              </td>
            </tr>
          ) : quotes.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                No quotes found
              </td>
            </tr>
          ) : (
            quotes.map((quote) => (
              <tr key={quote.quoteId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                  {quote.quoteNumber}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                  {quote.subject}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                  {quote.organisationName || '-'}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                  {formatCurrency(quote.total)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                  {formatDate(quote.quoteDate)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(quote.status)}`}>
                    {getStatusLabel(quote.status)}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => onViewQuote(quote.quoteId)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      title="View quote"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onEditQuote(quote.quoteId)}
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                      title="Edit quote"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDeleteQuote(quote.quoteId)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      title="Delete quote"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default QuoteTable;