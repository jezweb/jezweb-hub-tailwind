/**
 * QuoteView Page
 * 
 * This page displays detailed information about a quote.
 * It includes the quote details, as well as forms for linking
 * the quote to organisations, contacts, and leads.
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuotes } from '../../hooks/quotes/useQuotes';
import { useQuotesWithOrganisations } from '../../hooks/quotes/useQuotesWithOrganisations';
import { useQuotesWithContacts } from '../../hooks/quotes/useQuotesWithContacts';
import { useQuotesWithLeads } from '../../hooks/quotes/useQuotesWithLeads';
import QuoteDetail from './components/QuoteDetail';
import QuoteOrganisationForm from './components/QuoteOrganisationForm';
import QuoteContactForm from './components/QuoteContactForm';
import QuoteLeadForm from './components/QuoteLeadForm';
import { QuoteStatus } from '../../types/Quote';

/**
 * QuoteView component
 */
const QuoteView: React.FC = () => {
  const { quoteId } = useParams<{ quoteId: string }>();
  const navigate = useNavigate();
  
  // Base quote operations
  const {
    selectedQuote,
    loadingQuote,
    quoteError,
    fetchQuoteById,
    deleteQuote,
    updateQuoteStatus,
    generateQuotePDF,
    sendQuote
  } = useQuotes();
  
  // Organisation-related operations
  const {
    linkQuoteToOrganisation,
    unlinkQuoteFromOrganisation
  } = useQuotesWithOrganisations();
  
  // Contact-related operations
  const {
    linkQuoteToContact,
    unlinkQuoteFromContact
  } = useQuotesWithContacts();
  
  // Lead-related operations
  const {
    linkQuoteToLead,
    unlinkQuoteFromLead
  } = useQuotesWithLeads();
  
  // Mock data for organisations, contacts, and leads (to be replaced with actual data)
  const [organisations, setOrganisations] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [loadingOrganisations, setLoadingOrganisations] = useState<boolean>(false);
  const [loadingContacts, setLoadingContacts] = useState<boolean>(false);
  const [loadingLeads, setLoadingLeads] = useState<boolean>(false);
  
  // Fetch quote data on component mount
  useEffect(() => {
    if (quoteId) {
      fetchQuoteById(quoteId);
    }
  }, [quoteId, fetchQuoteById]);
  
  // Handle edit quote action
  const handleEditQuote = (quoteId: string) => {
    navigate(`/quotes/${quoteId}/edit`);
  };
  
  // Handle delete quote action
  const handleDeleteQuote = async (quoteId: string) => {
    if (window.confirm('Are you sure you want to delete this quote?')) {
      try {
        await deleteQuote(quoteId);
        navigate('/quotes');
      } catch (error) {
        console.error('Error deleting quote:', error);
      }
    }
  };
  
  // Handle status change action
  const handleStatusChange = async (quoteId: string, status: QuoteStatus) => {
    try {
      await updateQuoteStatus(quoteId, status);
      // Refresh quote data
      fetchQuoteById(quoteId);
    } catch (error) {
      console.error('Error updating quote status:', error);
      throw error;
    }
  };
  
  // Handle generate PDF action
  const handleGeneratePDF = (quoteId: string) => {
    try {
      generateQuotePDF(quoteId);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };
  
  // Handle send quote action
  const handleSendQuote = (quoteId: string) => {
    try {
      sendQuote(quoteId);
    } catch (error) {
      console.error('Error sending quote:', error);
    }
  };
  
  // Handle link to organisation action
  const handleLinkOrganisation = async (quoteId: string, organisationId: string, organisationName: string) => {
    try {
      await linkQuoteToOrganisation(quoteId, organisationId, organisationName);
      // Refresh quote data
      fetchQuoteById(quoteId);
    } catch (error) {
      console.error('Error linking quote to organisation:', error);
      throw error;
    }
  };
  
  // Handle unlink from organisation action
  const handleUnlinkOrganisation = async (quoteId: string) => {
    try {
      await unlinkQuoteFromOrganisation(quoteId);
      // Refresh quote data
      fetchQuoteById(quoteId);
    } catch (error) {
      console.error('Error unlinking quote from organisation:', error);
      throw error;
    }
  };
  
  // Handle link to contact action
  const handleLinkContact = async (quoteId: string, contactId: string, contactName: string) => {
    try {
      await linkQuoteToContact(quoteId, contactId, contactName);
      // Refresh quote data
      fetchQuoteById(quoteId);
    } catch (error) {
      console.error('Error linking quote to contact:', error);
      throw error;
    }
  };
  
  // Handle unlink from contact action
  const handleUnlinkContact = async (quoteId: string) => {
    try {
      await unlinkQuoteFromContact(quoteId);
      // Refresh quote data
      fetchQuoteById(quoteId);
    } catch (error) {
      console.error('Error unlinking quote from contact:', error);
      throw error;
    }
  };
  
  // Handle link to lead action
  const handleLinkLead = async (quoteId: string, leadId: string, leadName: string) => {
    try {
      await linkQuoteToLead(quoteId, leadId, leadName);
      // Refresh quote data
      fetchQuoteById(quoteId);
    } catch (error) {
      console.error('Error linking quote to lead:', error);
      throw error;
    }
  };
  
  // Handle unlink from lead action
  const handleUnlinkLead = async (quoteId: string) => {
    try {
      await unlinkQuoteFromLead(quoteId);
      // Refresh quote data
      fetchQuoteById(quoteId);
    } catch (error) {
      console.error('Error unlinking quote from lead:', error);
      throw error;
    }
  };
  
  // Show loading state
  if (loadingQuote) {
    return (
      <div className="container mx-auto flex items-center justify-center px-4 py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900 dark:border-white"></div>
        <span className="ml-2">Loading quote data...</span>
      </div>
    );
  }
  
  // Show error state
  if (quoteError || !selectedQuote) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center dark:border-red-700 dark:bg-red-900/20">
          <h2 className="mb-2 text-xl font-bold text-red-800 dark:text-red-200">Error Loading Quote</h2>
          <p className="text-red-700 dark:text-red-300">
            {quoteError?.message || 'Quote not found'}
          </p>
          <button
            onClick={() => navigate('/quotes')}
            className="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Back to Quotes
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate('/quotes')}
          className="mb-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Quotes
        </button>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quote Details */}
        <div className="lg:col-span-2">
          <QuoteDetail
            quote={selectedQuote}
            isLoading={loadingQuote}
            onEdit={handleEditQuote}
            onDelete={handleDeleteQuote}
            onStatusChange={handleStatusChange}
            onGeneratePDF={handleGeneratePDF}
            onSendQuote={handleSendQuote}
          />
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Organisation Form */}
          <QuoteOrganisationForm
            quote={selectedQuote}
            organisations={organisations}
            isLoading={loadingOrganisations}
            onLinkOrganisation={handleLinkOrganisation}
            onUnlinkOrganisation={handleUnlinkOrganisation}
          />
          
          {/* Contact Form */}
          <QuoteContactForm
            quote={selectedQuote}
            contacts={contacts}
            isLoading={loadingContacts}
            onLinkContact={handleLinkContact}
            onUnlinkContact={handleUnlinkContact}
          />
          
          {/* Lead Form */}
          <QuoteLeadForm
            quote={selectedQuote}
            leads={leads}
            isLoading={loadingLeads}
            onLinkLead={handleLinkLead}
            onUnlinkLead={handleUnlinkLead}
          />
        </div>
      </div>
    </div>
  );
};

export default QuoteView;