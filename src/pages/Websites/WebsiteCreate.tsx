/**
 * WebsiteCreate Page
 * 
 * This page provides a form for creating a new website.
 * It uses the WebsiteForm component and the useWebsites hook.
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useWebsites } from '../../hooks/websites/useWebsites';
import WebsiteForm from './components/WebsiteForm';

const WebsiteCreate: React.FC = () => {
  const { createWebsite, submitting, submitError } = useWebsites();
  
  return (
    <>
      <Helmet>
        <title>Create Website | Jezweb Hub</title>
      </Helmet>
      
      <div className="mx-auto max-w-270">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-black dark:text-white">
            Create New Website
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Add a new website to the system
          </p>
        </div>
        
        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <WebsiteForm
            onSubmit={createWebsite}
            isSubmitting={submitting}
            submitError={submitError}
          />
        </div>
      </div>
    </>
  );
};

export default WebsiteCreate;