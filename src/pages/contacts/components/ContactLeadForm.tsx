/**
 * ContactLeadForm Component
 * 
 * This component provides a form for managing leads associated with a contact.
 * It displays the current associated leads and allows users to view lead details.
 * 
 * Features:
 * - Displays current associated leads
 * - Provides links to view lead details
 * - Shows lead status and creation date
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Timestamp } from 'firebase/firestore';
import { Contact } from '../../../types/Contact';
import { Lead } from '../../../types/Lead';

/**
 * ContactLeadForm component props
 */
interface ContactLeadFormProps {
  contact: Contact;
  leads: Lead[];
  isLoading: boolean;
}

/**
 * ContactLeadForm component
 */
const ContactLeadForm: React.FC<ContactLeadFormProps> = ({
  contact,
  leads,
  isLoading
}) => {
  // State for associated leads
  const [associatedLeads, setAssociatedLeads] = useState<Lead[]>([]);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  
  // Filter leads associated with this contact
  useEffect(() => {
    if (leads && leads.length > 0) {
      // Filter leads where the contact is associated with the lead
      const filteredLeads = leads.filter(lead =>
        lead.contactIds?.includes(contact.contactId)
      );
      setAssociatedLeads(filteredLeads);
    }
  }, [leads, contact.contactId]);
  
  // Toggle expanded state
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };
  
  // Format date
  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp) return 'N/A';
    
    try {
      return timestamp.toDate().toLocaleDateString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };
  
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">Leads</h3>
        <button
          onClick={toggleExpanded}
          className="text-gray-500 hover:text-primary"
          aria-label={isExpanded ? "Collapse section" : "Expand section"}
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
      
      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
      
      {/* No Leads State */}
      {!isLoading && associatedLeads.length === 0 && (
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
          No leads associated with this contact
        </p>
      )}
      
      {/* Associated Leads */}
      {!isLoading && associatedLeads.length > 0 && (
        <div className="space-y-3 mb-4">
          {associatedLeads.map((lead) => (
            <div
              key={lead.leadId}
              className="bg-gray-100 dark:bg-gray-700 rounded p-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <Link
                    to={`/leads/${lead.leadId}`}
                    className="font-medium text-black dark:text-white hover:text-primary"
                  >
                    {`Lead for ${lead.contactPerson.fullName}`}
                  </Link>
                  <div className="flex items-center mt-1">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      lead.status === 'new' 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' 
                        : lead.status === 'qualified'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : lead.status === 'disqualified'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                    }`}>
                      {lead.status}
                    </span>
                    <span className="text-xs text-gray-600 dark:text-gray-400 ml-2">
                      Created: {formatDate(lead.createdAt)}
                    </span>
                  </div>
                </div>
                <Link
                  to={`/leads/${lead.leadId}`}
                  className="text-gray-500 hover:text-primary"
                  aria-label="View lead"
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
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    ></path>
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Create New Lead Link */}
      {isExpanded && (
        <div className="mt-4">
          <Link
            to={`/leads/new?contactId=${contact.contactId}`}
            className="inline-flex items-center justify-center w-full rounded-md bg-primary py-2 px-4 text-sm font-medium text-white hover:bg-opacity-90"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Create New Lead
          </Link>
        </div>
      )}
      
      {/* View All Leads Link */}
      {!isExpanded && associatedLeads.length > 0 && (
        <div className="mt-4 text-center">
          <Link
            to="/leads"
            className="inline-flex items-center text-sm text-primary hover:underline"
          >
            View All Leads
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ContactLeadForm;