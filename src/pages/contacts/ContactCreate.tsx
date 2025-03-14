/**
 * ContactCreate Component
 * 
 * This component provides a page for creating new contacts.
 * It uses the ContactForm component to handle the form inputs and submission.
 * 
 * The component handles navigation and provides a consistent layout for the
 * contact creation process.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ContactForm from './components/ContactForm';

/**
 * ContactCreate component
 */
const ContactCreate: React.FC = () => {
  const navigate = useNavigate();
  
  /**
   * Handle successful form submission
   */
  const handleSuccess = (contactId: string) => {
    navigate(`/contacts/${contactId}`);
  };
  
  /**
   * Handle form cancellation
   */
  const handleCancel = () => {
    navigate('/contacts');
  };
  
  return (
    <>
      <PageMeta
        title="Create Contact | Jezweb Hub"
        description="Create a new contact with personal and professional information"
      />
      
      <PageBreadcrumb 
        pageTitle="Create New Contact" 
        items={[{ label: 'Contacts', path: '/contacts' }]}
      />
      
      <ContactForm
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        isCreate={true}
      />
    </>
  );
};

export default ContactCreate;