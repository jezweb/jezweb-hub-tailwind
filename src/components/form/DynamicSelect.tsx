/**
 * DynamicSelect Component
 * 
 * This component provides a select dropdown that dynamically loads options from Firebase.
 * It's used for form fields like contact roles, statuses, and other configurable options
 * that can be managed through the FormFieldsManager.
 * 
 * The component handles loading states, error states, and selection of values.
 */

import React, { useEffect } from 'react';
import { useFormFields } from '../../hooks/useFormFields';
import Select from './Select';
import Label from './Label';

interface DynamicSelectProps {
  fieldType: string;
  label?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string; // Added to support existing components
  onChange: (value: string) => void;
  required?: boolean;
  error?: boolean;
  hint?: string;
}

const DynamicSelect: React.FC<DynamicSelectProps> = ({
  fieldType,
  label,
  placeholder = 'Select an option',
  value,
  defaultValue,
  onChange,
  required = false,
  error = false,
  hint = ''
}) => {
  // Get field values and loading state from the hook
  const {
    fieldValues,
    loading,
    error: fetchError,
    fetchFieldValues
  } = useFormFields(fieldType);
  
  // Fetch field values on mount
  useEffect(() => {
    fetchFieldValues(fieldType);
  }, [fieldType, fetchFieldValues]);
  
  // Convert field values to options format for Select component
  const options = fieldValues.map(field => ({
    value: field.value,
    label: field.label
  }));
  
  // Use provided value, defaultValue, or find default value from field values
  const currentValue = value || defaultValue || fieldValues.find(field => field.isDefault)?.value || '';
  
  return (
    <div>
      {label && (
        <Label>
          {label} {required && <span className="text-meta-1">*</span>}
        </Label>
      )}
      
      {loading ? (
        <div className="h-10 w-full rounded-lg border border-gray-300 bg-gray-100 px-4 flex items-center text-sm text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400">
          Loading...
        </div>
      ) : (
        <Select
          options={options}
          placeholder={placeholder}
          defaultValue={currentValue}
          onChange={onChange}
          error={error || !!fetchError}
          hint={fetchError ? fetchError.message : hint}
        />
      )}
    </div>
  );
};

export default DynamicSelect;