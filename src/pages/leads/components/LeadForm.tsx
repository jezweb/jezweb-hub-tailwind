import React, { useState, useEffect } from 'react';
import { useLeadFormFields } from '../../../hooks/leads/useLeadFormFields';
import { Lead, LeadFormData, LeadStatus } from '../../../types/Lead';

/**
 * LeadForm Component
 * 
 * This component provides a form for creating and editing leads.
 * It handles form validation, submission, and integrates with form field values
 * for statuses and sources.
 */
interface LeadFormProps {
  lead?: Lead;
  isSubmitting: boolean;
  onSubmit: (data: LeadFormData) => Promise<void>;
  onCancel: () => void;
}

const LeadForm: React.FC<LeadFormProps> = ({
  lead,
  isSubmitting,
  onSubmit,
  onCancel
}) => {
  // Get form field values from the useFormFields hook
  const { leadSources, statusValues, loading: loadingFormFields } = useLeadFormFields();
  
  // Form state
  const [formData, setFormData] = useState<LeadFormData>({
    contactPerson: {
      fullName: '',
      email: '',
      phone: '',
      jobTitle: ''
    },
    organisationName: '',
    source: '',
    status: 'new',
    notes: '',
    organisationId: null,
    contactIds: []
  });
  
  // Form validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Initialize form with lead data if editing
  useEffect(() => {
    if (lead) {
      setFormData({
        leadId: lead.leadId,
        contactPerson: {
          fullName: lead.contactPerson.fullName,
          email: lead.contactPerson.email,
          phone: lead.contactPerson.phone || '',
          jobTitle: lead.contactPerson.jobTitle || ''
        },
        organisationName: lead.organisationName || '',
        source: lead.source,
        status: lead.status,
        notes: lead.notes || '',
        organisationId: lead.organisationId,
        contactIds: lead.contactIds || []
      });
    }
  }, [lead]);
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('contactPerson.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        contactPerson: {
          ...prev.contactPerson,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Required fields
    if (!formData.contactPerson.fullName.trim()) {
      newErrors['contactPerson.fullName'] = 'Full name is required';
    }
    
    if (!formData.contactPerson.email.trim()) {
      newErrors['contactPerson.email'] = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.contactPerson.email)) {
      newErrors['contactPerson.email'] = 'Email is invalid';
    }
    
    if (!formData.source) {
      newErrors['source'] = 'Source is required';
    }
    
    if (!formData.status) {
      newErrors['status'] = 'Status is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        await onSubmit(formData);
      } catch (error) {
        console.error('Error submitting lead form:', error);
      }
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-md border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
          Contact Information
        </h3>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Full Name */}
          <div>
            <label htmlFor="contactPerson.fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="contactPerson.fullName"
              name="contactPerson.fullName"
              value={formData.contactPerson.fullName}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border ${
                errors['contactPerson.fullName'] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm`}
            />
            {errors['contactPerson.fullName'] && (
              <p className="mt-1 text-sm text-red-500">{errors['contactPerson.fullName']}</p>
            )}
          </div>
          
          {/* Job Title */}
          <div>
            <label htmlFor="contactPerson.jobTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Job Title
            </label>
            <input
              type="text"
              id="contactPerson.jobTitle"
              name="contactPerson.jobTitle"
              value={formData.contactPerson.jobTitle}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
            />
          </div>
          
          {/* Email */}
          <div>
            <label htmlFor="contactPerson.email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="contactPerson.email"
              name="contactPerson.email"
              value={formData.contactPerson.email}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border ${
                errors['contactPerson.email'] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm`}
            />
            {errors['contactPerson.email'] && (
              <p className="mt-1 text-sm text-red-500">{errors['contactPerson.email']}</p>
            )}
          </div>
          
          {/* Phone */}
          <div>
            <label htmlFor="contactPerson.phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Phone
            </label>
            <input
              type="tel"
              id="contactPerson.phone"
              name="contactPerson.phone"
              value={formData.contactPerson.phone}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
            />
          </div>
        </div>
      </div>
      
      <div className="rounded-md border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
          Organisation Information
        </h3>
        
        <div>
          <label htmlFor="organisationName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Organisation Name
          </label>
          <input
            type="text"
            id="organisationName"
            name="organisationName"
            value={formData.organisationName || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            You can link this lead to an organisation later
          </p>
        </div>
      </div>
      
      <div className="rounded-md border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
          Lead Details
        </h3>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Source */}
          <div>
            <label htmlFor="source" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Source <span className="text-red-500">*</span>
            </label>
            <select
              id="source"
              name="source"
              value={formData.source}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border ${
                errors.source ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm`}
            >
              <option value="">Select a source</option>
              {loadingFormFields ? (
                <option value="" disabled>Loading sources...</option>
              ) : (
                leadSources.map((source) => (
                  <option key={source} value={source}>
                    {source}
                  </option>
                ))
              )}
            </select>
            {errors.source && (
              <p className="mt-1 text-sm text-red-500">{errors.source}</p>
            )}
          </div>
          
          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border ${
                errors.status ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm`}
            >
              <option value="">Select a status</option>
              {loadingFormFields ? (
                <option value="" disabled>Loading statuses...</option>
              ) : (
                statusValues.map((statusOption) => (
                  <option key={statusOption.value} value={statusOption.value}>
                    {statusOption.label}
                  </option>
                ))
              )}
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-500">{errors.status}</p>
            )}
          </div>
        </div>
        
        {/* Notes */}
        <div className="mt-6">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            value={formData.notes}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : lead ? 'Update Lead' : 'Create Lead'}
        </button>
      </div>
    </form>
  );
};

export default LeadForm;