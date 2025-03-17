/**
 * QuoteView Page (Refactored)
 * 
 * This is an example of how to refactor the QuoteView page to use the design system components.
 * It demonstrates the use of standardized components for consistent styling.
 */

import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuotes } from '../../../hooks/quotes/useQuotes';
import { useQuotesWithOrganisations } from '../../../hooks/quotes/useQuotesWithOrganisations';
import { useQuotesWithContacts } from '../../../hooks/quotes/useQuotesWithContacts';
import { useQuotesWithLeads } from '../../../hooks/quotes/useQuotesWithLeads';
import QuoteDetail from '../components/QuoteDetail';
import QuoteOrganisationForm from '../components/QuoteOrganisationForm';
import QuoteContactForm from '../components/QuoteContactForm';
import QuoteLeadForm from '../components/QuoteLeadForm';
import { QuoteStatus } from '../../../types/Quote';
import {
  QuoteContainer,
  QuoteHeading,
  QuoteLoadingState,
  QuoteErrorMessage,
  QuoteActionButton
} from '../../../components/quotes/design-system';

/**
 * QuoteViewRefactored component
 * 
 * This is a refactored version of the QuoteView component using the design system.
 */
const QuoteViewRefactored: React.FC = () => {
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
  const [organisations, setOrganisations] = React.useState<any[]>([]);
  const [contacts, setContacts] = React.useState<any[]>([]);
  const [leads, setLeads] = React.useState<any[]>([]);
  const [loadingOrganisations, setLoadingOrganisations] = React.useState<boolean>(false);
  const [loadingContacts, setLoadingContacts] = React.useState<boolean>(false);
  const [loadingLeads, setLoadingLeads] = React.useState<boolean>(false);
  
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
      <QuoteContainer>
        <QuoteLoadingState message="Loading quote data..." />
      </QuoteContainer>
    );
  }
  
  // Show error state
  if (quoteError || !selectedQuote) {
    return (
      <QuoteContainer>
        <QuoteErrorMessage
          title="Error Loading Quote"
          message={quoteError?.message || 'Quote not found'}
          onRetry={() => quoteId && fetchQuoteById(quoteId)}
        />
        <div className="mt-4">
          <QuoteActionButton
            variant="secondary"
            onClick={() => navigate('/quotes')}
          >
            Back to Quotes
          </QuoteActionButton>
        </div>
      </QuoteContainer>
    );
  }
  
  return (
    <QuoteContainer>
      <QuoteHeading
        title={selectedQuote.subject}
        description={`Quote #${selectedQuote.quoteNumber}`}
        backLink={{
          to: '/quotes',
          label: 'Back to Quotes',
          onClick: () => navigate('/quotes')
        }}
        actions={
          <div className="flex space-x-2">
            <QuoteActionButton
              variant="outline"
              onClick={() => handleGeneratePDF(selectedQuote.quoteId)}
              title="Generate PDF"
            >
              Generate PDF
            </QuoteActionButton>
            <QuoteActionButton
              variant="primary"
              onClick={() => handleSendQuote(selectedQuote.quoteId)}
              title="Send quote"
            >
              Send Quote
            </QuoteActionButton>
          </div>
        }
      />
      
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
    </QuoteContainer>
  );
};

export default QuoteViewRefactored;