/**
 * QuoteStatusUpdate Component
 * 
 * This component provides a UI for updating the status of a quote.
 * It displays the current status and allows the user to change it.
 */

import React, { useState } from 'react';
import { useQuotes } from '../../../hooks/quotes/useQuotes';
import { Quote, QuoteStatus } from '../../../types/Quote';

interface QuoteStatusUpdateProps {
  quote: Quote;
  onStatusUpdate?: (quoteId: string, newStatus: QuoteStatus) => void;
}

/**
 * QuoteStatusUpdate component
 */
const QuoteStatusUpdate: React.FC<QuoteStatusUpdateProps> = ({ quote, onStatusUpdate }) => {
  const { updateQuoteStatus, submitting } = useQuotes();
  const [status, setStatus] = useState<QuoteStatus>(quote.status);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
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
  
  // Handle status change
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value as QuoteStatus);
  };
  
  // Handle status update
  const handleUpdateStatus = async () => {
    if (status === quote.status) {
      return; // No change
    }
    
    setIsUpdating(true);
    setError(null);
    
    try {
      await updateQuoteStatus(quote.quoteId, status);
      
      // Call the onStatusUpdate callback if provided
      if (onStatusUpdate) {
        onStatusUpdate(quote.quoteId, status);
      }
    } catch (err) {
      console.error('Error updating quote status:', err);
      setError('Failed to update quote status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <div className="rounded-md border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Quote Status</h3>
      
      {/* Current Status */}
      <div className="mb-4">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Status:</span>
        <div className="mt-1">
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(quote.status)}`}>
            {getStatusLabel(quote.status)}
          </span>
        </div>
      </div>
      
      {/* Status Update Form */}
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Update Status
        </label>
        <div className="mt-1 flex items-center space-x-2">
          <select
            id="status"
            name="status"
            value={status}
            onChange={handleStatusChange}
            className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
            disabled={submitting || isUpdating}
          >
            <option value={QuoteStatus.DRAFT}>Draft</option>
            <option value={QuoteStatus.SENT}>Sent</option>
            <option value={QuoteStatus.ACCEPTED}>Accepted</option>
            <option value={QuoteStatus.REJECTED}>Rejected</option>
            <option value={QuoteStatus.EXPIRED}>Expired</option>
          </select>
          
          <button
            type="button"
            onClick={handleUpdateStatus}
            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-blue-700 dark:hover:bg-blue-600"
            disabled={submitting || isUpdating || status === quote.status}
          >
            {isUpdating ? (
              <>
                <svg className="-ml-1 mr-2 h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </>
            ) : (
              'Update'
            )}
          </button>
        </div>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="mt-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}
    </div>
  );
};

export default QuoteStatusUpdate;