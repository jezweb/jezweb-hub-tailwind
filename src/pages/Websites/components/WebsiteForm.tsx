/**
 * WebsiteForm Component
 *
 * This component provides a form for creating and editing websites.
 * It handles form validation, submission, and error handling.
 *
 * It uses the useWebsiteFormFields hook to fetch managed field values for:
 * - Website Statuses
 * - Hosting Providers
 * - CMS Types
 *
 * These field values are managed through the FormFieldsManager component.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { WebsiteFormData, WebsiteStatus } from '../../../types/Website';
import { useOrganisations } from '../../../hooks/organisations/useOrganisations';
import { useWebsiteFormFields } from '../../../hooks/websites/useWebsiteFormFields';

interface WebsiteFormProps {
  initialData?: Partial<WebsiteFormData>;
  onSubmit: (data: WebsiteFormData) => Promise<void>;
  isSubmitting: boolean;
  submitError: Error | null;
}

const WebsiteForm: React.FC<WebsiteFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting,
  submitError
}) => {
  const navigate = useNavigate();
  const { organisations, loading: loadingOrganisations, fetchOrganisations } = useOrganisations();
  
  // Load form field values from FormFieldsManager using the custom hook
  const {
    statusValues,
    hostingProviderValues,
    cmsTypeValues,
    loading: loadingFieldValues
  } = useWebsiteFormFields();
  
  // Form state
  const [formData, setFormData] = useState<Partial<WebsiteFormData>>({
    domain: '',
    status: 'active' as WebsiteStatus,
    organisationId: '',
    hosting: {
      provider: '',
    },
    cms: {
      type: '',
    },
    ...initialData
  });
  
  // Form errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Load organisations when component mounts
  useEffect(() => {
    fetchOrganisations();
  }, [fetchOrganisations]);
  
  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData(prevData => ({
        ...prevData,
        ...initialData
      }));
    }
  }, [initialData]);
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle nested properties
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      
      setFormData(prevData => {
        // Create a new object for the nested property
        let updatedNestedObj: Record<string, any> = {};
        
        // If the parent property exists, copy its current values
        if (prevData[parent as keyof WebsiteFormData]) {
          updatedNestedObj = { ...prevData[parent as keyof WebsiteFormData] as Record<string, any> };
        }
        
        // Update the specific child property
        updatedNestedObj[child] = value;
        
        // Return the updated form data
        return {
          ...prevData,
          [parent]: updatedNestedObj
        };
      });
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
      }));
    }
  };
  
  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Required fields
    if (!formData.domain) {
      newErrors.domain = 'Domain is required';
    }
    
    if (!formData.organisationId) {
      newErrors.organisationId = 'Organisation is required';
    }
    
    if (!formData.status) {
      newErrors.status = 'Status is required';
    }
    
    if (!formData.hosting?.provider) {
      newErrors['hosting.provider'] = 'Hosting provider is required';
    }
    
    if (!formData.cms?.type) {
      newErrors['cms.type'] = 'CMS type is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        await onSubmit(formData as WebsiteFormData);
        navigate('/websites');
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  };
  
  // Handle cancel
  const handleCancel = () => {
    navigate('/websites');
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Organisation */}
      <div>
        <label htmlFor="organisationId" className="mb-2.5 block font-medium text-black dark:text-white">
          Organisation
        </label>
        <select
          id="organisationId"
          name="organisationId"
          value={formData.organisationId || ''}
          onChange={handleChange}
          className={`w-full rounded border-[1.5px] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
            errors.organisationId ? 'border-danger' : 'border-stroke'
          }`}
          disabled={isSubmitting || loadingOrganisations}
        >
          <option value="">Select Organisation</option>
          {organisations.map(org => (
            <option key={org.organisationId} value={org.organisationId}>
              {org.organisationName}
            </option>
          ))}
        </select>
        {errors.organisationId && (
          <p className="mt-1 text-xs text-danger">{errors.organisationId}</p>
        )}
      </div>
      
      {/* Domain */}
      <div>
        <label htmlFor="domain" className="mb-2.5 block font-medium text-black dark:text-white">
          Domain
        </label>
        <input
          type="text"
          id="domain"
          name="domain"
          value={formData.domain || ''}
          onChange={handleChange}
          placeholder="example.com"
          className={`w-full rounded border-[1.5px] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
            errors.domain ? 'border-danger' : 'border-stroke'
          }`}
          disabled={isSubmitting}
        />
        {errors.domain && (
          <p className="mt-1 text-xs text-danger">{errors.domain}</p>
        )}
      </div>
      
      {/* Status */}
      <div>
        <label htmlFor="status" className="mb-2.5 block font-medium text-black dark:text-white">
          Status
        </label>
        <select
          id="status"
          name="status"
          value={formData.status || ''}
          onChange={handleChange}
          className={`w-full rounded border-[1.5px] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
            errors.status ? 'border-danger' : 'border-stroke'
          }`}
          disabled={isSubmitting || loadingFieldValues}
        >
          <option value="">Select Status</option>
          {statusValues.length > 0 ? (
            statusValues.map(status => (
              <option key={status.id} value={status.value}>
                {status.label}
              </option>
            ))
          ) : (
            // Fallback options if no managed values are available
            <>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="development">Development</option>
              <option value="staging">Staging</option>
              <option value="suspended">Suspended</option>
            </>
          )}
        </select>
        {errors.status && (
          <p className="mt-1 text-xs text-danger">{errors.status}</p>
        )}
      </div>
      
      {/* Hosting Provider */}
      <div>
        <label htmlFor="hosting.provider" className="mb-2.5 block font-medium text-black dark:text-white">
          Hosting Provider
        </label>
        <select
          id="hosting.provider"
          name="hosting.provider"
          value={formData.hosting?.provider || ''}
          onChange={handleChange}
          className={`w-full rounded border-[1.5px] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
            errors['hosting.provider'] ? 'border-danger' : 'border-stroke'
          }`}
          disabled={isSubmitting || loadingFieldValues}
        >
          <option value="">Select Hosting Provider</option>
          {hostingProviderValues.map(provider => (
            <option key={provider.id} value={provider.value}>
              {provider.label}
            </option>
          ))}
        </select>
        {errors['hosting.provider'] && (
          <p className="mt-1 text-xs text-danger">{errors['hosting.provider']}</p>
        )}
      </div>
      
      {/* CMS Type */}
      <div>
        <label htmlFor="cms.type" className="mb-2.5 block font-medium text-black dark:text-white">
          CMS Type
        </label>
        <select
          id="cms.type"
          name="cms.type"
          value={formData.cms?.type || ''}
          onChange={handleChange}
          className={`w-full rounded border-[1.5px] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
            errors['cms.type'] ? 'border-danger' : 'border-stroke'
          }`}
          disabled={isSubmitting || loadingFieldValues}
        >
          <option value="">Select CMS Type</option>
          {cmsTypeValues.map(cmsType => (
            <option key={cmsType.id} value={cmsType.value}>
              {cmsType.label}
            </option>
          ))}
        </select>
        {errors['cms.type'] && (
          <p className="mt-1 text-xs text-danger">{errors['cms.type']}</p>
        )}
      </div>
      
      {/* Notes */}
      <div>
        <label htmlFor="notes" className="mb-2.5 block font-medium text-black dark:text-white">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes || ''}
          onChange={handleChange}
          rows={4}
          placeholder="Additional notes about the website"
          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          disabled={isSubmitting}
        />
      </div>
      
      {/* Submit Error */}
      {submitError && (
        <div className="rounded-md bg-danger bg-opacity-10 p-4 text-danger">
          {submitError.message}
        </div>
      )}
      
      {/* Form Actions */}
      <div className="flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={handleCancel}
          className="rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90 disabled:bg-opacity-70"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : initialData?.websiteId ? 'Update Website' : 'Create Website'}
        </button>
      </div>
    </form>
  );
};

export default WebsiteForm;