/**
 * WebsiteEdit Page
 * 
 * This page provides a form for editing an existing website.
 * It uses the WebsiteForm component and the useWebsites hook.
 */

import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { useWebsites } from '../../hooks/websites/useWebsites';
import WebsiteForm from './components/WebsiteForm';

const WebsiteEdit: React.FC = () => {
  const { websiteId } = useParams<{ websiteId: string }>();
  const navigate = useNavigate();
  const {
    selectedWebsite,
    fetchWebsiteById,
    updateWebsite,
    submitting,
    loadingWebsite,
    websiteError,
    submitError
  } = useWebsites();
  
  // Fetch website data when component mounts
  useEffect(() => {
    if (websiteId) {
      fetchWebsiteById(websiteId);
    }
  }, [websiteId, fetchWebsiteById]);
  
  // Handle website not found
  useEffect(() => {
    if (websiteError) {
      navigate('/websites', { replace: true });
    }
  }, [websiteError, navigate]);
  
  // Handle form submission
  const handleSubmit = async (data: any) => {
    if (websiteId) {
      await updateWebsite(websiteId, data);
    }
  };
  
  return (
    <>
      <Helmet>
        <title>Edit Website | Jezweb Hub</title>
      </Helmet>
      
      <div className="mx-auto max-w-270">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-black dark:text-white">
            Edit Website
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Update website information
          </p>
        </div>
        
        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          {loadingWebsite ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
            </div>
          ) : selectedWebsite ? (
            <WebsiteForm
              initialData={selectedWebsite}
              onSubmit={handleSubmit}
              isSubmitting={submitting}
              submitError={submitError}
            />
          ) : (
            <div className="flex h-40 items-center justify-center">
              <p className="text-lg text-gray-500 dark:text-gray-400">Website not found</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default WebsiteEdit;