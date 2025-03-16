import React, { useState, useEffect } from 'react';
import { Lead } from '../../../types/Lead';

/**
 * LeadContactForm Component
 * 
 * This component provides a form for linking leads to contacts.
 * It allows searching for contacts and selecting multiple contacts to link to the lead.
 */
interface Contact {
  contactId: string;
  fullName: string;
  email: string;
}

interface LeadContactFormProps {
  lead: Lead;
  contacts: Contact[];
  isLoading: boolean;
  onLinkContacts: (leadId: string, contactIds: string[]) => Promise<void>;
  onUnlinkContact: (leadId: string, contactId: string) => Promise<void>;
}

const LeadContactForm: React.FC<LeadContactFormProps> = ({
  lead,
  contacts,
  isLoading,
  onLinkContacts,
  onUnlinkContact
}) => {
  // Selected contacts state
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  
  // Search term state
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Filtered contacts state
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>(contacts);
  
  // Submitting state
  const [submitting, setSubmitting] = useState<boolean>(false);
  
  // Error state
  const [error, setError] = useState<string | null>(null);
  
  // Initialize selected contacts if lead has any
  useEffect(() => {
    if (lead.contactIds && lead.contactIds.length > 0) {
      setSelectedContactIds(lead.contactIds);
    }
  }, [lead]);
  
  // Filter contacts based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredContacts(contacts);
      return;
    }
    
    const filtered = contacts.filter(contact => 
      contact.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredContacts(filtered);
  }, [searchTerm, contacts]);
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle contact selection
  const handleContactSelect = (contactId: string) => {
    setSelectedContactIds(prev => {
      if (prev.includes(contactId)) {
        return prev.filter(id => id !== contactId);
      } else {
        return [...prev, contactId];
      }
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedContactIds.length === 0) {
      setError('Please select at least one contact');
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      await onLinkContacts(lead.leadId, selectedContactIds);
    } catch (err) {
      setError('Failed to link contacts');
      console.error('Error linking contacts:', err);
    } finally {
      setSubmitting(false);
    }
  };
  
  // Handle unlinking contact
  const handleUnlink = async (contactId: string) => {
    setSubmitting(true);
    setError(null);
    
    try {
      await onUnlinkContact(lead.leadId, contactId);
      setSelectedContactIds(prev => prev.filter(id => id !== contactId));
    } catch (err) {
      setError('Failed to unlink contact');
      console.error('Error unlinking contact:', err);
    } finally {
      setSubmitting(false);
    }
  };
  
  // Get linked contacts
  const linkedContacts = contacts.filter(contact => 
    lead.contactIds?.includes(contact.contactId)
  );
  
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <h2 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
        Link to Contacts
      </h2>
      
      {/* Display linked contacts */}
      {linkedContacts.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Linked Contacts
          </h3>
          <ul className="divide-y divide-gray-200 rounded-md border border-gray-200 dark:divide-gray-700 dark:border-gray-700">
            {linkedContacts.map(contact => (
              <li key={contact.contactId} className="flex items-center justify-between p-3">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{contact.fullName}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{contact.email}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleUnlink(contact.contactId)}
                  disabled={submitting}
                  className="rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                >
                  Unlink
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Search and select contacts */}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="contact-search" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Search Contacts
          </label>
          <input
            type="text"
            id="contact-search"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by name or email..."
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
          />
        </div>
        
        <div className="mb-4 max-h-60 overflow-y-auto rounded-md border border-gray-200 dark:border-gray-700">
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-gray-900 dark:border-white"></div>
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">Loading contacts...</span>
            </div>
          ) : filteredContacts.length === 0 ? (
            <p className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
              No contacts found
            </p>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredContacts.map(contact => (
                <li key={contact.contactId}>
                  <div className="flex items-center px-4 py-3">
                    <input
                      type="checkbox"
                      id={`contact-${contact.contactId}`}
                      checked={selectedContactIds.includes(contact.contactId)}
                      onChange={() => handleContactSelect(contact.contactId)}
                      aria-label={`Select ${contact.fullName}`}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                    />
                    <label 
                      htmlFor={`contact-${contact.contactId}`}
                      className="ml-3 flex flex-col cursor-pointer"
                    >
                      <span className="block text-sm font-medium text-gray-900 dark:text-white">
                        {contact.fullName}
                      </span>
                      <span className="block text-xs text-gray-500 dark:text-gray-400">
                        {contact.email}
                      </span>
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {error && (
          <p className="mb-4 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={selectedContactIds.length === 0 || submitting}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeadContactForm;