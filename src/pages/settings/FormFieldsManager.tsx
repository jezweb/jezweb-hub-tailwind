/**
 * FormFieldsManager Component
 * 
 * This component provides an interface for managing form field values stored in Firebase.
 * It allows administrators to add, edit, and delete field values for different field types
 * such as contact roles, statuses, industries, etc.
 * 
 * The component uses the useFormFields hook to interact with the FormFieldsService.
 */

import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useFormFields, FieldValue } from '../../hooks/useFormFields';
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import Alert from "../../components/ui/alert/Alert";
import Select from "../../components/form/Select";

/**
 * FormFieldsManager component
 */
const FormFieldsManager: React.FC = () => {
  // Available field types
  const fieldTypes = [
    { value: 'contactRoles', label: 'Contact Roles' },
    { value: 'contactStatuses', label: 'Contact Statuses' },
    { value: 'organisationTypes', label: 'Organisation Types' },
    { value: 'organisationStatuses', label: 'Organisation Statuses' },
    { value: 'industries', label: 'Industries' }
  ];
  
  // State for selected field type
  const [selectedFieldType, setSelectedFieldType] = useState<string>('contactRoles');
  
  // State for new field form
  const [newField, setNewField] = useState<{ value: string; label: string; }>({
    value: '',
    label: ''
  });
  
  // State for editing field
  const [editingField, setEditingField] = useState<FieldValue | null>(null);
  const [editFormData, setEditFormData] = useState<{ value: string; label: string; }>({
    value: '',
    label: ''
  });
  
  // State for form errors
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Get form fields data and actions from the hook
  const {
    fieldValues,
    loading,
    error,
    submitting,
    submitError,
    fetchFieldValues,
    addFieldValue,
    updateFieldValue,
    deleteFieldValue,
    clearErrors
  } = useFormFields();
  
  // Fetch field values when selected field type changes
  useEffect(() => {
    fetchFieldValues(selectedFieldType);
  }, [selectedFieldType, fetchFieldValues]);
  
  /**
   * Handle field type selection change
   */
  const handleFieldTypeChange = (value: string) => {
    setSelectedFieldType(value);
    clearErrors();
    setEditingField(null);
    setFormErrors({});
  };
  
  /**
   * Handle new field input change
   */
  const handleNewFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewField(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  /**
   * Handle edit field input change
   */
  const handleEditFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (formErrors[`edit_${name}`]) {
      setFormErrors(prev => ({ ...prev, [`edit_${name}`]: '' }));
    }
  };
  
  /**
   * Validate new field form
   */
  const validateNewField = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!newField.value.trim()) {
      errors.value = 'Value is required';
    }
    
    if (!newField.label.trim()) {
      errors.label = 'Label is required';
    }
    
    // Check for duplicate values
    if (newField.value.trim() && fieldValues.some(field => field.value === newField.value.trim())) {
      errors.value = 'This value already exists';
    }
    
    setFormErrors(prev => ({ ...prev, ...errors }));
    return Object.keys(errors).length === 0;
  };
  
  /**
   * Validate edit field form
   */
  const validateEditField = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!editFormData.value.trim()) {
      errors.edit_value = 'Value is required';
    }
    
    if (!editFormData.label.trim()) {
      errors.edit_label = 'Label is required';
    }
    
    // Check for duplicate values (excluding the current field)
    if (editFormData.value.trim() && 
        editingField && 
        editFormData.value !== editingField.value && 
        fieldValues.some(field => field.value === editFormData.value.trim())) {
      errors.edit_value = 'This value already exists';
    }
    
    setFormErrors(prev => ({ ...prev, ...errors }));
    return Object.keys(errors).length === 0;
  };
  
  /**
   * Handle add new field
   */
  const handleAddField = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateNewField()) {
      return;
    }
    
    try {
      await addFieldValue(selectedFieldType, {
        value: newField.value.trim(),
        label: newField.label.trim(),
        isActive: true,
        order: fieldValues.length + 1
      });
      
      // Reset form
      setNewField({ value: '', label: '' });
    } catch (error) {
      console.error('Error adding field:', error);
    }
  };
  
  /**
   * Handle edit field
   */
  const handleEditField = (field: FieldValue) => {
    setEditingField(field);
    setEditFormData({
      value: field.value,
      label: field.label
    });
    setFormErrors({});
  };
  
  /**
   * Handle update field
   */
  const handleUpdateField = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingField || !validateEditField()) {
      return;
    }
    
    try {
      const updatedField: FieldValue = {
        ...editingField,
        value: editFormData.value.trim(),
        label: editFormData.label.trim()
      };
      
      await updateFieldValue(selectedFieldType, updatedField);
      
      // Reset form
      setEditingField(null);
      setEditFormData({ value: '', label: '' });
    } catch (error) {
      console.error('Error updating field:', error);
    }
  };
  
  /**
   * Handle delete field
   */
  const handleDeleteField = async (field: FieldValue) => {
    if (!window.confirm(`Are you sure you want to delete "${field.label}"?`)) {
      return;
    }
    
    try {
      await deleteFieldValue(selectedFieldType, field.id ? field : { ...field, id: '' });
    } catch (error) {
      console.error('Error deleting field:', error);
    }
  };
  
  /**
   * Handle cancel edit
   */
  const handleCancelEdit = () => {
    setEditingField(null);
    setEditFormData({ value: '', label: '' });
    setFormErrors({});
  };
  
  return (
    <>
      <Helmet>
        <title>Form Fields Manager | Jezweb Hub</title>
      </Helmet>
      
      <PageBreadcrumb 
        pageTitle="Form Fields Manager" 
        items={[{ label: 'Settings', path: '/settings' }]}
      />
      
      <div className="grid grid-cols-1 gap-6">
        <div className="rounded-2xl border border-stroke bg-white p-6 shadow-default dark:border-gray-800 dark:bg-white/[0.03]">
          <h4 className="mb-6 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
            Manage Form Fields
          </h4>
          
          {/* Field Type Selector */}
          <div className="mb-6">
            <Label>
              Field Type
            </Label>
            <Select
              options={fieldTypes}
              placeholder="Select Field Type"
              defaultValue={selectedFieldType}
              onChange={handleFieldTypeChange}
            />
          </div>
          
          {/* Error Alert */}
          {error && (
            <div className="mb-6">
              <Alert variant="error" title="Error!" message={error.message} />
            </div>
          )}
          
          {/* Submit Error Alert */}
          {submitError && (
            <div className="mb-6">
              <Alert variant="error" title="Error!" message={submitError.message} />
            </div>
          )}
          
          {/* Add New Field Form */}
          <div className="mb-8 p-4 bg-gray-50 rounded-lg dark:bg-gray-800">
            <h5 className="mb-4 font-semibold text-gray-800 dark:text-white/90">
              Add New {selectedFieldType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </h5>
            
            <form onSubmit={handleAddField} className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <Label>
                  Value <span className="text-meta-1">*</span>
                </Label>
                <Input
                  type="text"
                  name="value"
                  value={newField.value}
                  onChange={handleNewFieldChange}
                  placeholder="Enter value"
                  error={!!formErrors.value}
                  hint={formErrors.value}
                />
              </div>
              
              <div>
                <Label>
                  Label <span className="text-meta-1">*</span>
                </Label>
                <Input
                  type="text"
                  name="label"
                  value={newField.label}
                  onChange={handleNewFieldChange}
                  placeholder="Enter label"
                  error={!!formErrors.label}
                  hint={formErrors.label}
                />
              </div>
              
              <div className="flex items-end">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={submitting}
                  className="flex items-center"
                >
                  <span className="mr-1">+</span>
                  Add
                </Button>
              </div>
            </form>
          </div>
          
          {/* Edit Field Form */}
          {editingField && (
            <div className="mb-8 p-4 bg-blue-50 rounded-lg dark:bg-blue-900/20">
              <h5 className="mb-4 font-semibold text-gray-800 dark:text-white/90">
                Edit {editingField.label}
              </h5>
              
              <form onSubmit={handleUpdateField} className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <Label>
                    Value <span className="text-meta-1">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="value"
                    value={editFormData.value}
                    onChange={handleEditFieldChange}
                    placeholder="Enter value"
                    error={!!formErrors.edit_value}
                    hint={formErrors.edit_value}
                  />
                </div>
                
                <div>
                  <Label>
                    Label <span className="text-meta-1">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="label"
                    value={editFormData.label}
                    onChange={handleEditFieldChange}
                    placeholder="Enter label"
                    error={!!formErrors.edit_label}
                    hint={formErrors.edit_label}
                  />
                </div>
                
                <div className="flex items-end gap-2">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={submitting}
                  >
                    Update
                  </Button>
                  
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}
          
          {/* Field Values List */}
          <div>
            <h5 className="mb-4 font-semibold text-gray-800 dark:text-white/90">
              {selectedFieldType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} List
            </h5>
            
            {loading ? (
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : fieldValues.length === 0 ? (
              <div className="text-center p-8 text-gray-500 dark:text-gray-400">
                No {selectedFieldType.replace(/([A-Z])/g, ' $1').toLowerCase()} found. Add some using the form above.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-800">
                      <th className="px-4 py-2 text-left text-gray-700 dark:text-white">Value</th>
                      <th className="px-4 py-2 text-left text-gray-700 dark:text-white">Label</th>
                      <th className="px-4 py-2 text-right text-gray-700 dark:text-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fieldValues.map((field) => (
                      <tr 
                        key={field.id || field.value} 
                        className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{field.value}</td>
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{field.label}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEditField(field)}
                              className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                              title="Edit"
                            >
                              ✏️
                            </button>
                            
                            <button
                              onClick={() => handleDeleteField(field)}
                              className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                              title="Delete"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FormFieldsManager;