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
 * 
 * This component uses the design system components for consistent styling:
 * - Container: For page layout and padding
 * - PageHeading: For the page title and back link
 * - Card: For content sections
 * - FormSection: For form sections
 * - ActionButton: For action buttons
 * - ErrorMessage: For error messages
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PageMeta from "../../components/common/PageMeta";
import { useOrganisations } from '../../hooks/organisations/useOrganisations';
import { useOrganisationContacts } from '../../hooks/contacts/useOrganisationContacts';
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import DynamicSelect from "../../components/form/DynamicSelect";
import AutocompleteField from "../../components/form/AutocompleteField";
import TextArea from "../../components/form/input/TextArea";
import { OrganisationFormData, Address } from '../../types/Organisation';
import { ContactRole } from '../../types/Contact';

// Import design system components
import { Container } from '../../components/ui/design-system/Container';
import { PageHeading } from '../../components/ui/design-system/PageHeading';
import { Card } from '../../components/ui/design-system/Card';
import { ActionButton } from '../../components/ui/design-system/ActionButton';
import { ErrorMessage } from '../../components/ui/design-system/ErrorMessage';
import { FormSection } from '../../components/ui/design-system/FormSection';

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

      <Container>
        <PageHeading
          title="Create New Organisation"
          backLink={{
            to: '/organisations',
            label: 'Back to Organisations'
          }}
        />

        {submitError && (
          <div className="mb-6">
            <ErrorMessage title="Error!" message={submitError.message} />
          </div>
        )}
        
        {associationError && (
          <div className="mb-6">
            <ErrorMessage title="Association Error!" message={associationError.message} />
          </div>
        )}

        {/* Contact Association Details */}
        {contactId && (
          <Card className="mb-6">
            <FormSection
              title="Contact Association"
              description="This organisation will be automatically associated with the selected contact."
              bordered={false}
              padded={false}
            >
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
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                  />
                  <label htmlFor="isPrimary" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Set as primary organisation for this contact
                  </label>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Primary organisations are the main organisation associated with a contact
                </p>
              </div>
            </FormSection>
          </Card>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div className="space-y-6">
              {/* Basic Information */}
              <Card
                header={
                  <h4 className="text-xl font-semibold text-gray-800 dark:text-white">
                    Basic Information
                  </h4>
                }
              >
                <FormSection bordered={false} padded={false}>
                  <div className="mb-4">
                    <Label>
                      Organisation Name <span className="text-red-500">*</span>
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

                  <div className="mb-4">
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

                  <div className="mb-4">
                    <Label>
                      Status <span className="text-red-500">*</span>
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
                    {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
                  </div>

                  <div className="mb-4">
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

                  <div className="mb-4">
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

                  <div className="mb-4">
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
                </FormSection>
              </Card>
            </div>
            <div className="space-y-6">
              {/* Address Information */}
              <Card
                header={
                  <h4 className="text-xl font-semibold text-gray-800 dark:text-white">
                    Address Information
                  </h4>
                }
              >
                {/* Billing Address */}
                <FormSection
                  title="Billing Address"
                  bordered={false}
                  padded={false}
                >
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
                </FormSection>
                
                {/* Shipping Address */}
                <FormSection
                  title="Shipping Address"
                  bordered={false}
                  padded={false}
                  className="mt-6"
                >
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
                </FormSection>
              </Card>
              
              {/* Form Actions */}
              <div className="flex justify-end gap-4 mt-6">
                <ActionButton
                  variant="secondary"
                  onClick={handleCancel}
                >
                  Cancel
                </ActionButton>
                <ActionButton
                  variant="primary"
                  type="submit"
                  isLoading={submitting || associating}
                  disabled={submitting || associating}
                >
                  Create Organisation
                </ActionButton>
              </div>
            </div>
          </div>
        </form>
      </Container>
    </>
  );
};

export default OrganisationCreate;