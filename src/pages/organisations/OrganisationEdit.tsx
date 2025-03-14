/**
 * OrganisationEdit Component
 * 
 * This component provides a form for editing an existing organisation.
 * It fetches the organisation data using the useOrganisations hook and
 * allows users to modify the organisation details.
 * 
 * Features:
 * - Loads existing organisation data
 * - Validates form inputs
 * - Handles form submission
 * - Shows loading states and error messages
 * - Provides navigation back to organisation details
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useOrganisations } from '../../hooks/organisations/useOrganisations';
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import TextArea from "../../components/form/input/TextArea";
import Button from "../../components/ui/button/Button";
import Alert from "../../components/ui/alert/Alert";
import { OrganisationFormData, Address } from '../../types/Organisation';

/**
 * OrganisationEdit component
 */
const OrganisationEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Debug: Log the organisation ID from URL params
  console.log("OrganisationEdit: Editing organisation with ID:", id);
  
  // Get organisation data and actions from the hook
  const {
    selectedOrganisation,
    loadingOrganisation,
    organisationError,
    submitError,
    submitting,
    fetchOrganisationById,
    updateOrganisation
  } = useOrganisations();

  // Form state
  const [formData, setFormData] = useState<OrganisationFormData>({
    organisationName: '',
    status: 'active',
  });

  // Form validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch organisation data on component mount
  useEffect(() => {
    if (id) {
      console.log("OrganisationEdit: Fetching organisation data for ID:", id);
      fetchOrganisationById(id);
    }
  }, [id, fetchOrganisationById]);

  // Update form data when organisation data is loaded
  useEffect(() => {
    if (selectedOrganisation) {
      console.log("OrganisationEdit: Organisation data loaded:", selectedOrganisation);
      // Extract relevant fields for the form
      const {
        organisationName,
        organisationType,
        status,
        primaryContactId,
        billingAddress,
        shippingAddress,
        industry,
        website,
        notes,
        assignedTo,
        customFields
      } = selectedOrganisation;

      setFormData({
        organisationName,
        organisationType,
        status,
        primaryContactId,
        billingAddress,
        shippingAddress,
        industry,
        website,
        notes,
        assignedTo,
        customFields
      });
    }
  }, [selectedOrganisation]);

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
    
    if (!validateForm() || !id) return;
    
    try {
      await updateOrganisation(id, formData);
      console.log("OrganisationEdit: Organisation updated successfully");
      navigate(`/organisations/${id}`);
    } catch (error) {
      console.error('Error updating organisation:', error);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate(`/organisations/${id}`);
  };

  // Render loading state
  if (loadingOrganisation) {
    return (
      <>
        <PageMeta title="Loading | Jezweb Hub" description="Loading organisation data" />
        <PageBreadcrumb 
          pageTitle="Loading Organisation" 
          items={[{ label: 'Organisations', path: '/organisations' }]}
        />
        <div className="rounded-2xl border border-stroke bg-white p-6 shadow-default dark:border-gray-800 dark:bg-white/[0.03]">
          <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">Loading Organisation</h3>
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </>
    );
  }

  // Render error state
  if (organisationError) {
    return (
      <>
        <PageMeta
          title="Error | Jezweb Hub"
          description="An error occurred while loading the organisation"
        />
        <PageBreadcrumb 
          pageTitle="Organisation Error" 
          items={[{ label: 'Organisations', path: '/organisations' }]}
        />
        <div className="rounded-2xl border border-stroke bg-white p-6 shadow-default dark:border-gray-800 dark:bg-white/[0.03]">
          <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">Error Loading Organisation</h3>
          <Alert 
            variant="error"
            title="Error!"
            message={organisationError.message}
          />
          <div className="mt-4">
            <Button 
              variant="secondary"
              onClick={() => navigate('/organisations')}
            >Back to Organisations</Button>
          </div>
        </div>
      </>
    );
  }

  // Render not found state
  if (!selectedOrganisation && !loadingOrganisation) {
    return (
      <>
        <PageMeta title="Not Found | Jezweb Hub" description="The requested organisation could not be found" />
        <PageBreadcrumb 
          pageTitle="Organisation Not Found" 
          items={[{ label: 'Organisations', path: '/organisations' }]}
        />
        <div className="rounded-2xl border border-stroke bg-white p-6 shadow-default dark:border-gray-800 dark:bg-white/[0.03]">
          <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">Organisation Not Found</h3>
          <Alert variant="warning" title="Not Found!" message="The requested organisation could not be found." />
          <div className="mt-4">
            <Button 
              variant="secondary"
              onClick={() => navigate('/organisations')}
            >Back to Organisations</Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta
        title="Edit Organisation | Jezweb Hub"
        description="Edit organisation details including basic information and addresses"
      />

      <PageBreadcrumb 
        pageTitle={`Edit ${formData.organisationName}`} 
        items={[
          { label: 'Organisations', path: '/organisations' },
          { label: formData.organisationName, path: `/organisations/${id}` }
        ]}
      />

      {submitError && (
      <div className="mb-6">
        <Alert variant="error" title="Error!" message={submitError.message} />
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
                <Select
                  options={[
                    { value: "Company", label: "Company" },
                    { value: "Non-profit", label: "Non-profit" },
                    { value: "Government", label: "Government" },
                    { value: "Individual", label: "Individual" },
                    { value: "Other", label: "Other" }
                  ]}
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
                <Select
                  options={[
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Inactive" },
                    { value: "lead", label: "Lead" },
                    { value: "prospect", label: "Prospect" }
                  ]}
                  placeholder="Select Status"
                  defaultValue={formData.status}
                  onChange={(value) => {
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
                <Input
                  type="text"
                  id="industry"
                  name="industry"
                  value={formData.industry || ''}
                  onChange={handleInputChange}
                  placeholder="Enter industry"
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
                disabled={submitting}
                type="submit"
                variant="primary">
                {submitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default OrganisationEdit;