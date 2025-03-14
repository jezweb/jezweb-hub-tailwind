/**
 * FormFieldsManager Component
 * 
 * This component provides a tabbed interface for managing different types of form fields.
 * It allows administrators to view, add, edit, and delete field values for:
 * - Contact Roles
 * - Contact Statuses
 * - Industries
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
    { id: 'industries', label: 'Industries' }
  ];
  
  // Handle tab click
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };
  
  return (
    <div className="rounded-2xl border border-stroke bg-white p-6 shadow-default dark:border-gray-800 dark:bg-white/[0.03]">
      <h2 className="mb-6 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
        Form Fields Manager
      </h2>
      
      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px" role="tablist">
          {tabs.map(tab => (
            <li key={tab.id} className="mr-2" role="presentation">
              <button
                onClick={() => handleTabClick(tab.id)}
                className={`inline-block p-4 border-b-2 rounded-t-lg ${
                  activeTab === tab.id
                    ? 'text-primary border-primary dark:text-primary dark:border-primary'
                    : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                }`}
                id={`tab-${tab.id}`}
                role="tab"
                aria-controls={`panel-${tab.id}`}
                aria-selected="false"
                type="button"
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Tab content */}
      {tabs.map(tab => (
        <div
          key={tab.id}
          id={`panel-${tab.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${tab.id}`}
          className={activeTab === tab.id ? 'block' : 'hidden'}
        >
          <FormFieldEditor fieldType={tab.id} />
        </div>
      ))}
    </div>
  );
};

export default FormFieldsManager;