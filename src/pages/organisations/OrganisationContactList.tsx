/**
 * OrganisationContactList Component
 * 
 * This component displays a list of contacts associated with an organisation.
 * It uses the useOrganisationContacts hook to fetch and manage contact data.
 * 
 * Features:
 * - Displays contacts in a table format
 * - Shows primary contact status
 * - Provides actions for viewing, editing, and removing contacts
 * - Allows adding new contacts to the organisation
 * - Uses design system components for consistent styling
 */

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useOrganisationContacts } from '../../hooks/contacts/useOrganisationContacts';

// Import design system components
import { Card } from '../../components/ui/design-system/Card';
import { ActionButton } from '../../components/ui/design-system/ActionButton';
import { LoadingState } from '../../components/ui/design-system/LoadingState';
import { ErrorMessage } from '../../components/ui/design-system/ErrorMessage';
import { StatusBadge } from '../../components/ui/design-system/StatusBadge';

/**
 * OrganisationContactList component props
 */
interface OrganisationContactListProps {
  organisationId: string;
  onViewContact?: (contactId: string) => void;
  onEditContact?: (contactId: string) => void;
  onRemoveContact?: (relationshipId: string) => void;
}

/**
 * OrganisationContactList component
 */
const OrganisationContactList: React.FC<OrganisationContactListProps> = ({
  organisationId,
  onViewContact,
  onEditContact,
  onRemoveContact
}) => {
  // Get organisation contacts data and actions from the hook
  const {
    organisationContacts,
    loading,
    error,
    fetchContactsByOrganisation,
    removeContactFromOrganisation
  } = useOrganisationContacts();

  // Fetch contacts on component mount
  useEffect(() => {
    fetchContactsByOrganisation(organisationId);
  }, [organisationId, fetchContactsByOrganisation]);

  // Handle view contact
  const handleViewContact = (contactId: string) => {
    if (onViewContact) {
      onViewContact(contactId);
    }
  };

  // Handle edit contact
  const handleEditContact = (contactId: string) => {
    if (onEditContact) {
      onEditContact(contactId);
    }
  };

  // Handle remove contact
  const handleRemoveContact = async (relationshipId: string, contactName: string) => {
    if (window.confirm(`Are you sure you want to remove ${contactName} from this organisation?`)) {
      try {
        await removeContactFromOrganisation(relationshipId);
        if (onRemoveContact) {
          onRemoveContact(relationshipId);
        }
      } catch (error) {
        console.error('Error removing contact from organisation:', error);
      }
    }
  };

  // Render loading state
  if (loading) {
    return <LoadingState message="Loading contacts..." />;
  }

  // Render error state
  if (error) {
    return (
      <ErrorMessage
        title="Error!"
        message={error.message}
      />
    );
  }

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Contacts
        </h3>
        <Link
          to={`/contacts/new?organisationId=${organisationId}`}
          className="inline-flex items-center justify-center rounded-md bg-blue-600 py-2 px-4 text-sm text-white hover:bg-blue-700"
        >
          <svg className="mr-2" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 0C3.58 0 0 3.58 0 8C0 12.42 3.58 16 8 16C12.42 16 16 12.42 16 8C16 3.58 12.42 0 8 0ZM12 9H9V12H7V9H4V7H7V4H9V7H12V9Z" fill="currentColor" />
          </svg>
          Add Contact
        </Link>
      </div>

      {organisationContacts.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            No contacts associated with this organisation
          </p>
          <Link
            to={`/contacts/new?organisationId=${organisationId}`}
            className="inline-block mt-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Add a contact
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-100 text-left dark:bg-gray-700">
                <th className="py-3 px-4 font-medium text-gray-800 dark:text-white">
                  Name
                </th>
                <th className="py-3 px-4 font-medium text-gray-800 dark:text-white">
                  Email
                </th>
                <th className="py-3 px-4 font-medium text-gray-800 dark:text-white">
                  Phone
                </th>
                <th className="py-3 px-4 font-medium text-gray-800 dark:text-white">
                  Role
                </th>
                <th className="py-3 px-4 font-medium text-gray-800 dark:text-white">
                  Status
                </th>
                <th className="py-3 px-4 font-medium text-gray-800 dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {organisationContacts.map((contact) => (
                <tr key={contact.relationshipId} className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="py-4 px-4">
                    <h5 className="font-medium text-gray-800 dark:text-white">
                      {contact.fullName}
                    </h5>
                    {contact.jobTitle && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {contact.jobTitle}
                      </p>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-gray-800 dark:text-white">
                      <a href={`mailto:${contact.email}`} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                        {contact.email}
                      </a>
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-gray-800 dark:text-white">
                      {contact.phone ? (
                        <a href={`tel:${contact.phone}`} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                          {contact.phone}
                        </a>
                      ) : (
                        '-'
                      )}
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-gray-800 dark:text-white">
                      {contact.role || '-'}
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <StatusBadge 
                      status={contact.isPrimary ? 'primary' : 'secondary'} 
                      label={contact.isPrimary ? 'Primary' : 'Secondary'} 
                    />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      {/* View Button */}
                      <ActionButton
                        variant="secondary"
                        size="small"
                        onClick={() => handleViewContact(contact.contactId)}
                        aria-label={`View ${contact.fullName}`}
                      >
                        View
                      </ActionButton>
                      
                      {/* Edit Button */}
                      <ActionButton
                        variant="secondary"
                        size="small"
                        onClick={() => handleEditContact(contact.contactId)}
                        aria-label={`Edit ${contact.fullName}`}
                      >
                        Edit
                      </ActionButton>
                      
                      {/* Remove Button */}
                      <ActionButton
                        variant="danger"
                        size="small"
                        onClick={() => handleRemoveContact(contact.relationshipId, contact.fullName)}
                        aria-label={`Remove ${contact.fullName} from organisation`}
                      >
                        Remove
                      </ActionButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrganisationContactList;