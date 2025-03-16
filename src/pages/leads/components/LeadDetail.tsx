import React from 'react';
import { Lead } from '../../../types/Lead';

/**
 * LeadDetail Component
 * 
 * This component displays detailed information about a lead.
 * It's used in the LeadView page to show all lead information.
 */
interface LeadDetailProps {
  lead: Lead;
  isLoading: boolean;
  onEdit: (leadId: string) => void;
  onDelete: (leadId: string) => void;
}

const LeadDetail: React.FC<LeadDetailProps> = ({
  lead,
  isLoading,
  onEdit,
  onDelete
}) => {
  // Format date for display
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('en-AU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Render status badge with appropriate color
  const renderStatusBadge = (status: string) => {
    let bgColor = '';
    
    switch (status) {
      case 'new':
        bgColor = 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
        break;
      case 'contacted':
        bgColor = 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
        break;
      case 'qualified':
        bgColor = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        break;
      case 'unqualified':
        bgColor = 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        break;
      case 'converted':
        bgColor = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        break;
      default:
        bgColor = 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
    
    return (
      <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${bgColor}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900 dark:border-white"></div>
        <span className="ml-2">Loading lead details...</span>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
        <p className="text-gray-500 dark:text-gray-400">Lead not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col items-start justify-between space-y-4 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800 sm:flex-row sm:items-center sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {lead.contactPerson.fullName}
          </h1>
          <div className="mt-2 flex items-center space-x-4">
            {renderStatusBadge(lead.status)}
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Created: {formatDate(lead.createdAt)}
            </span>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => onEdit(lead.leadId)}
            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          <button
            onClick={() => onDelete(lead.leadId)}
            className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>

      {/* Contact Information */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Contact Information</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</h3>
            <p className="mt-1 text-base text-gray-900 dark:text-white">{lead.contactPerson.fullName}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</h3>
            <p className="mt-1 text-base text-gray-900 dark:text-white">{lead.contactPerson.email}</p>
          </div>
          
          {lead.contactPerson.phone && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</h3>
              <p className="mt-1 text-base text-gray-900 dark:text-white">{lead.contactPerson.phone}</p>
            </div>
          )}
          
          {lead.contactPerson.jobTitle && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Job Title</h3>
              <p className="mt-1 text-base text-gray-900 dark:text-white">{lead.contactPerson.jobTitle}</p>
            </div>
          )}
        </div>
      </div>

      {/* Organisation Information */}
      {lead.organisationName && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Organisation Information</h2>
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Organisation Name</h3>
            <p className="mt-1 text-base text-gray-900 dark:text-white">{lead.organisationName}</p>
          </div>
        </div>
      )}

      {/* Lead Details */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Lead Details</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h3>
            <div className="mt-1">{renderStatusBadge(lead.status)}</div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Source</h3>
            <p className="mt-1 text-base text-gray-900 dark:text-white">{lead.source}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</h3>
            <p className="mt-1 text-base text-gray-900 dark:text-white">{formatDate(lead.createdAt)}</p>
          </div>
          
          {lead.updatedAt && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</h3>
              <p className="mt-1 text-base text-gray-900 dark:text-white">{formatDate(lead.updatedAt)}</p>
            </div>
          )}
        </div>
        
        {lead.notes && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Notes</h3>
            <div className="mt-2 rounded-md bg-gray-50 p-4 dark:bg-gray-700">
              <p className="whitespace-pre-wrap text-gray-900 dark:text-white">{lead.notes}</p>
            </div>
          </div>
        )}
      </div>

      {/* Related Contacts */}
      {lead.contactIds && lead.contactIds.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Related Contacts</h2>
          <p className="text-gray-500 dark:text-gray-400">
            This lead is linked to {lead.contactIds.length} contact{lead.contactIds.length !== 1 ? 's' : ''}.
          </p>
          {/* Contact list would go here */}
        </div>
      )}
    </div>
  );
};

export default LeadDetail;