/**
 * ContactView Component
 * 
 * This component displays detailed information about a contact.
 * It includes the contact details, as well as modules for linking
 * the contact to organisations and leads.
 * 
 * Features:
 * - Displays comprehensive contact information
 * - Provides sidebar modules for related entities (organisations, leads)
 * - Supports linking/unlinking organisations and leads
 * - Shows loading states and error messages
 * - Handles navigation back to the contacts list
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useContacts } from '../../hooks/contacts/useContacts';
import { useOrganisationContacts } from '../../hooks/contacts/useOrganisationContacts';
import { useOrganisations } from '../../hooks/organisations/useOrganisations';
import { useLeads } from '../../hooks/leads/useLeads';
import { Contact } from '../../types/Contact';
import ContactDetail from './components/ContactDetail';
import ContactOrganisationForm from './components/ContactOrganisationForm';
import ContactLeadForm from './components/ContactLeadForm';

/**
 * ContactView component
 */
const ContactView: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  // Get contact data and actions from the hook
  const {
    selectedContact,
    loadingContact,
    contactError,
    fetchContactById,
    deleteContact
  } = useContacts();
  
  // Get organisation-contact relationship operations
  const {
    addContactToOrganisation,
    removeContactFromOrganisation
  } = useOrganisationContacts();
  
  // Get organisations and leads data
  const {
    organisations,
    loading: loadingOrganisations,
    fetchOrganisations
  } = useOrganisations();
  
  const {
    leads,
    loading: loadingLeads,
    fetchLeads
  } = useLeads();
  
  // State for related entities
  const [relatedOrganisations, setRelatedOrganisations] = useState<any[]>([]);
  const [relatedLeads, setRelatedLeads] = useState<any[]>([]);
  
  // Fetch contact data on component mount
  useEffect(() => {
    if (id) {
      fetchContactById(id);
    }
  }, [id, fetchContactById]);
  
  // Fetch organisations and leads data on component mount
  useEffect(() => {
    // Fetch organisations with a reasonable limit
    fetchOrganisations(undefined, 'organisationName', 'asc', 50);
    
    // Fetch leads with a reasonable limit
    fetchLeads(undefined, 'createdAt', 'desc', 50);
  }, [fetchOrganisations, fetchLeads]);
  
  // Handle edit contact action
  const handleEdit = (contact: Contact) => {
    navigate(`/contacts/${contact.contactId}/edit`);
  };
  
  // Handle delete contact action
  const handleDelete = () => {
    if (!selectedContact) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedContact.fullName}?`)) {
      deleteContact(selectedContact.contactId)
        .then(() => {
          navigate('/contacts');
        })
        .catch((error) => {
          console.error('Error deleting contact:', error);
        });
    }
  };
  
  // Handle back button
  const handleBack = () => {
    navigate('/contacts');
  };
  
  // Handle link to organisation action
  const handleLinkOrganisation = async (contactId: string, organisationId: string, role: string, isPrimary: boolean) => {
    try {
      await addContactToOrganisation({
        contactId,
        organisationId,
        role,
        isPrimary,
        priority: isPrimary ? 1 : 10
      });
      
      // Refresh contact data
      fetchContactById(contactId);
    } catch (error) {
      console.error('Error linking contact to organisation:', error);
      throw error;
    }
  };
  
  // Handle unlink from organisation action
  const handleUnlinkOrganisation = async (relationshipId: string) => {
    try {
      await removeContactFromOrganisation(relationshipId);
      
      // Refresh contact data
      if (id) {
        fetchContactById(id);
      }
    } catch (error) {
      console.error('Error unlinking contact from organisation:', error);
      throw error;
    }
  };
  
  // Handle link to lead action
  const handleLinkLead = async (contactId: string, leadId: string) => {
    try {
      // This is a placeholder - you'll need to implement the actual API call
      // to link a contact to a lead in your useLeads hook or similar
      console.log(`Linking contact ${contactId} to lead ${leadId}`);
      
      // For demonstration purposes, we'll just refresh the contact data
      // In a real implementation, you would call the API to link the contact to the lead
      fetchContactById(contactId);
    } catch (error) {
      console.error('Error linking contact to lead:', error);
      throw error;
    }
  };
  
  // Handle unlink from lead action
  const handleUnlinkLead = async (relationshipId: string) => {
    try {
      // This is a placeholder - you'll need to implement the actual API call
      // to unlink a contact from a lead in your useLeads hook or similar
      console.log(`Unlinking relationship ${relationshipId}`);
      
      // For demonstration purposes, we'll just refresh the contact data
      // In a real implementation, you would call the API to unlink the contact from the lead
      if (id) {
        fetchContactById(id);
      }
    } catch (error) {
      console.error('Error unlinking contact from lead:', error);
      throw error;
    }
  };
  
  // Ensure we have an ID
  if (!id) {
    return (
      <div className="mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> Contact ID is missing</span>
        </div>
      </div>
    );
  }
  
  // Show loading state
  if (loadingContact) {
    return (
      <div className="container mx-auto flex items-center justify-center px-4 py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900 dark:border-white"></div>
        <span className="ml-2">Loading contact data...</span>
      </div>
    );
  }
  
  // Show error state
  if (contactError || !selectedContact) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center dark:border-red-700 dark:bg-red-900/20">
          <h2 className="mb-2 text-xl font-bold text-red-800 dark:text-red-200">Error Loading Contact</h2>
          <p className="text-red-700 dark:text-red-300">
            {contactError?.message || 'Contact not found'}
          </p>
          <button
            onClick={() => navigate('/contacts')}
            className="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Back to Contacts
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>{selectedContact.fullName} | Jezweb Hub</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={handleBack}
            className="mb-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Contacts
          </button>
        </div>
        
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Contact Details */}
          <div className="lg:col-span-2">
            <ContactDetail
              contactId={id}
              onEdit={() => handleEdit(selectedContact)}
              onDelete={handleDelete}
              onBack={handleBack}
            />
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Organisation Association Section */}
            <ContactOrganisationForm
              contact={selectedContact}
              organisations={organisations}
              isLoading={loadingOrganisations}
              onLinkOrganisation={handleLinkOrganisation}
              onUnlinkOrganisation={handleUnlinkOrganisation}
            />
            
            {/* Lead Association Section */}
            <ContactLeadForm
              contact={selectedContact}
              leads={leads}
              isLoading={loadingLeads}
              onLinkLead={handleLinkLead}
              onUnlinkLead={handleUnlinkLead}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactView;