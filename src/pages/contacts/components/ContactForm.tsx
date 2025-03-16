/**
 * ContactForm Component
 * 
 * This component provides a form for creating and editing contacts.
 * It handles form validation, submission, and error states.
 * 
 * The form can be used in two modes:
 * 1. Create mode - for creating new contacts
 * 2. Edit mode - for updating existing contacts
 * 
 * It uses the useContacts hook for data management and form submission.
 * 
 * Features:
 * - Two-column responsive layout
 * - Custom form components with enhanced functionality
 * - Country, state, city selection
 * - Profile photo upload
 * - Emoji and color selection
 * - Organisation associations
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContacts } from '../../../hooks/contacts/useContacts';
import { useOrganisations } from '../../../hooks/organisations/useOrganisations';
import { useOrganisationContacts } from '../../../hooks/contacts/useOrganisationContacts';
import { ContactFormData } from '../../../types/Contact';
import { Organisation } from '../../../types/Organisation';
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Button from "../../../components/ui/button/Button";
import Select from '../../../components/form/Select';
import DynamicSelect from '../../../components/form/DynamicSelect';
import TextArea from "../../../components/form/input/TextArea";
import OrganisationAssociationManager from '../../../components/form/OrganisationAssociationManager';

// Import custom components
import EmailField from '../../../components/custom/EmailField';
import PhoneField from '../../../components/custom/PhoneField';
import CountryStateCityField from '../../../components/custom/CountryStateCityField';
import EmojiPickerField from '../../../components/custom/EmojiPickerField';
import ColorPickerField from '../../../components/custom/ColorPickerField';
import ProfilePhotoUploader from '../../../components/custom/ProfilePhotoUploader';

/**
 * ContactForm component props
 */
interface ContactFormProps {
  contactId?: string; // If provided, the form will be in edit mode
  initialData?: ContactFormData; // Optional initial form data
  onSuccess?: (contactId: string) => void; // Optional callback on successful submission
  onCancel?: () => void; // Optional callback on form cancellation
  isCreate?: boolean; // Optional flag to indicate if this is a create form
  selectedOrganisationId?: string; // Optional pre-selected organisation ID
}

/**
 * ContactForm component
 */
