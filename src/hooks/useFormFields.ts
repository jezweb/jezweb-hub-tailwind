/**
 * useFormFields Hook
 * 
 * This hook provides functionality for managing form field values stored in Firebase.
 * It handles loading, adding, updating, and deleting field values for different field types.
 * 
 * The hook is used by components like DynamicSelect and AutocompleteField to provide
 * dynamic form field options that can be managed through the FormFieldsManager.
 */

import { useState, useCallback } from 'react';
import {
  getFieldValues,
  addFieldValue as addFieldValueService,
  updateFieldValue as updateFieldValueService,
  deleteFieldValue as deleteFieldValueService,
  FieldValue
} from '../services/FormFieldsService';

// Re-export FieldValue type for convenience
export type { FieldValue };

/**
 * Hook for managing form field values
 * @param initialFieldType - The initial field type to load values for
 * @returns Object with field values and methods for managing them
 */
export const useFormFields = (initialFieldType?: string) => {
  // State for field values
  const [fieldValues, setFieldValues] = useState<FieldValue[]>([]);
  
  // Loading state
  const [loading, setLoading] = useState<boolean>(false);
  
  // Error state
  const [error, setError] = useState<Error | null>(null);
  
  // Submitting state
  const [submitting, setSubmitting] = useState<boolean>(false);
  
  // Submit error state
  const [submitError, setSubmitError] = useState<Error | null>(null);
  
  /**
   * Fetch field values for a specific field type
   * @param fieldType - The field type to fetch values for
   */
  const fetchFieldValues = useCallback(async (fieldType: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const values = await getFieldValues(fieldType);
      setFieldValues(values);
    } catch (err) {
      console.error(`Error fetching ${fieldType} field values:`, err);
      setError(err instanceof Error ? err : new Error('Failed to fetch field values'));
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Add a new field value
   * @param fieldType - The field type to add the value to
   * @param fieldValue - The field value to add
   * @returns Promise that resolves with the ID of the new field value
   */
  const addFieldValue = useCallback(async (fieldType: string, fieldValue: Omit<FieldValue, 'id'>) => {
    setSubmitting(true);
    setSubmitError(null);
    
    try {
      const newId = await addFieldValueService(fieldType, fieldValue as FieldValue);
      
      // Refresh field values
      await fetchFieldValues(fieldType);
      
      return newId;
    } catch (err) {
      console.error(`Error adding ${fieldType} field value:`, err);
      setSubmitError(err instanceof Error ? err : new Error('Failed to add field value'));
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, [fetchFieldValues]);
  
  /**
   * Update an existing field value
   * @param fieldType - The field type to update the value in
   * @param fieldValue - The updated field value
   * @param originalValue - The original field value (for optimistic updates)
   * @returns Promise that resolves when the update is complete
   */
  const updateFieldValue = useCallback(async (fieldType: string, fieldValue: FieldValue, originalValue?: FieldValue) => {
    setSubmitting(true);
    setSubmitError(null);
    
    try {
      // Optimistic update
      if (originalValue) {
        setFieldValues(prev => 
          prev.map(value => 
            value.id === fieldValue.id ? fieldValue : value
          )
        );
      }
      
      await updateFieldValueService(fieldType, fieldValue);
      
      // Refresh field values
      await fetchFieldValues(fieldType);
    } catch (err) {
      console.error(`Error updating ${fieldType} field value:`, err);
      setSubmitError(err instanceof Error ? err : new Error('Failed to update field value'));
      
      // Revert optimistic update
      if (originalValue) {
        setFieldValues(prev => 
          prev.map(value => 
            value.id === fieldValue.id ? originalValue : value
          )
        );
      }
      
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, [fetchFieldValues]);
  
  /**
   * Delete a field value
   * @param fieldType - The field type to delete the value from
   * @param fieldValue - The field value to delete
   * @returns Promise that resolves when the deletion is complete
   */
  const deleteFieldValue = useCallback(async (fieldType: string, fieldValue: FieldValue) => {
    if (!fieldValue.id) {
      throw new Error('Field value ID is required for deletion');
    }
    
    setSubmitting(true);
    setSubmitError(null);
    
    try {
      // Optimistic update
      setFieldValues(prev => prev.filter(value => value.id !== fieldValue.id));
      
      await deleteFieldValueService(fieldType, fieldValue.id);
      
      // Refresh field values
      await fetchFieldValues(fieldType);
    } catch (err) {
      console.error(`Error deleting ${fieldType} field value:`, err);
      setSubmitError(err instanceof Error ? err : new Error('Failed to delete field value'));
      
      // Revert optimistic update
      await fetchFieldValues(fieldType);
      
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, [fetchFieldValues]);
  
  /**
   * Clear error states
   */
  const clearErrors = useCallback(() => {
    setError(null);
    setSubmitError(null);
  }, []);
  
  // Fetch initial field values if initialFieldType is provided
  useState(() => {
    if (initialFieldType) {
      fetchFieldValues(initialFieldType);
    }
  });
  
  return {
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
  };
};