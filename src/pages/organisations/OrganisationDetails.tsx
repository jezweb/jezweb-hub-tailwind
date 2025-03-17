/**
 * OrganisationDetails Component
 *
 * This component displays detailed information about a single organisation.
 * It fetches the organisation data using the useOrganisations hook and displays
 * all relevant information in a structured layout with a main content area and sidebar.
 *
 * Features:
 * - Displays comprehensive organisation information in the main content area
 * - Provides a sidebar for managing relationships with contacts, quotes, leads, and websites
 * - Provides actions for editing and deleting the organisation
 * - Shows loading states and error messages
 * - Handles navigation back to the organisations list
 *
 * Layout Structure:
 * - Main content area (2/3 width on large screens): Contains organisation details
 * - Sidebar (1/3 width on large screens): Contains relationship management modules
 */

import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useOrganisations } from '../../hooks/organisations/useOrganisations';
import Button from "../../components/ui/button/Button";
import Alert from "../../components/ui/alert/Alert";
import { Timestamp } from 'firebase/firestore';
import OrganisationContactList from './OrganisationContactList';
import ContactAssociationForm from './components/ContactAssociationForm';

/**
 * OrganisationDetails component
 */
const OrganisationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Get organisation data and actions from the hook
  const {
    selectedOrganisation,
    loadingOrganisation,
    organisationError,
    fetchOrganisationById,
    deleteOrganisation
  } = useOrganisations();

  // Fetch organisation data on component mount
  useEffect(() => {
    if (id) {
      fetchOrganisationById(id);
    }
  }, [id, fetchOrganisationById]);

  // Handle edit organisation
  const handleEdit = () => {
    navigate(`/organisations/${id}/edit`);
  };

  // Handle delete organisation
  const handleDelete = async () => {
    if (!id || !selectedOrganisation) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedOrganisation.organisationName}?`)) {
      try {
        await deleteOrganisation(id);
        navigate('/organisations');
      } catch (error) {
        console.error('Error deleting organisation:', error);
      }
    }
  };

  // Handle back navigation
  const handleBack = () => {
    navigate('/organisations');
  };

  // Render loading state
  if (loadingOrganisation) {
    return (
      <>
        <PageMeta title="Loading | Jezweb Hub" description="Loading organisation data" />
        <PageBreadcrumb 
          pageTitle="Loading Organisation" 
          items={[{ label: 'Organisations', path: '/organisations' }]}
        />
        <div className="rounded-2xl border border-stroke bg-white p-6 shadow-default dark:border-gray-800 dark:bg-white/[0.03]">
          <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">
            Loading Organisation
          </h3>
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </>
    );
  }

  // Render error state
  if (organisationError) {
    return (
      <>
        <PageMeta
          title="Error | Jezweb Hub"
          description="An error occurred while loading the organisation"
        />
        <PageBreadcrumb 
          pageTitle="Organisation Error" 
          items={[{ label: 'Organisations', path: '/organisations' }]}
        />
        <div className="rounded-2xl border border-stroke bg-white p-6 shadow-default dark:border-gray-800 dark:bg-white/[0.03]">
          <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">
            Error Loading Organisation
          </h3>
          <Alert 
            variant="error"
            title="Error!"
            message={organisationError.message}
          />
          <div className="mt-4">
            <Button 
              variant="secondary"
              onClick={() => navigate('/organisations')}
            >Back to Organisations</Button>
          </div>
        </div>
      </>
    );
  }

  // Render not found state
  if (!selectedOrganisation) {
    return (
      <>
        <PageMeta title="Not Found | Jezweb Hub" description="The requested organisation could not be found" />
        <PageBreadcrumb 
          pageTitle="Organisation Not Found" 
          items={[{ label: 'Organisations', path: '/organisations' }]}
        />
        <div className="rounded-2xl border border-stroke bg-white p-6 shadow-default dark:border-gray-800 dark:bg-white/[0.03]">
          <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">
            Organisation Not Found
          </h3>
          <Alert variant="warning" title="Not Found!" message="The requested organisation could not be found." />
          <div className="mt-4">
            <Button 
              variant="secondary"
              onClick={() => navigate('/organisations')}
            >Back to Organisations</Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta
        title={`${selectedOrganisation.organisationName} | Jezweb Hub`}
        description={`View details for ${selectedOrganisation.organisationName}`}
      />
      <PageBreadcrumb
        pageTitle={selectedOrganisation.organisationName}
        items={[
          { label: 'Organisations', path: '/organisations' }
        ]}
      />
      
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <h3 className="font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
          {selectedOrganisation.organisationName}
        </h3>
      </div>
      
      {/* Main content grid with sidebar */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content area - 2/3 width on large screens */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="rounded-2xl border border-stroke bg-white p-6 shadow-default dark:border-gray-800 dark:bg-white/[0.03]">
            <h4 className="mb-6 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
              Basic Information
            </h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <span className="block text-sm font-medium text-gray-800 dark:text-white/90">
                  Organisation Name
                </span>
                <span className="block text-sm text-gray-800 dark:text-white/90">
                  {selectedOrganisation.organisationName}
                </span>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-800 dark:text-white/90">
                  Type
                </span>
                <span className="block text-sm text-gray-800 dark:text-white/90">
                  {selectedOrganisation.organisationType || 'Not specified'}
                </span>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-800 dark:text-white/90">
                  Status
                </span>
                <span className={`inline-block rounded-full py-1 px-3 text-sm font-medium ${
                  selectedOrganisation.status === 'active'
                    ? 'bg-success bg-opacity-10 text-success'
                    : selectedOrganisation.status === 'inactive'
                    ? 'bg-danger bg-opacity-10 text-danger'
                    : selectedOrganisation.status === 'lead'
                    ? 'bg-warning bg-opacity-10 text-warning'
                    : 'bg-info bg-opacity-10 text-info'
                }`}>
                  {selectedOrganisation.status}
                </span>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-800 dark:text-white/90">
                  Industry
                </span>
                <span className="block text-sm text-gray-800 dark:text-white/90">
                  {selectedOrganisation.industry || 'Not specified'}
                </span>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-800 dark:text-white/90">
                  Primary Contact
                </span>
                <span className="block text-sm text-gray-800 dark:text-white/90">
                  {selectedOrganisation.primaryContactId ? (
                    <a href={`/contacts/${selectedOrganisation.primaryContactId}`} className="text-primary">
                      View Contact
                    </a>
                  ) : (
                    'Not specified'
                  )}
                </span>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-800 dark:text-white/90">
                  Website
                </span>
                <span className="block text-sm text-primary">
                  {selectedOrganisation.website ? (
                    <a href={selectedOrganisation.website} target="_blank" rel="noopener noreferrer">
                      {selectedOrganisation.website}
                    </a>
                  ) : (
                    'Not specified'
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="rounded-2xl border border-stroke bg-white p-6 shadow-default dark:border-gray-800 dark:bg-white/[0.03]">
            <h4 className="mb-6 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
              Contact Information
            </h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <span className="block text-sm font-medium text-gray-800 dark:text-white/90">
                  Email
                </span>
                <span className="block text-sm text-gray-800 dark:text-white/90">
                  {selectedOrganisation.customFields?.email ? (
                    <a href={`mailto:${selectedOrganisation.customFields.email}`} className="text-primary">
                      {selectedOrganisation.customFields.email}
                    </a>
                  ) : 'Not specified'}
                </span>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-800 dark:text-white/90">
                  Phone
                </span>
                <span className="block text-sm text-gray-800 dark:text-white/90">
                  {selectedOrganisation.customFields?.phone ? (
                    <a href={`tel:${selectedOrganisation.customFields.phone}`} className="text-primary">
                      {selectedOrganisation.customFields.phone}
                    </a>
                  ) : (
                    'Not specified'
                  )}
                </span>
              </div>
              <div className="sm:col-span-2">
                <span className="block text-sm font-medium text-gray-800 dark:text-white/90">
                  Address
                </span>
                <div className="mt-1">
                  {selectedOrganisation.billingAddress ? (
                    <div className="mb-2">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Billing Address:</span>
                      <p className="text-sm text-gray-800 dark:text-white/90">
                        {selectedOrganisation.billingAddress.street}<br />
                        {selectedOrganisation.billingAddress.suburb}, {selectedOrganisation.billingAddress.state} {selectedOrganisation.billingAddress.postcode}<br />
                        {selectedOrganisation.billingAddress.country}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-800 dark:text-white/90">No billing address specified</p>
                  )}
                  
                  {selectedOrganisation.shippingAddress && (
                    <div>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Shipping Address:</span>
                      <p className="text-sm text-gray-800 dark:text-white/90">
                        {selectedOrganisation.shippingAddress.street}<br />
                        {selectedOrganisation.shippingAddress.suburb}, {selectedOrganisation.shippingAddress.state} {selectedOrganisation.shippingAddress.postcode}<br />
                        {selectedOrganisation.shippingAddress.country}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="rounded-2xl border border-stroke bg-white p-6 shadow-default dark:border-gray-800 dark:bg-white/[0.03]">
            <h4 className="mb-6 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
              Additional Information
            </h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <span className="block text-sm font-medium text-gray-800 dark:text-white/90">
                  Description
                </span>
                <span className="block text-sm text-gray-800 dark:text-white/90">
                  {selectedOrganisation.notes || 'No notes provided'}
                </span>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-800 dark:text-white/90">
                  Created At
                </span>
                <span className="block text-sm text-gray-800 dark:text-white/90">
                  {selectedOrganisation.createdAt ?
                    (selectedOrganisation.createdAt as Timestamp).toDate().toLocaleString() :
                    'Unknown'}
                </span>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-800 dark:text-white/90">
                  Last Updated
                </span>
                <span className="block text-sm text-gray-800 dark:text-white/90">
                  {selectedOrganisation.updatedAt ?
                    (selectedOrganisation.updatedAt as Timestamp).toDate().toLocaleString() :
                    'Unknown'}
                </span>
              </div>
              {selectedOrganisation.customFields?.tags && Array.isArray(selectedOrganisation.customFields.tags) && selectedOrganisation.customFields.tags.length > 0 && (
                <div className="sm:col-span-2">
                  <span className="block text-sm font-medium text-gray-800 dark:text-white/90">
                    Tags
                  </span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedOrganisation.customFields.tags.map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="inline-block rounded-full bg-primary bg-opacity-10 py-1 px-3 text-sm font-medium text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-8">
            <Button
              variant="primary"
              onClick={handleEdit}
              aria-label={`Edit ${selectedOrganisation.organisationName}`}
              startIcon={
                <svg
                  className="fill-current"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.8 0H2.2C1 0 0 1 0 2.2V13.7C0 15 1 16 2.2 16H13.7C14.9 16 15.9 15 15.9 13.8V2.2C16 1 15 0 13.8 0ZM14.4 13.8C14.4 14.1 14.1 14.4 13.8 14.4H2.2C1.9 14.4 1.6 14.1 1.6 13.8V2.2C1.6 1.9 1.9 1.6 2.2 1.6H13.7C14 1.6 14.3 1.9 14.3 2.2V13.7C14.4 13.7 14.4 13.8 14.4 13.8Z"
                  />
                  <path
                    d="M11.8 4.2H4.2C3.9 4.2 3.6 4.5 3.6 4.8C3.6 5.1 3.8 5.4 4.2 5.4H11.8C12.1 5.4 12.4 5.1 12.4 4.8C12.4 4.5 12.1 4.2 11.8 4.2Z"
                  />
                  <path
                    d="M11.8 7.3H4.2C3.9 7.3 3.6 7.6 3.6 7.9C3.6 8.2 3.8 8.5 4.2 8.5H11.8C12.1 8.5 12.4 8.2 12.4 7.9C12.4 7.6 12.1 7.3 11.8 7.3Z"
                  />
                  <path
                    d="M11.8 10.4H4.2C3.9 10.4 3.6 10.7 3.6 11C3.6 11.3 3.8 11.6 4.2 11.6H11.8C12.1 11.6 12.4 11.3 12.4 11C12.4 10.7 12.1 10.4 11.8 10.4Z"
                  />
                </svg>
              }
            >
              Edit
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              aria-label={`Delete ${selectedOrganisation.organisationName}`}
              startIcon={
                <svg
                  className="fill-current"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.225 2.2h-1.7V1.7C10.525 0.765 9.76 0 8.825 0h-1.65C6.24 0 5.475 0.765 5.475 1.7V2.2h-1.7C3.14 2.2 2.55 2.79 2.55 3.425V4.2c0 0.34 0.215 0.595 0.5 0.7l0.255 5.5c0.04 0.68 0.51 1.2 1.19 1.2h6.935c0.68 0 1.15-0.52 1.19-1.2l0.255-5.5c0.285-0.105 0.5-0.36 0.5-0.7V3.425C13.375 2.79 12.785 2.2 12.225 2.2ZM6.375 1.7C6.375 1.275 6.715 0.935 7.14 0.935h1.65c0.425 0 0.765 0.34 0.765 0.765V2.2H6.375V1.7ZM3.45 3.425C3.45 3.315 3.54 3.225 3.65 3.225h8.625c0.11 0 0.2 0.09 0.2 0.2V3.9c0 0.11-0.09 0.2-0.2 0.2H3.65c-0.11 0-0.2-0.09-0.2-0.2V3.425ZM10.965 10.5H5.035c-0.255 0-0.425-0.17-0.45-0.425L4.36 4.675h7.28L11.415 10.075C11.39 10.33 11.22 10.5 10.965 10.5Z"
                  />
                  <path
                    d="M8.5 5.695C8.285 5.695 8.075 5.88 8.075 6.12V9.085C8.075 9.325 8.26 9.51 8.5 9.51C8.74 9.51 8.925 9.325 8.925 9.085V6.12C8.925 5.88 8.715 5.695 8.5 5.695Z"
                  />
                  <path
                    d="M9.895 5.695C9.68 5.695 9.47 5.88 9.47 6.12V9.085C9.47 9.325 9.655 9.51 9.895 9.51C10.135 9.51 10.32 9.325 10.32 9.085V6.12C10.32 5.88 10.135 5.695 9.895 5.695Z"
                  />
                  <path
                    d="M7.105 5.695C6.89 5.695 6.68 5.88 6.68 6.12V9.085C6.68 9.325 6.865 9.51 7.105 9.51C7.345 9.51 7.53 9.325 7.53 9.085V6.12C7.53 5.88 7.32 5.695 7.105 5.695Z"
                  />
                </svg>
              }
            >
              Delete
            </Button>
            <Button
              variant="secondary"
              onClick={handleBack}
              aria-label="Back to organisations list"
              startIcon={
                <svg
                  className="fill-current"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.2703 1.61719L5.61328 7.27422L11.2703 12.9312C11.4484 13.1094 11.4484 13.3984 11.2703 13.5766L10.6641 14.1828C10.4859 14.3609 10.1969 14.3609 10.0188 14.1828L3.42969 7.59375C3.25156 7.41562 3.25156 7.12656 3.42969 6.94844L10.0188 0.359375C10.1969 0.18125 10.4859 0.18125 10.6641 0.359375L11.2703 0.965625C11.4484 1.14375 11.4484 1.43281 11.2703 1.61719Z"
                  />
                </svg>
              }
            >
              Back
            </Button>
          </div>
        </div>
        
        {/* Sidebar - 1/3 width on large screens */}
        <div className="space-y-6">
          {/* Contacts Module */}
          <div className="rounded-2xl border border-stroke bg-white p-6 shadow-default dark:border-gray-800 dark:bg-white/[0.03]">
            <h4 className="mb-4 font-semibold text-gray-800 dark:text-white/90">
              Contacts
            </h4>
            <OrganisationContactList
              organisationId={id || ''}
              onViewContact={(contactId: string) => navigate(`/contacts/${contactId}`)}
              onEditContact={(contactId: string) => navigate(`/contacts/${contactId}/edit`)}
              onRemoveContact={() => {
                // Refresh the organisation details to update the contacts list
                if (id) fetchOrganisationById(id);
              }}
            />
            
            {/* Contact Association Form */}
            <div className="mt-4">
              <ContactAssociationForm
                organisationId={id || ''}
                onAssociationCreated={() => {
                  if (id) fetchOrganisationById(id);
                }}
              />
            </div>
          </div>
          
          {/* Quotes Module */}
          <div className="rounded-2xl border border-stroke bg-white p-6 shadow-default dark:border-gray-800 dark:bg-white/[0.03]">
            <h4 className="mb-4 font-semibold text-gray-800 dark:text-white/90">
              Quotes
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              View and manage quotes associated with this organisation.
            </p>
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => navigate(`/quotes/new?organisationId=${id}`)}
                className="w-full"
              >
                Create New Quote
              </Button>
            </div>
            {/* Quote list would go here */}
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
              No quotes associated with this organisation yet.
            </p>
          </div>
          
          {/* Leads Module */}
          <div className="rounded-2xl border border-stroke bg-white p-6 shadow-default dark:border-gray-800 dark:bg-white/[0.03]">
            <h4 className="mb-4 font-semibold text-gray-800 dark:text-white/90">
              Leads
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              View and manage leads associated with this organisation.
            </p>
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => navigate(`/leads/new?organisationId=${id}`)}
                className="w-full"
              >
                Create New Lead
              </Button>
            </div>
            {/* Lead list would go here */}
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
              No leads associated with this organisation yet.
            </p>
          </div>
          
          {/* Websites Module */}
          <div className="rounded-2xl border border-stroke bg-white p-6 shadow-default dark:border-gray-800 dark:bg-white/[0.03]">
            <h4 className="mb-4 font-semibold text-gray-800 dark:text-white/90">
              Websites
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              View and manage websites associated with this organisation.
            </p>
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => navigate(`/websites/new?organisationId=${id}`)}
                className="w-full"
              >
                Add Website
              </Button>
            </div>
            {/* Website list would go here */}
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
              No websites associated with this organisation yet.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrganisationDetails;