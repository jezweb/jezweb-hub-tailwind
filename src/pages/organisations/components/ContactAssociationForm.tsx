/**
 * ContactAssociationForm Component
 * 
 * This component provides a form for searching and selecting existing contacts
 * or creating new contacts to associate with an organisation.
 * 
 * Features:
 * - Search for existing contacts
 * - Display search results
 * - Select a contact to associate
 * - Specify role and primary status
 * - Link to create a new contact with auto-association
 * 
 * This component is used in the OrganisationDetails page to manage
 * contact associations.
 */

import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Contact } from '../../../types/Contact';
import { useContacts } from '../../../hooks/contacts/useContacts';
import { useOrganisationContacts } from '../../../hooks/contacts/useOrganisationContacts';
import { OrganisationContactFormData } from '../../../types/OrganisationContact';

// Import design system components
import { Card } from '../../../components/ui/design-system/Card';
import { ActionButton } from '../../../components/ui/design-system/ActionButton';
import { ErrorMessage } from '../../../components/ui/design-system/ErrorMessage';
import { LoadingState } from '../../../components/ui/design-system/LoadingState';
import { FormSection } from '../../../components/ui/design-system/FormSection';

/**
 * ContactAssociationForm component props
 */
interface ContactAssociationFormProps {
  organisationId: string;
  onAssociationCreated: () => void;
}

/**
 * ContactAssociationForm component
 */
const ContactAssociationForm: React.FC<ContactAssociationFormProps> = ({
  organisationId,
  onAssociationCreated
}) => {
  // State for search and form
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [role, setRole] = useState<string>('staff');
  const [isPrimary, setIsPrimary] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  
  // Get contacts data and actions from the hooks
  const {
    contacts,
    searchContacts,
    loading: contactsLoading,
    error: contactsError
  } = useContacts();
  
  const {
    addContactToOrganisation,
    submitting,
    submitError
  } = useOrganisationContacts();
  
  // Handle search input change with debounce
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // If search term is empty, clear results
    if (!value.trim()) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    
    // Search contacts with debounce
    const delayDebounceFn = setTimeout(async () => {
      try {
        await searchContacts(value);
        // The searchContacts function updates the contacts state in the hook
        // We need to access the contacts from the hook
        setSearchResults(contacts || []);
      } catch (error) {
        console.error('Error searching contacts:', error);
      } finally {
        setIsSearching(false);
      }
    }, 300);
    
    return () => clearTimeout(delayDebounceFn);
  }, [searchContacts, contacts]);
  
  // Handle contact selection
  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
    setSearchTerm('');
    setSearchResults([]);
  };
  
  // Handle role change
  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value);
  };
  
  // Handle primary status change
  const handlePrimaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsPrimary(e.target.checked);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedContact) return;
    
    try {
      const formData: OrganisationContactFormData = {
        organisationId,
        contactId: selectedContact.contactId,
        role,
        isPrimary,
        priority: isPrimary ? 1 : 10
      };
      
      await addContactToOrganisation(formData);
      
      // Reset form
      setSelectedContact(null);
      setRole('staff');
      setIsPrimary(false);
      setIsExpanded(false);
      
      // Notify parent component
      onAssociationCreated();
    } catch (error) {
      console.error('Error adding contact to organisation:', error);
    }
  };
  
  // Toggle expanded state
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setSelectedContact(null);
      setSearchTerm('');
      setSearchResults([]);
    }
  };
  
  return (
    <Card
      header={
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Add Contact</h3>
          <button
            onClick={toggleExpanded}
            className="text-gray-500 hover:text-primary"
            aria-label={isExpanded ? "Collapse form" : "Expand form"}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isExpanded ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 15l7-7 7 7"
                ></path>
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              )}
            </svg>
          </button>
        </div>
      }
      className="mt-6"
    >
      {isExpanded && (
        <div>
          <FormSection
            title="Search Existing Contacts"
            bordered={false}
            padded={false}
          >
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search contacts by name or email..."
                className="h-10 w-full rounded-lg border border-gray-300 bg-white pl-4 pr-10 text-sm text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                {isSearching ? (
                  <LoadingState size="small" />
                ) : (
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                )}
              </span>
            </div>
            
            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mb-6 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-gray-800">
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                          Name
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                          Email
                        </th>
                        <th className="py-3 px-4 text-right text-sm font-medium text-gray-700 dark:text-gray-300">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {searchResults.map((contact) => (
                        <tr key={contact.contactId} className="border-t border-gray-200 dark:border-gray-700">
                          <td className="py-3 px-4 text-sm text-gray-800 dark:text-white">
                            {contact.fullName}
                            {contact.jobTitle && (
                              <span className="block text-xs text-gray-500 dark:text-gray-400">
                                {contact.jobTitle}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-800 dark:text-white">
                            {contact.email}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <ActionButton
                              variant="primary"
                              size="small"
                              onClick={() => handleSelectContact(contact)}
                            >
                              Select
                            </ActionButton>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {searchTerm && searchResults.length === 0 && !isSearching && (
              <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  No contacts found matching "{searchTerm}"
                </p>
                <Link
                  to={`/contacts/new?organisationId=${organisationId}`}
                  className="inline-block mt-2 text-primary hover:underline"
                >
                  Create a new contact
                </Link>
              </div>
            )}
          </FormSection>
          
          {/* Selected Contact */}
          {selectedContact && (
            <FormSection
              title="Selected Contact"
              bordered={false}
              padded={false}
              className="mb-6"
            >
              <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-medium text-black dark:text-white">
                      {selectedContact.fullName}
                    </h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedContact.email}
                    </p>
                    {selectedContact.jobTitle && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedContact.jobTitle}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedContact(null)}
                    className="text-gray-500 hover:text-primary"
                    aria-label="Remove selection"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
            </FormSection>
          )}
          
          {/* Association Form */}
          {selectedContact && (
            <form onSubmit={handleSubmit}>
              <FormSection
                title="Association Details"
                bordered={false}
                padded={false}
              >
                <div className="mb-4">
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Role
                  </label>
                  <select
                    id="role"
                    value={role}
                    onChange={handleRoleChange}
                    className="h-10 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="owner">Owner</option>
                    <option value="manager">Manager</option>
                    <option value="staff">Staff</option>
                    <option value="technical">Technical Contact</option>
                    <option value="billing">Billing Contact</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-center">
                    <input
                      id="isPrimary"
                      type="checkbox"
                      checked={isPrimary}
                      onChange={handlePrimaryChange}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700"
                    />
                    <label htmlFor="isPrimary" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Set as primary contact
                    </label>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Primary contacts are the main point of contact for this organisation
                  </p>
                </div>
                
                <div className="flex justify-end">
                  <ActionButton
                    variant="secondary"
                    onClick={() => setSelectedContact(null)}
                    className="mr-3"
                  >
                    Cancel
                  </ActionButton>
                  <ActionButton
                    type="submit"
                    variant="primary"
                    isLoading={submitting}
                    disabled={submitting}
                  >
                    Add Contact
                  </ActionButton>
                </div>
                
                {submitError && (
                  <div className="mt-4">
                    <ErrorMessage
                      title="Error!"
                      message={submitError.message}
                    />
                  </div>
                )}
              </FormSection>
            </form>
          )}
          
          {/* Create New Contact Link */}
          {!selectedContact && (
            <div className="mt-6 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Can't find the contact you're looking for?
              </p>
              <Link to={`/contacts/new?organisationId=${organisationId}`}>
                <ActionButton variant="primary">
                  Create New Contact
                </ActionButton>
              </Link>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default ContactAssociationForm;