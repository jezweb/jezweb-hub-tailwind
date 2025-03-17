/**
 * QuoteView with Design System
 * 
 * This is an example implementation of the QuoteView page using the new design system components.
 * It demonstrates how to migrate from the old styling to the new standardized components.
 */

import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuotes } from '../../../hooks/quotes/useQuotes';
import { useQuotesWithOrganisations } from '../../../hooks/quotes/useQuotesWithOrganisations';
import { useQuotesWithContacts } from '../../../hooks/quotes/useQuotesWithContacts';
import { useQuotesWithLeads } from '../../../hooks/quotes/useQuotesWithLeads';
import { useOrganisations } from '../../../hooks/organisations/useOrganisations';
import { useContacts } from '../../../hooks/contacts/useContacts';
import { useLeads } from '../../../hooks/leads/useLeads';
import QuoteDetail from '../components/QuoteDetail';
import QuoteOrganisationForm from '../components/QuoteOrganisationForm';
import QuoteContactForm from '../components/QuoteContactForm';
import QuoteLeadForm from '../components/QuoteLeadForm';
import { QuoteStatus } from '../../../types/Quote';
import { 
  Container, 
  PageHeading, 
  LoadingState, 
  ErrorMessage,
  Card
} from '../../../components/ui/design-system';

/**
 * QuoteViewWithDesignSystem component
 * 
 * This component demonstrates how to use the design system components
 * to create a consistent and maintainable UI for the quote view page.
 */
const QuoteViewWithDesignSystem: React.FC = () => {
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
  // Get organisations data
  const {
    organisations,
    loading: loadingOrganisations,
    fetchOrganisations
  } = useOrganisations();
  
  // Get contacts data
  const {
    contacts,
    loading: loadingContacts,
    fetchContacts
  } = useContacts();
  
  // Get leads data
  const {
    leads,
    loading: loadingLeads,
    fetchLeads
  } = useLeads();
  
  
  // Fetch quote data on component mount
  useEffect(() => {
    if (quoteId) {
      fetchQuoteById(quoteId);
    }
  }, [quoteId, fetchQuoteById]);
  
  // Fetch organisations, contacts, and leads data on component mount
  useEffect(() => {
    fetchOrganisations();
    fetchContacts();
    fetchLeads();
  }, [fetchOrganisations, fetchContacts, fetchLeads]);
  
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
    return <LoadingState message="Loading quote data..." fullPage />;
  }
  
  // Show error state
  if (quoteError || !selectedQuote) {
    return (
      <Container>
        <ErrorMessage
          title="Error Loading Quote"
          message={quoteError?.message || 'Quote not found'}
          onRetry={() => navigate('/quotes')}
        />
      </Container>
    );
  }
  
  return (
    <Container>
      <PageHeading
        title={selectedQuote.subject || 'Quote Details'}
        description={`Quote #${selectedQuote.quoteNumber || selectedQuote.quoteId}`}
        backLink={{
          to: '/quotes',
          label: 'Back to Quotes'
        }}
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
          <Card>
            <QuoteOrganisationForm
              quote={selectedQuote}
              organisations={organisations}
              isLoading={loadingOrganisations}
              onLinkOrganisation={handleLinkOrganisation}
              onUnlinkOrganisation={handleUnlinkOrganisation}
            />
          </Card>
          
          {/* Contact Form */}
          <Card>
            <QuoteContactForm
              quote={selectedQuote}
              contacts={contacts}
              isLoading={loadingContacts}
              onLinkContact={handleLinkContact}
              onUnlinkContact={handleUnlinkContact}
            />
          </Card>
          
          {/* Lead Form */}
          <Card>
            <QuoteLeadForm
              quote={selectedQuote}
              leads={leads}
              isLoading={loadingLeads}
              onLinkLead={handleLinkLead}
              onUnlinkLead={handleUnlinkLead}
            />
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default QuoteViewWithDesignSystem;