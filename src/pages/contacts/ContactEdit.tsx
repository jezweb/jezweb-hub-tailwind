/**
 * ContactEdit Component
 * 
 * This component provides a page for editing existing contacts.
 * It uses the ContactForm component to handle the form inputs and submission.
 * 
 * The component fetches the contact data, handles navigation, and provides
 * a consistent layout for the contact editing process.
 */

import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ContactForm from './components/ContactForm';
import { useContacts } from '../../hooks/contacts/useContacts';

/**
 * ContactEdit component
 */
const ContactEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  // Get contact data and actions from the hook
  const {
    selectedContact,
    loadingContact,
    contactError,
    fetchContactById,
    clearSelectedContact
  } = useContacts();
  
  // Fetch contact data on component mount
  useEffect(() => {
    if (id) {
      fetchContactById(id);
    }
    
    // Clear selected contact on component unmount
    return () => {
      clearSelectedContact();
    };
  }, [id, fetchContactById, clearSelectedContact]);
  
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
    if (id) {
      navigate(`/contacts/${id}`);
    } else {
      navigate('/contacts');
    }
  };
  
  // Show error state
  if (contactError) {
    return (
      <>
        <PageBreadcrumb 
          pageTitle="Error" 
          items={[{ label: 'Contacts', path: '/contacts' }]}
        />
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {contactError.message}</span>
        </div>
      </>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>{selectedContact ? `Edit ${selectedContact.fullName}` : 'Edit Contact'} | Jezweb Hub</title>
      </Helmet>
      
      <PageBreadcrumb 
        pageTitle={selectedContact ? `Edit ${selectedContact.fullName}` : 'Edit Contact'} 
        items={[{ label: 'Contacts', path: '/contacts' }]}
      />
      
      {loadingContact ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <ContactForm
          contactId={id}
          initialData={selectedContact ? {
            firstName: selectedContact.firstName,
            lastName: selectedContact.lastName,
            email: selectedContact.email,
            phone: selectedContact.phone || '',
            mobile: selectedContact.mobile || '',
            jobTitle: selectedContact.jobTitle || '',
            department: selectedContact.department || '',
            notes: selectedContact.notes || '',
            role: selectedContact.role || 'staff',
            status: selectedContact.status || 'active'
          } : undefined}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      )}
    </>
  );
};

export default ContactEdit;