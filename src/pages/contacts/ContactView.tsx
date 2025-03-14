/**
 * ContactView Component
 * 
 * This component provides a page for viewing contact details.
 * It uses the ContactDetail component to display the contact information.
 * 
 * The component fetches the contact data, handles navigation, and provides
 * a consistent layout for viewing contact details.
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import ContactDetail from './components/ContactDetail';
import { Contact } from '../../types/Contact';

/**
 * ContactView component
 */
const ContactView: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  /**
   * Handle editing a contact
   */
  const handleEdit = (contact: Contact) => {
    navigate(`/contacts/${contact.contactId}/edit`);
  };
  
  /**
   * Handle deleting a contact
   */
  const handleDelete = () => {
    navigate('/contacts');
  };
  
  /**
   * Handle back button
   */
  const handleBack = () => {
    navigate('/contacts');
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
  
  return (
    <>
      <Helmet>
        <title>Contact Details | Jezweb Hub</title>
      </Helmet>
      
      <div className="mx-auto p-4 sm:p-6 lg:p-8">
        <ContactDetail
          contactId={id}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onBack={handleBack}
        />
      </div>
    </>
  );
};

export default ContactView;