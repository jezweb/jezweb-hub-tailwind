/**
 * ContactCard Component
 * 
 * This component displays a card with contact information.
 * It shows the contact's name, organisation, contact details, and role.
 * It also provides buttons for viewing details and contacting the person.
 * 
 * This component is used in the Contacts page to display contact information
 * in a grid layout.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Contact } from '../../../types/Contact';

/**
 * ContactCard component props
 */
interface ContactCardProps {
  contact: Contact;
  organisationName?: string;
  role?: string;
}

/**
 * ContactCard component
 */
const ContactCard: React.FC<ContactCardProps> = ({
  contact,
  organisationName,
  role
}) => {
  const navigate = useNavigate();

  /**
   * Handle viewing contact details
   */
  const handleViewDetails = () => {
    navigate(`/contacts/${contact.contactId}`);
  };

  /**
   * Handle contacting the person (e.g., via email)
   */
  const handleContact = () => {
    window.location.href = `mailto:${contact.email}`;
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      <div className="p-6">
        <div className="mb-4 flex items-center">
          <div className="mr-4 h-12 w-12 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            {contact.image ? (
              <img 
                src={contact.image} 
                alt={contact.fullName} 
                className="h-full w-full object-cover"
              />
            ) : (
              <svg
                className="h-full w-full text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                ></path>
              </svg>
            )}
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {contact.fullName}
            </h3>
            {organisationName && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {organisationName}
              </p>
            )}
          </div>
        </div>
        <div className="mb-4 space-y-2">
          {/* Email */}
          <div className="flex items-start">
            <svg
              className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              ></path>
            </svg>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {contact.email}
            </span>
          </div>
          
          {/* Phone */}
          {contact.phone && (
            <div className="flex items-start">
              <svg
                className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                ></path>
              </svg>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {contact.phone}
              </span>
            </div>
          )}
          
          {/* Mobile */}
          {contact.mobile && (
            <div className="flex items-start">
              <svg
                className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                ></path>
              </svg>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {contact.mobile}
              </span>
            </div>
          )}
          
          {/* Job Title / Role */}
          {(contact.jobTitle || role) && (
            <div className="flex items-start">
              <svg
                className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                ></path>
              </svg>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {contact.jobTitle && role 
                  ? `${contact.jobTitle} • ${role}`
                  : contact.jobTitle || `Role: ${role}`}
              </span>
            </div>
          )}
        </div>
        <div className="flex justify-between">
          <button 
            className="rounded bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            onClick={handleViewDetails}
          >
            Details
          </button>
          <button 
            className="rounded bg-blue-100 px-3 py-1 text-sm text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
            onClick={handleContact}
          >
            Contact
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactCard;