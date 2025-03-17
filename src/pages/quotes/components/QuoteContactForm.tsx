/**
 * QuoteContactForm Component
 * 
 * This component provides a UI for linking a quote to a contact.
 * It displays the current linked contact (if any) and allows the user to
 * link or unlink contacts.
 */

import React, { useState, useEffect } from 'react';
import { Quote } from '../../../types/Quote';

interface QuoteContactFormProps {
  quote: Quote;
  contacts: any[]; // This would be replaced with a proper Contact type
  isLoading: boolean;
  onLinkContact: (quoteId: string, contactId: string, contactName: string) => Promise<void>;
  onUnlinkContact: (quoteId: string) => Promise<void>;
}

/**
 * QuoteContactForm component
 */
const QuoteContactForm: React.FC<QuoteContactFormProps> = ({
  quote,
  contacts,
  isLoading,
  onLinkContact,
  onUnlinkContact
}) => {
  const [selectedContactId, setSelectedContactId] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Reset selected contact when quote changes
  useEffect(() => {
    setSelectedContactId('');
  }, [quote.quoteId]);
  
  // Handle link contact
  const handleLinkContact = async () => {
    if (!selectedContactId) return;
    
    setSubmitting(true);
    setError(null);
    
    try {
      // Find the selected contact to get its name
      const selectedContact = contacts.find(contact => contact.contactId === selectedContactId);
      
      if (!selectedContact) {
        throw new Error('Selected contact not found');
      }
      
      await onLinkContact(quote.quoteId, selectedContactId, selectedContact.fullName);
      setSelectedContactId('');
    } catch (err) {
      console.error('Error linking contact to quote:', err);
      setError('Failed to link contact. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Handle unlink contact
  const handleUnlinkContact = async () => {
    if (!quote.contactId) return;
    
    if (window.confirm('Are you sure you want to unlink this contact from the quote?')) {
      setSubmitting(true);
      setError(null);
      
      try {
        await onUnlinkContact(quote.quoteId);
      } catch (err) {
        console.error('Error unlinking contact from quote:', err);
        setError('Failed to unlink contact. Please try again.');
      } finally {
        setSubmitting(false);
      }
    }
  };
  
  return (
    <div className="rounded-md border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Contact</h3>
      
      {/* Current Contact */}
      {quote.contactId ? (
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {quote.contactName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Linked Contact
              </p>
            </div>
            <button
              type="button"
              onClick={handleUnlinkContact}
              disabled={submitting}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              {submitting ? 'Unlinking...' : 'Unlink'}
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No contact linked to this quote.
          </p>
        </div>
      )}
      
      {/* Link Contact Form */}
      {!quote.contactId && (
        <div>
          <div className="mb-4">
            <label htmlFor="contact-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Select Contact
            </label>
            <select
              id="contact-select"
              value={selectedContactId}
              onChange={(e) => setSelectedContactId(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
              disabled={isLoading || submitting}
            >
              <option value="">Select a contact</option>
              {isLoading ? (
                <option value="" disabled>Loading contacts...</option>
              ) : contacts.length === 0 ? (
                <option value="" disabled>No contacts available</option>
              ) : (
                contacts.map((contact) => (
                  <option key={contact.contactId} value={contact.contactId}>
                    {contact.fullName}
                  </option>
                ))
              )}
            </select>
          </div>
          
          <button
            type="button"
            onClick={handleLinkContact}
            disabled={!selectedContactId || submitting}
            className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            {submitting ? (
              <>
                <svg className="-ml-1 mr-2 h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Linking...
              </>
            ) : (
              'Link Contact'
            )}
          </button>
        </div>
      )}
      
      {/* Error Message */}
      {error && (
        <div className="mt-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}
    </div>
  );
};

export default QuoteContactForm;