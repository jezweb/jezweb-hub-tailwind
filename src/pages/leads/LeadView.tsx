import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLeads } from '../../hooks/leads/useLeads';
import { useLeadsWithOrganisations } from '../../hooks/leads/useLeadsWithOrganisations';
import { useLeadsWithContacts } from '../../hooks/leads/useLeadsWithContacts';
import { useOrganisations } from '../../hooks/organisations/useOrganisations';
import { useContacts } from '../../hooks/contacts/useContacts';
import LeadDetail from './components/LeadDetail';
import LeadOrganisationForm from './components/LeadOrganisationForm';
import LeadContactForm from './components/LeadContactForm';

/**
 * LeadView Page
 * 
 * This page displays detailed information about a lead.
 * It includes the lead details, as well as forms for linking
 * the lead to organisations and contacts.
 */
const LeadView: React.FC = () => {
  const { leadId } = useParams<{ leadId: string }>();
  const navigate = useNavigate();
  
  // Base lead operations
  const {
    selectedLead,
    loadingLead,
    leadError,
    fetchLeadById,
    deleteLead
  } = useLeads();
  
  // Organisation-related operations
  const {
    linkLeadToOrganisation,
    unlinkLeadFromOrganisation
  } = useLeadsWithOrganisations();
  
  // Contact-related operations
  const {
    linkLeadToContact,
    unlinkLeadFromContact
  } = useLeadsWithContacts();
  
  // Organisation data and operations
  const {
    organisations,
    loading: loadingOrganisations,
    fetchOrganisations,
    searchOrganisations
  } = useOrganisations();
  
  // Contact data and operations
  const {
    contacts,
    loading: loadingContacts,
    fetchContacts,
    searchContacts
  } = useContacts();
  
  // Fetch lead data on component mount
  useEffect(() => {
    if (leadId) {
      fetchLeadById(leadId);
      
      // Fetch organisations and contacts
      fetchOrganisations();
      fetchContacts();
    }
  }, [leadId, fetchLeadById, fetchOrganisations, fetchContacts]);
  
  // Map organisations to the format expected by LeadOrganisationForm
  const mappedOrganisations = organisations.map(org => ({
    organisationId: org.organisationId,
    name: org.organisationName
  }));
  
  // Map contacts to the format expected by LeadContactForm
  const mappedContacts = contacts.map(contact => ({
    contactId: contact.contactId,
    fullName: contact.fullName,
    email: contact.email
  }));
  
  // Handle edit lead action
  const handleEditLead = (leadId: string) => {
    navigate(`/leads/${leadId}/edit`);
  };
  
  // Handle delete lead action
  const handleDeleteLead = async (leadId: string) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await deleteLead(leadId);
        navigate('/leads');
      } catch (error) {
        console.error('Error deleting lead:', error);
      }
    }
  };
  
  // Handle link to organisation action
  const handleLinkOrganisation = async (leadId: string, organisationId: string) => {
    try {
      // Find the organisation in the organisations array
      const organisation = organisations.find(org => org.organisationId === organisationId);
      
      if (!organisation) {
        throw new Error('Organisation not found');
      }
      
      // Use the actual organisation name
      await linkLeadToOrganisation(leadId, organisationId, organisation.organisationName);
      
      // Refresh lead data
      fetchLeadById(leadId);
    } catch (error) {
      console.error('Error linking lead to organisation:', error);
      throw error;
    }
  };
  
  // Handle unlink from organisation action
  const handleUnlinkOrganisation = async (leadId: string) => {
    try {
      await unlinkLeadFromOrganisation(leadId);
      // Refresh lead data
      fetchLeadById(leadId);
    } catch (error) {
      console.error('Error unlinking lead from organisation:', error);
      throw error;
    }
  };
  
  // Handle link to contacts action
  const handleLinkContacts = async (leadId: string, contactIds: string[]) => {
    try {
      // Link each contact individually
      for (const contactId of contactIds) {
        // Find the contact in the contacts array
        const contact = contacts.find(c => c.contactId === contactId);
        
        if (!contact) {
          console.error(`Contact with ID ${contactId} not found`);
          continue;
        }
        
        // Use the actual contact details
        const contactDetails = {
          fullName: contact.fullName,
          email: contact.email,
          phone: contact.phone || '',
          jobTitle: contact.jobTitle || ''
        };
        
        await linkLeadToContact(leadId, contactId, contactDetails);
      }
      
      // Refresh lead data
      fetchLeadById(leadId);
    } catch (error) {
      console.error('Error linking lead to contacts:', error);
      throw error;
    }
  };
  
  // Handle unlink from contact action
  const handleUnlinkContact = async (leadId: string, contactId: string) => {
    try {
      await unlinkLeadFromContact(leadId, contactId);
      // Refresh lead data
      fetchLeadById(leadId);
    } catch (error) {
      console.error('Error unlinking lead from contact:', error);
      throw error;
    }
  };
  
  // Show loading state
  if (loadingLead) {
    return (
      <div className="container mx-auto flex items-center justify-center px-4 py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900 dark:border-white"></div>
        <span className="ml-2">Loading lead data...</span>
      </div>
    );
  }
  
  // Show error state
  if (leadError || !selectedLead) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center dark:border-red-700 dark:bg-red-900/20">
          <h2 className="mb-2 text-xl font-bold text-red-800 dark:text-red-200">Error Loading Lead</h2>
          <p className="text-red-700 dark:text-red-300">
            {leadError?.message || 'Lead not found'}
          </p>
          <button
            onClick={() => navigate('/leads')}
            className="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Back to Leads
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate('/leads')}
          className="mb-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Leads
        </button>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Lead Details */}
        <div className="lg:col-span-2">
          <LeadDetail
            lead={selectedLead}
            isLoading={loadingLead}
            onEdit={handleEditLead}
            onDelete={handleDeleteLead}
          />
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Organisation Form */}
          <LeadOrganisationForm
            lead={selectedLead}
            organisations={mappedOrganisations}
            isLoading={loadingOrganisations}
            onLinkOrganisation={handleLinkOrganisation}
            onUnlinkOrganisation={handleUnlinkOrganisation}
          />
          
          {/* Contact Form */}
          <LeadContactForm
            lead={selectedLead}
            contacts={mappedContacts}
            isLoading={loadingContacts}
            onLinkContacts={handleLinkContacts}
            onUnlinkContact={handleUnlinkContact}
          />
        </div>
      </div>
    </div>
  );
};

export default LeadView;