const ContactForm: React.FC<ContactFormProps> = ({
  contactId,
  initialData,
  onSuccess,
  onCancel,
  isCreate,
  selectedOrganisationId
}) => {
  const navigate = useNavigate();
  const isEditMode = !!contactId;
  
  // Get contacts data and actions from the hook
  const {
    selectedContact,
    loadingContact,
    contactError,
    submitting,
    submitError,
    fetchContactById,
    createContact,
    updateContact,
    clearErrors
  } = useContacts();

  // Get organisations data and actions from the hook
  const {
    organisations,
    loading: loadingOrganisations,
    fetchOrganisations
  } = useOrganisations();

  // Get organisation contact actions from the hook
  const {
    addContactToOrganisation
  } = useOrganisationContacts();

  // Selected organisation state
  const [selectedOrganisation, setSelectedOrganisation] = useState<string | null>(selectedOrganisationId || null);

  // Form state
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    mobile: '',
    jobTitle: '',
    department: '',
    linkedIn: '',
    city: '',
    country: '',
    state: '',
    notes: '',
    role: 'staff', // Default role
    status: 'active', // Default status
    image: '',
    color: '',
    icon: ''
  });

  // Location data state
  const [locationData, setLocationData] = useState({
    countryId: 0,
    stateId: 0,
    cityId: 0,
    country: '',
    state: '',
    city: ''
  });

  // Debug log for initialData and locationData
  useEffect(() => {
    console.log('ContactForm initialData:', initialData);
    console.log('ContactForm locationData:', locationData);
  }, [initialData, locationData]);

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Load contact data if in edit mode
  useEffect(() => {
    if (isEditMode && contactId) {
      fetchContactById(contactId);
    }
  }, [isEditMode, contactId, fetchContactById]);

  // Fetch organisations when component mounts
  useEffect(() => {
    fetchOrganisations();
  }, [fetchOrganisations]);

  // Update form data when selectedContact changes or initialData is provided
  useEffect(() => {
    if (isEditMode && selectedContact) {
      // Set form data from selected contact
      setFormData({
        firstName: selectedContact.firstName,
        lastName: selectedContact.lastName,
        email: selectedContact.email,
        phone: selectedContact.phone || '',
        mobile: selectedContact.mobile || '',
        jobTitle: selectedContact.jobTitle || '',
        department: selectedContact.department || '',
        linkedIn: selectedContact.linkedIn || '',
        city: selectedContact.city || '',
        state: selectedContact.state || '',
        country: selectedContact.country || '',
        notes: selectedContact.notes || '',
        role: selectedContact.role || 'staff',
        status: selectedContact.status || 'active',
        image: selectedContact.image || '',
        color: selectedContact.color || '',
        icon: selectedContact.icon || ''
      });
      
      // Set location data from selected contact
      setLocationData({
        countryId: 0, // We don't have IDs from Firestore, will be looked up by name
        stateId: 0,
        cityId: 0,
        country: selectedContact.country || '',
        state: selectedContact.state || '',
        city: selectedContact.city || ''
      });
      
      console.log('Location data initialized from selectedContact:', {
        country: selectedContact.country,
        state: selectedContact.state,
        city: selectedContact.city
      });
    } else if (initialData) {
      // Set form data from initial data
      setFormData(initialData);
      
      // Set location data from initial data
      setLocationData({
        countryId: 0, // We don't have IDs from initialData, will be looked up by name
        stateId: 0,
        cityId: 0,
        country: initialData.country || '',
        state: initialData.state || '',
        city: initialData.city || ''
      });
      
      console.log('Location data initialized from initialData:', {
        country: initialData.country,
        state: initialData.state,
        city: initialData.city
      });
    }
  }, [isEditMode, selectedContact, initialData]);

  // Set selected organisation from prop if provided
  useEffect(() => {
    if (selectedOrganisationId) {
      setSelectedOrganisation(selectedOrganisationId);
    }
  }, [selectedOrganisationId]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Mark field as touched
    if (!touched[name]) {
      setTouched(prev => ({ ...prev, [name]: true }));
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Mark field as touched
    if (!touched[name]) {
      setTouched(prev => ({ ...prev, [name]: true }));
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle email change
  const handleEmailChange = (value: string, isValid: boolean) => {
    setFormData(prev => ({ ...prev, email: value }));
    
    // Mark field as touched
    if (!touched.email) {
      setTouched(prev => ({ ...prev, email: true }));
    }
    
    // Set or clear error
    if (!isValid) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.email;
        return newErrors;
      });
    }
  };

  // Handle phone change
  const handlePhoneChange = (value: string, isValid: boolean, field: 'phone' | 'mobile') => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Mark field as touched
    if (!touched[field]) {
      setTouched(prev => ({ ...prev, [field]: true }));
    }
    
    // Set or clear error
    if (!isValid) {
      setErrors(prev => ({ ...prev, [field]: `Please enter a valid ${field} number` }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Handle location change
  const handleLocationChange = (data: any) => {
    setLocationData({
      countryId: data.country.id,
      stateId: data.state.id,
      cityId: data.city.id,
      country: data.country.name,
      state: data.state.name,
      city: data.city.name
    });
    
    setFormData(prev => ({
      ...prev,
      country: data.country.name,
      state: data.state.name,
      city: data.city.name
    }));
    
    console.log('Location data updated:', {
      countryId: data.country.id,
      stateId: data.state.id,
      cityId: data.city.id,
      country: data.country.name,
      state: data.state.name,
      city: data.city.name
    });
  };

  // Handle image upload
  const handleImageChange = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, image: imageUrl }));
  };

  // Handle emoji selection
  const handleEmojiChange = (emoji: string) => {
    setFormData(prev => ({ ...prev, icon: emoji }));
  };

  // Handle color selection
  const handleColorChange = (color: string) => {
    setFormData(prev => ({ ...prev, color: color }));
  };

  // Handle organisation associations
  const handleOrganisationAssociationsChange = (associations: any[]) => {
    // Store the associations in a state variable to be used during form submission
    // This is just a placeholder - in a real implementation, you would store and process these associations
    console.log('Organisation associations:', associations);
  };

  // Handle organisation selection
  const handleOrganisationChange = (value: string) => {
    setSelectedOrganisation(value || null);
  };

  // Validate all fields
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;
    
    // Mark all fields as touched
    const newTouched: Record<string, boolean> = {};
    Object.keys(formData).forEach(key => {
      newTouched[key] = true;
    });
    setTouched(newTouched);
    
    // Validate required fields
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
      isValid = false;
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      isValid = false;
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    try {
      if (isEditMode && contactId) {
        // Update existing contact
        await updateContact(contactId, formData);
        if (onSuccess) {
          onSuccess(contactId);
        } else {
          navigate(`/contacts/${contactId}`);
        }
      } else {
        // Create new contact
        const newContactId = await createContact(formData);
        
        // If an organisation is selected, associate the contact with it
        if (selectedOrganisation) {
          try {
            await addContactToOrganisation({
              organisationId: selectedOrganisation,
              contactId: newContactId,
              role: formData.role || 'staff',
              isPrimary: true,
              priority: 1
            });
          } catch (error) {
            console.error('Error associating contact with organisation:', error);
            // Continue with success flow even if association fails
          }
        }
        
        if (onSuccess) {
          onSuccess(newContactId);
        } else {
          navigate(`/contacts/${newContactId}`);
        }
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      // Error is handled by the hook and displayed in the UI
    }
  };

  // Handle form cancellation
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate('/contacts');
    }
  };

  // Show loading state
  if (isEditMode && loadingContact) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show error state
  if (isEditMode && contactError) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {contactError.message}</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form error message */}
      {submitError && (
        <div className="mb-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {submitError.message}</span>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Left Column - Personal Information */}
        <div className="space-y-5 sm:space-y-6">
          <div className="rounded-2xl border border-stroke bg-white p-6 shadow-default dark:border-gray-800 dark:bg-white/[0.03]">
            <h4 className="mb-6 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
              Personal Information
            </h4>
            
            {/* First Name */}
            <div className="mb-4.5">
              <Label>
                First Name <span className="text-meta-1">*</span>
              </Label>
              <Input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
                error={!!(errors.firstName && touched.firstName)}
                hint={touched.firstName ? errors.firstName : ''}
              />
            </div>
            
            {/* Last Name */}
            <div className="mb-4.5">
              <Label>
                Last Name <span className="text-meta-1">*</span>
              </Label>
              <Input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
                error={!!(errors.lastName && touched.lastName)}
                hint={touched.lastName ? errors.lastName : ''}
              />
            </div>
            
            {/* Email */}
            <div className="mb-4.5">
              <EmailField
                label="Email"
                initialValue={formData.email}
                onChange={handleEmailChange}
                error={!!(errors.email && touched.email)}
                hint={touched.email ? errors.email : ''}
                required={true}
              />
            </div>
            
            {/* Phone */}
            <div className="mb-4.5">
              <PhoneField
                label="Phone"
                initialValue={formData.phone}
                onChange={(value, isValid) => handlePhoneChange(value, isValid, 'phone')}
                error={!!(errors.phone && touched.phone)}
                hint={touched.phone ? errors.phone : ''}
                required={false}
                defaultCountry="AU"
              />
            </div>
            
            {/* Mobile */}
            <div className="mb-4.5">
              <PhoneField
                label="Mobile"
                initialValue={formData.mobile}
                onChange={(value, isValid) => handlePhoneChange(value, isValid, 'mobile')}
                error={!!(errors.mobile && touched.mobile)}
                hint={touched.mobile ? errors.mobile : ''}
                required={false}
                defaultCountry="AU"
              />
            </div>
            
            {/* Country, State, City */}
            <div className="mb-4.5">
              <CountryStateCityField
                label="Location"
                onChange={handleLocationChange}
                initialData={{
                  countryId: locationData.countryId,
                  stateId: locationData.stateId,
                  cityId: locationData.cityId,
                  country: locationData.country,
                  state: locationData.state,
                  city: locationData.city
                }}
              />
            </div>
          </div>
        </div>
        
        {/* Right Column - Professional Information */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-stroke bg-white p-6 shadow-default dark:border-gray-800 dark:bg-white/[0.03]">
            <h4 className="mb-6 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
              Professional Information
            </h4>
            
            {/* Job Title */}
            <div className="mb-4.5">
              <Label>
                Job Title
              </Label>
              <Input
                type="text"
                id="jobTitle"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                placeholder="Enter job title"
              />
            </div>
            
            {/* Department */}
            <div className="mb-4.5">
              <Label>
                Department
              </Label>
              <Input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="Enter department"
              />
            </div>
            
            {/* Role */}
            <div className="mb-4.5">
              <Label>
                Role
              </Label>
              <DynamicSelect
                fieldType="contactRoles"
                placeholder="Select Role"
                defaultValue={formData.role || 'staff'}
                onChange={(value) => handleSelectChange('role', value)}
              />
            </div>
            
            {/* LinkedIn */}
            <div className="mb-4.5">
              <Label>
                LinkedIn
              </Label>
              <Input
                type="text"
                id="linkedIn"
                name="linkedIn"
                value={formData.linkedIn || ''}
                onChange={handleChange}
                placeholder="Enter LinkedIn profile URL"
              />
            </div>
            
            {/* Icon/Emoji */}
            <div className="mb-4.5">
              <EmojiPickerField
                initialEmoji={formData.icon}
                onChange={handleEmojiChange}
                label="Icon"
              />
            </div>
            
            {/* Color */}
            <div className="mb-4.5">
              <ColorPickerField
                initialColor={formData.color || '#000000'}
                onChange={handleColorChange}
                label="Color"
              />
            </div>
            
            {/* Profile Photo - Moved to bottom of right column */}
            <div className="mt-6">
              <ProfilePhotoUploader
                initialImage={formData.image}
                onChange={handleImageChange}
                label="Profile Photo"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Organisation Associations - Full Width */}
      <div className="mt-6">
        <div className="rounded-2xl border border-stroke bg-white p-6 shadow-default dark:border-gray-800 dark:bg-white/[0.03]">
          <OrganisationAssociationManager
            contactId={contactId}
            initialAssociations={[]}
            onChange={handleOrganisationAssociationsChange}
          />
        </div>
      </div>
      
      {/* Notes - Full Width */}
      <div className="mt-6">
        <div className="rounded-2xl border border-stroke bg-white p-6 shadow-default dark:border-gray-800 dark:bg-white/[0.03]">
          <h4 className="mb-6 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
            Additional Information
          </h4>
          
          <div className="mb-4.5">
            <Label>
              Notes
            </Label>
            <TextArea
              value={formData.notes || ''}
              onChange={(value) => {
                handleChange({
                  target: { name: 'notes', value }
                } as React.ChangeEvent<HTMLTextAreaElement>);
              }}
              rows={4}
              placeholder="Enter notes about this contact"
            />
          </div>
        </div>
      </div>
      
      {/* Form Actions with Status */}
      <div className="flex flex-wrap items-center justify-between gap-4.5 mt-6">
        <div className="w-full sm:w-auto">
          <Label>
            Status
          </Label>
          <DynamicSelect
            fieldType="contactStatuses"
            placeholder="Select Status"
            defaultValue={formData.status || 'active'}
            onChange={(value) => handleSelectChange('status', value)}
          />
        </div>
        
        <div className="flex justify-end gap-4.5">
          <Button
            onClick={handleCancel}
            variant="secondary"
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={submitting}
          >
            {submitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              isEditMode ? 'Update Contact' : 'Create Contact'
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ContactForm;