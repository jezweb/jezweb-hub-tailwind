/**
 * SettingsPage Component
 * 
 * This component provides a page for managing application settings.
 * It includes sections for:
 * - Form Fields Management (roles, statuses, industries)
 * 
 * The page is accessible to administrators only and provides a consistent
 * layout for the settings management process.
 */

import React from 'react';
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import FormFieldsManager from './FormFieldsManager';

/**
 * SettingsPage component
 */
const SettingsPage: React.FC = () => {
  return (
    <>
      <PageMeta
        title="Settings | Jezweb Hub"
        description="Manage application settings and configurations"
      />
      
      <PageBreadcrumb 
        pageTitle="Settings" 
        items={[]}
      />
      
      <div className="space-y-6">
        <FormFieldsManager />
      </div>
    </>
  );
};

export default SettingsPage;