/**
 * QuoteDetail Component
 * 
 * This component displays the details of a quote, including its
 * basic information, items, and totals. It also provides actions
 * for editing, deleting, changing status, generating PDF, and sending the quote.
 */

import React from 'react';
import { Quote, QuoteStatus } from '../../../types/Quote';
import { formatDate, formatCurrency } from '../../../utils/formatters';

interface QuoteDetailProps {
  quote: Quote;
  isLoading: boolean;
  onEdit: (quoteId: string) => void;
  onDelete: (quoteId: string) => void;
  onStatusChange: (quoteId: string, status: QuoteStatus) => void;
  onGeneratePDF: (quoteId: string) => void;
  onSendQuote: (quoteId: string) => void;
}

/**
 * QuoteDetail component
 */
const QuoteDetail: React.FC<QuoteDetailProps> = ({
  quote,
  isLoading,
  onEdit,
  onDelete,
  onStatusChange,
  onGeneratePDF,
  onSendQuote
}) => {
  // Get status badge color
  const getStatusBadgeColor = (status: QuoteStatus) => {
    switch (status) {
      case QuoteStatus.DRAFT:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case QuoteStatus.SENT:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case QuoteStatus.ACCEPTED:
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case QuoteStatus.REJECTED:
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case QuoteStatus.EXPIRED:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };
  
  // Handle edit action
  const handleEdit = () => {
    onEdit(quote.quoteId);
  };
  
  // Handle delete action
  const handleDelete = () => {
    onDelete(quote.quoteId);
  };
  
  // Handle status change
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onStatusChange(quote.quoteId, e.target.value as QuoteStatus);
  };
  
  // Handle generate PDF action
  const handleGeneratePDF = () => {
    onGeneratePDF(quote.quoteId);
  };
  
  // Handle send quote action
  const handleSendQuote = () => {
    onSendQuote(quote.quoteId);
  };
  
  return (
    <div className="space-y-6">
      {/* Quote Header */}
      <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-4 flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{quote.subject}</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Quote #{quote.quoteNumber}
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Badge */}
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeColor(quote.status)}`}>
              {quote.status}
            </span>
            
            {/* Status Dropdown */}
            <div className="ml-2">
              <label htmlFor="quote-status" className="sr-only">Change status</label>
              <select
                id="quote-status"
                name="status"
                aria-label="Update quote status"
                value={quote.status}
                onChange={handleStatusChange}
                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value={QuoteStatus.DRAFT}>Draft</option>
                <option value={QuoteStatus.SENT}>Sent</option>
                <option value={QuoteStatus.ACCEPTED}>Accepted</option>
                <option value={QuoteStatus.REJECTED}>Rejected</option>
                <option value={QuoteStatus.EXPIRED}>Expired</option>
              </select>
            </div>
            
            {/* Action Buttons */}
            <div className="ml-2 flex space-x-2">
              <button
                type="button"
                onClick={handleEdit}
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="-ml-0.5 mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-red-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-red-400 dark:hover:bg-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="-ml-0.5 mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
        
        {/* Quote Dates */}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Quote Date</p>
            <p className="text-sm text-gray-900 dark:text-white">{formatDate(quote.quoteDate)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Expiry Date</p>
            <p className="text-sm text-gray-900 dark:text-white">{formatDate(quote.expiryDate)}</p>
          </div>
        </div>
        
        {/* Quote Actions */}
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleGeneratePDF}
            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Generate PDF
          </button>
          <button
            type="button"
            onClick={handleSendQuote}
            disabled={quote.status === QuoteStatus.DRAFT}
            className="inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {quote.status === QuoteStatus.DRAFT ? 'Finalize to Send' : 'Send Quote'}
          </button>
        </div>
      </div>
      
      {/* Quote Items */}
      <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Quote Items</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Description
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Quantity
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Unit Price
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
              {quote.items.map((item) => (
                <tr key={item.itemId}>
                  <td className="whitespace-normal px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {item.description}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-gray-900 dark:text-white">
                    {item.quantity}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-gray-900 dark:text-white">
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-gray-900 dark:text-white">
                    {formatCurrency(item.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <td colSpan={2} className="px-4 py-3"></td>
                <td className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">Subtotal:</td>
                <td className="px-4 py-3 text-right text-sm text-gray-900 dark:text-white">{formatCurrency(quote.subtotal)}</td>
              </tr>
              <tr>
                <td colSpan={2} className="px-4 py-3"></td>
                <td className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">Tax:</td>
                <td className="px-4 py-3 text-right text-sm text-gray-900 dark:text-white">{formatCurrency(quote.tax)}</td>
              </tr>
              <tr>
                <td colSpan={2} className="px-4 py-3"></td>
                <td className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">Total:</td>
                <td className="px-4 py-3 text-right text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(quote.total)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      
      {/* Notes */}
      {quote.notes && (
        <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Notes</h3>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">{quote.notes}</p>
          </div>
        </div>
      )}
      
      {/* Related Entities */}
      <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Related Information</h3>
        
        <div className="grid gap-4 sm:grid-cols-3">
          {/* Organisation */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Organisation</h4>
            <p className="text-sm text-gray-900 dark:text-white">
              {quote.organisationName || 'None linked'}
            </p>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Contact</h4>
            <p className="text-sm text-gray-900 dark:text-white">
              {quote.contactName || 'None linked'}
            </p>
          </div>
          
          {/* Lead */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Lead</h4>
            <p className="text-sm text-gray-900 dark:text-white">
              {quote.leadName || 'None linked'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteDetail;
