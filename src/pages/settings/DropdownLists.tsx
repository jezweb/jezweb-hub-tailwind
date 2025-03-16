/**
 * Dropdown Lists Page
 * 
 * This page provides an interface for managing dropdown list values used throughout the application.
 * It uses the FormFieldsManager component to provide a tabbed interface for managing different types
 * of dropdown fields including:
 * - Website Statuses
 * - Hosting Providers
 * - CMS Types
 * 
 * These field values are used in forms like the WebsiteForm component.
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import FormFieldsManager from '../../components/settings/FormFieldsManager';

/**
 * DropdownLists component
 */
const DropdownLists: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Dropdown Lists | Jezweb Hub</title>
      </Helmet>
      
      <PageBreadcrumb 
        pageTitle="Dropdown Lists" 
        items={[]}
      />
      
      <div className="grid grid-cols-1 gap-6">
        <div className="rounded-2xl border border-stroke bg-white p-6 shadow-default dark:border-gray-800 dark:bg-white/[0.03]">
          <h4 className="mb-6 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
            Manage Dropdown Lists
          </h4>
          
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Use this page to manage dropdown list values used throughout the application. These values are used in forms and filters.
          </p>
          
          <FormFieldsManager />
        </div>
      </div>
    </>
  );
};

export default DropdownLists;