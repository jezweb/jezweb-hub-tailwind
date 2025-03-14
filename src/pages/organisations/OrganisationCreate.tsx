/**
 * OrganisationCreate Component
 * 
 * This component provides a form for creating a new organisation.
 * It uses the useOrganisations hook to handle form submission and data validation.
 * 
 * Features:
 * - Validates form inputs
 * - Handles form submission
 * - Shows loading states and error messages
 * - Provides navigation back to organisations list
 * - Supports automatic association with a contact when contactId is provided in URL
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PageBreadcrumb from "../../components/common/PageBreadCrumb"; 
import PageMeta from "../../components/common/PageMeta";
import { useOrganisations } from '../../hooks/organisations/useOrganisations';
import { useOrganisationContacts } from '../../hooks/contacts/useOrganisationContacts';
import { useFormFields } from '../../hooks/useFormFields';
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import Alert from "../../components/ui/alert/Alert";
import Select from "../../components/form/Select";
import DynamicSelect from "../../components/form/DynamicSelect";
import AutocompleteField from "../../components/form/AutocompleteField";
import TextArea from "../../components/form/input/TextArea";
import { OrganisationFormData, Address } from '../../types/Organisation';
import { ContactRole } from '../../types/Contact';

/**
 * OrganisationCreate component
 */
