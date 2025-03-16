/**
 * FormFieldsManager Component
 *
 * This component provides a tabbed interface for managing different types of form fields.
 * It uses a vertical tab layout to accommodate a growing number of field types.
 * 
 * It allows administrators to view, add, edit, and delete field values for:
 * - Contact Roles
 * - Contact Statuses
 * - Industries
 * - Website Statuses
 * - Hosting Providers
 * - CMS Types
 *
 * Each tab uses the FormFieldEditor component to manage the specific field type.
 */

import React, { useState } from 'react';
import FormFieldEditor from './FormFieldEditor';

interface FormFieldsManagerProps {
  // No props needed for now
}

/**
 * FormFieldsManager component for managing form field values
 */
const FormFieldsManager: React.FC<FormFieldsManagerProps> = () => {
  const [activeTab, setActiveTab] = useState<string>('contactRoles');
  
  // Define tabs for different field types
  const tabs = [
    { id: 'contactRoles', label: 'Contact Roles' },
    { id: 'contactStatuses', label: 'Contact Statuses' },
    { id: 'industries', label: 'Industries' },
    { id: 'websiteStatuses', label: 'Website Statuses' },
    { id: 'hostingProviders', label: 'Hosting Providers' },
    { id: 'cmsTypes', label: 'CMS Types' },
    { id: 'leadSource', label: 'Lead Sources' },
    { id: 'leadStatus', label: 'Lead Statuses' }
  ];
  
  // Handle tab click
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };
  
  return (
    <div className="rounded-2xl border border-stroke bg-white shadow-default dark:border-gray-800 dark:bg-white/[0.03]">
      <h2 className="p-6 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl border-b border-gray-200 dark:border-gray-700">
        Form Fields Manager
      </h2>
      
      <div className="flex flex-col md:flex-row">
        {/* Vertical Tabs */}
        <div className="w-full md:w-1/4 border-r border-gray-200 dark:border-gray-700">
          <ul className="flex flex-col" role="tablist">
            {tabs.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <li key={tab.id} role="presentation">
                  {isActive ? (
                    <button
                      onClick={() => handleTabClick(tab.id)}
                      className="w-full text-left px-6 py-4 border-l-4 border-primary bg-gray-50 text-primary dark:bg-gray-800 dark:text-primary"
                      id={`tab-${tab.id}`}
                      role="tab"
                      aria-controls={`panel-${tab.id}`}
                      aria-selected="true"
                      type="button"
                    >
                      {tab.label}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleTabClick(tab.id)}
                      className="w-full text-left px-6 py-4 border-l-4 border-transparent hover:bg-gray-50 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                      id={`tab-${tab.id}`}
                      role="tab"
                      aria-controls={`panel-${tab.id}`}
                      aria-selected="false"
                      type="button"
                    >
                      {tab.label}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
        
        {/* Tab content */}
        <div className="w-full md:w-3/4 p-6">
          {tabs.map(tab => (
            <div
              key={tab.id}
              id={`panel-${tab.id}`}
              role="tabpanel"
              aria-labelledby={`tab-${tab.id}`}
              className={activeTab === tab.id ? 'block' : 'hidden'}
            >
              <h3 className="mb-4 font-semibold text-xl text-gray-800 dark:text-white">
                {tab.label}
              </h3>
              <FormFieldEditor
                fieldType={tab.id}
                displayName={tab.id === 'websiteStatuses' ? 'Website Status' :
                             tab.id === 'hostingProviders' ? 'Hosting Provider' :
                             tab.id === 'cmsTypes' ? 'CMS Type' :
                             tab.id === 'contactRoles' ? 'Role' :
                             tab.id === 'contactStatuses' ? 'Status' :
                             tab.id === 'leadSource' ? 'Lead Source' :
                             tab.id === 'leadStatus' ? 'Lead Status' : 'Industry'}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FormFieldsManager;