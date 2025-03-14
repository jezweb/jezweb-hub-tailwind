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
 */

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useOrganisationContacts } from '../../hooks/contacts/useOrganisationContacts';

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
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error.message}</span>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-boxdark rounded-sm border border-stroke dark:border-strokedark shadow-default">
      <div className="p-4 border-b border-stroke dark:border-strokedark flex justify-between items-center">
        <h3 className="text-xl font-semibold text-black dark:text-white">
          Contacts
        </h3>
        <Link
          to={`/contacts/new?organisationId=${organisationId}`}
          className="inline-flex items-center justify-center rounded-md bg-primary py-2 px-4 text-white hover:bg-opacity-90"
        >
          <span className="mr-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 0C3.58 0 0 3.58 0 8C0 12.42 3.58 16 8 16C12.42 16 16 12.42 16 8C16 3.58 12.42 0 8 0ZM12 9H9V12H7V9H4V7H7V4H9V7H12V9Z"
                fill="white"
              />
            </svg>
          </span>
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
            className="inline-block mt-2 text-primary hover:underline"
          >
            Add a contact
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Name
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Email
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Phone
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Role
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Status
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {organisationContacts.map((contact) => (
                <tr key={contact.relationshipId}>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <h5 className="font-medium text-black dark:text-white">
                      {contact.fullName}
                    </h5>
                    {contact.jobTitle && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {contact.jobTitle}
                      </p>
                    )}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      <a href={`mailto:${contact.email}`} className="hover:text-primary">
                        {contact.email}
                      </a>
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {contact.phone ? (
                        <a href={`tel:${contact.phone}`} className="hover:text-primary">
                          {contact.phone}
                        </a>
                      ) : (
                        '-'
                      )}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {contact.role || '-'}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    {contact.isPrimary ? (
                      <span className="inline-block rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Primary
                      </span>
                    ) : (
                      <span className="inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">
                        Secondary
                      </span>
                    )}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center space-x-3.5">
                      {/* View Button */}
                      <button
                        className="hover:text-primary"
                        aria-label={`View ${contact.fullName}`}
                        onClick={() => handleViewContact(contact.contactId)}
                      >
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9 3.75C4.5 3.75 1.5 9 1.5 9C1.5 9 4.5 14.25 9 14.25C13.5 14.25 16.5 9 16.5 9C16.5 9 13.5 3.75 9 3.75ZM9 12.75C7.125 12.75 5.625 11.25 5.625 9.375C5.625 7.5 7.125 6 9 6C10.875 6 12.375 7.5 12.375 9.375C12.375 11.25 10.875 12.75 9 12.75ZM9 7.5C7.95 7.5 7.125 8.325 7.125 9.375C7.125 10.425 7.95 11.25 9 11.25C10.05 11.25 10.875 10.425 10.875 9.375C10.875 8.325 10.05 7.5 9 7.5Z"
                          />
                        </svg>
                      </button>
                      
                      {/* Edit Button */}
                      <button
                        className="hover:text-primary"
                        aria-label={`Edit ${contact.fullName}`}
                        onClick={() => handleEditContact(contact.contactId)}
                      >
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M16.3125 1.125C16.5703 1.38281 16.7344 1.73438 16.7344 2.10938C16.7344 2.48438 16.5703 2.83594 16.3125 3.09375L15.0703 4.33594L12.1641 1.42969L13.4062 0.1875C13.6641 -0.0703125 14.0156 -0.0703125 14.2734 0.1875L16.3125 2.22656C16.4062 2.32031 16.4062 2.32031 16.3125 2.22656L16.3125 1.125ZM6.60938 6.98438L11.3906 2.20312L14.2969 5.10938L9.51562 9.89062C9.32812 10.0781 9.09375 10.1719 8.85938 10.1719H6.04688C5.57812 10.1719 5.20312 9.79688 5.20312 9.32812V6.51562C5.20312 6.28125 5.29688 6.04688 5.48438 5.85938L6.60938 6.98438ZM5.20312 12.1406H15.7969C16.2656 12.1406 16.6406 12.5156 16.6406 12.9844V13.4531C16.6406 13.9219 16.2656 14.2969 15.7969 14.2969H5.20312C4.73438 14.2969 4.35938 13.9219 4.35938 13.4531V12.9844C4.35938 12.5156 4.73438 12.1406 5.20312 12.1406Z"
                          />
                        </svg>
                      </button>
                      
                      {/* Remove Button */}
                      <button
                        className="hover:text-primary"
                        aria-label={`Remove ${contact.fullName} from organisation`}
                        onClick={() => handleRemoveContact(contact.relationshipId, contact.fullName)}
                      >
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                          />
                          <path
                            d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                          />
                          <path
                            d="M10.8789 9.7594C10.8789 9.42189 10.5977 9.11252 10.2321 9.11252C9.89456 9.11252 9.58519 9.39377 9.58519 9.7594V13.3313C9.58519 13.6688 9.86644 13.9782 10.2321 13.9782C10.5695 13.9782 10.8789 13.6969 10.8789 13.3313V9.7594Z"
                          />
                          <path
                            d="M7.12177 9.7594C7.12177 9.42189 6.84052 9.11252 6.47489 9.11252C6.13739 9.11252 5.82812 9.39377 5.82812 9.7594V13.3313C5.82812 13.6688 6.10927 13.9782 6.47489 13.9782C6.84052 13.9782 7.12177 13.6969 7.12177 13.3313V9.7594Z"
                          />
                        </svg>
                      </button>
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