const OrganisationCreate: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [associationRole, setAssociationRole] = useState<ContactRole>('staff');
  const [isPrimary, setIsPrimary] = useState<boolean>(false);
  
  // Get contact ID from URL query parameters if present
  const queryParams = new URLSearchParams(location.search);
  const contactId = queryParams.get('contactId');
  
  // Get organisation actions from the hook
  const {
    submitError,
    submitting,
    createOrganisation
  } = useOrganisations();
  
  // Get organisation contact actions from the hook
  const { 
    addContactToOrganisation,
    submitError: associationError,
    submitting: associating
  } = useOrganisationContacts();

  // Form state with default values
  const [formData, setFormData] = useState<OrganisationFormData>({
    organisationName: '',
    status: 'active',
  });

  // Form validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle address field changes
  const handleAddressChange = (addressType: 'billingAddress' | 'shippingAddress', field: keyof Address, value: string) => {
    setFormData(prev => ({
      ...prev,
      [addressType]: {
        ...(prev[addressType] || {}),
        [field]: value
      }
    }));
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Required fields
    if (!formData.organisationName.trim()) {
      newErrors.organisationName = 'Organisation name is required';
    }
    
    if (!formData.status) {
      newErrors.status = 'Status is required';
    }
    
    // Website format validation (if provided)
    if (formData.website && !formData.website.match(/^(https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/)) {
      newErrors.website = 'Please enter a valid website URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const newOrganisationId = await createOrganisation(formData);
      
      // If contactId is present, associate the organisation with the contact
      if (contactId) {
        try {
          await addContactToOrganisation({
            organisationId: newOrganisationId,
            contactId,
            role: associationRole,
            isPrimary,
            priority: isPrimary ? 1 : 10
          });
        } catch (error) {
          console.error('Error associating organisation with contact:', error);
        }
      }
      
      navigate(`/organisations/${newOrganisationId}`);
    } catch (error) {
      console.error('Error creating organisation:', error);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate('/organisations');
  };

  return (
    <>
      <PageMeta
        title="Create Organisation | Jezweb Hub"
        description="Create a new organisation with basic information and addresses"
      />

      <PageBreadcrumb 
        pageTitle="Create New Organisation" 
        items={[
          { label: 'Organisations', path: '/organisations' }
        ]}
      />

      {submitError && (
      <div className="mb-6">
        <Alert variant="error" title="Error!" message={submitError.message} />
      </div>
      )}
      
      {associationError && (
      <div className="mb-6">
        <Alert variant="error" title="Association Error!" message={associationError.message} />
      </div>
      )}

      {/* Contact Association Details */}
      {contactId && (
        <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Contact Association
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            This organisation will be automatically associated with the selected contact.
          </p>
          
          <div className="mb-4">
            <Label>
              Contact Role
            </Label>
            <DynamicSelect
              fieldType="contactRoles"
              placeholder="Select Role"
              defaultValue={associationRole}
              onChange={(value: string) => setAssociationRole(value as ContactRole)}
            />
          </div>
          
          <div className="mb-4">
            <div className="flex items-center">
              <input
                id="isPrimary"
                type="checkbox"
                checked={isPrimary}
                onChange={(e) => setIsPrimary(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700"
              />
              <label htmlFor="isPrimary" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Set as primary organisation for this contact
              </label>
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Primary organisations are the main organisation associated with a contact
            </p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="space-y-5 sm:space-y-6">
            {/* Basic Information */}
            <div className="rounded-2xl border border-stroke bg-white p-6 shadow-default dark:border-gray-800 dark:bg-white/[0.03]">
              <h4 className="mb-6 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
                Basic Information
              </h4>
              <div className="mb-4.5">
                <Label>
                  Organisation Name <span className="text-meta-1">*</span>
                </Label>
                <Input
                  type="text"
                  id="organisationName"
                  name="organisationName"
                  value={formData.organisationName}
                  onChange={handleInputChange}
                  placeholder="Enter organisation name"
                  error={!!errors.organisationName}
                  hint={errors.organisationName}
                />
              </div>

              <div className="mb-4.5">
                <Label>
                  Organisation Type
                </Label>
                <DynamicSelect
                  fieldType="organisationTypes"
                  placeholder="Select Type"
                  defaultValue={formData.organisationType || ''}
                  onChange={(value) => {
                    handleInputChange({
                      target: { name: 'organisationType', value }
                    } as React.ChangeEvent<HTMLSelectElement>);
                  }}
                />
              </div>

              <div className="mb-4.5">
                <Label>
                  Status <span className="text-meta-1">*</span>
                </Label>
                <DynamicSelect
                  fieldType="organisationStatuses"
                  placeholder="Select Status"
                  defaultValue={formData.status}
                  onChange={(value: string) => {
                    handleInputChange({
                      target: { name: 'status', value }
                    } as React.ChangeEvent<HTMLSelectElement>);
                  }}
                />
                {errors.status && <p className="text-error-500 text-xs mt-1">{errors.status}</p>}
              </div>

              <div className="mb-4.5">
                <Label>
                  Industry
                </Label>
                <AutocompleteField
                  fieldType="industries"
                  initialValue={formData.industry || ''}
                  onChange={(value) => {
                    handleInputChange({
                      target: { name: 'industry', value }
                    } as React.ChangeEvent<HTMLInputElement>);
                  }}
                  placeholder="Type to search or add an industry"
                />
              </div>

              <div className="mb-4.5">
                <Label>
                  Website
                </Label>
                <Input
                  type="text"
                  id="website"
                  name="website"
                  value={formData.website || ''}
                  onChange={handleInputChange}
                  placeholder="Enter website URL"
                  error={!!errors.website}
                  hint={errors.website}
                />
              </div>

              <div className="mb-4.5">
                <Label>
                  Notes
                </Label>
                <TextArea
                  value={formData.notes || ''}
                  onChange={(value) => {
                    handleInputChange({
                      target: { name: 'notes', value }
                    } as React.ChangeEvent<HTMLTextAreaElement>);
                  }}
                  rows={4}
                  placeholder="Enter notes about this organisation"
                />
              </div>
            </div>
          </div>
          <div className="space-y-6">
            {/* Address Information */}
            <div className="rounded-2xl border border-stroke bg-white p-6 shadow-default dark:border-gray-800 dark:bg-white/[0.03]">
              <h4 className="mb-6 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
                Address Information
              </h4>
              
              {/* Billing Address */}
              <div className="mb-6">
                <h5 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
                  Billing Address
                </h5>
                
                <div className="mb-4">
                  <Label>
                    Street
                  </Label>
                  <Input
                    type="text"
                    value={formData.billingAddress?.street || ''}
                    onChange={(e) => handleAddressChange('billingAddress', 'street', e.target.value)}
                    placeholder="Enter street address"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label>
                      Suburb
                    </Label>
                    <Input
                      type="text"
                      value={formData.billingAddress?.suburb || ''}
                      onChange={(e) => handleAddressChange('billingAddress', 'suburb', e.target.value)}
                      placeholder="Enter suburb"
                    />
                  </div>
                  <div>
                    <Label>
                      State
                    </Label>
                    <Input
                      type="text"
                      value={formData.billingAddress?.state || ''}
                      onChange={(e) => handleAddressChange('billingAddress', 'state', e.target.value)}
                      placeholder="Enter state"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>
                      Postcode
                    </Label>
                    <Input
                      type="text"
                      value={formData.billingAddress?.postcode || ''}
                      onChange={(e) => handleAddressChange('billingAddress', 'postcode', e.target.value)}
                      placeholder="Enter postcode"
                    />
                  </div>
                  <div>
                    <Label>
                      Country
                    </Label>
                    <Input
                      type="text"
                      value={formData.billingAddress?.country || ''}
                      onChange={(e) => handleAddressChange('billingAddress', 'country', e.target.value)}
                      placeholder="Enter country"
                    />
                  </div>
                </div>
              </div>
              
              {/* Shipping Address */}
              <div>
                <h5 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
                  Shipping Address
                </h5>
                
                <div className="mb-4">
                  <Label>
                    Street
                  </Label>
                  <Input
                    type="text"
                    value={formData.shippingAddress?.street || ''}
                    onChange={(e) => handleAddressChange('shippingAddress', 'street', e.target.value)}
                    placeholder="Enter street address"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label>
                      Suburb
                    </Label>
                    <Input
                      type="text"
                      value={formData.shippingAddress?.suburb || ''}
                      onChange={(e) => handleAddressChange('shippingAddress', 'suburb', e.target.value)}
                      placeholder="Enter suburb"
                    />
                  </div>
                  <div>
                    <Label>
                      State
                    </Label>
                    <Input
                      type="text"
                      value={formData.shippingAddress?.state || ''}
                      onChange={(e) => handleAddressChange('shippingAddress', 'state', e.target.value)}
                      placeholder="Enter state"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>
                      Postcode
                    </Label>
                    <Input
                      type="text"
                      value={formData.shippingAddress?.postcode || ''}
                      onChange={(e) => handleAddressChange('shippingAddress', 'postcode', e.target.value)}
                      placeholder="Enter postcode"
                    />
                  </div>
                  <div>
                    <Label>
                      Country
                    </Label>
                    <Input
                      type="text"
                      value={formData.shippingAddress?.country || ''}
                      onChange={(e) => handleAddressChange('shippingAddress', 'country', e.target.value)}
                      placeholder="Enter country"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Form Actions */}
            <div className="flex justify-end gap-4.5 mt-6">
              <Button
                onClick={handleCancel}
                variant="secondary">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting || associating}
                variant="primary">
                {submitting || associating ? 'Creating...' : 'Create Organisation'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default OrganisationCreate;