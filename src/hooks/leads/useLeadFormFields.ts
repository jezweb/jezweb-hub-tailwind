/**
 * useLeadFormFields Hook
 * 
 * This custom hook provides access to the form field values used in lead-related components.
 * It encapsulates the logic for fetching and managing lead-related field values:
 * - Lead Statuses
 * - Lead Sources
 * 
 * It uses separate instances of useFormFields for each field type to avoid state conflicts
 * and provides a simplified interface for accessing these field values.
 */

import { useMemo, useEffect } from 'react';
import { useFormFields, FieldValue } from '../useFormFields';

interface LeadFormFields {
  statusValues: FieldValue[];
  leadSources: string[];
  loading: boolean;
  error: Error | null;
}

/**
 * Hook for accessing lead form field values
 * @returns Object with lead form field values and loading state
 */
export const useLeadFormFields = (): LeadFormFields => {
  // Use separate instances of useFormFields for each field type
  const {
    fieldValues: statusValues,
    loading: loadingStatuses,
    error: statusError,
    fetchFieldValues: fetchStatusValues
  } = useFormFields('leadStatus');
  
  const {
    fieldValues: sourceValues,
    loading: loadingSources,
    error: sourcesError,
    fetchFieldValues: fetchSourceValues
  } = useFormFields('leadSource');
  
  // Extract just the string values from the source field values
  const leadSources = useMemo(() => {
    return sourceValues.map(source => source.value);
  }, [sourceValues]);
  
  // Fetch field values on mount
  useEffect(() => {
    fetchStatusValues('leadStatus');
    fetchSourceValues('leadSource');
  }, [fetchStatusValues, fetchSourceValues]);
  
  // Compute overall loading state
  const loading = useMemo(() => {
    return loadingStatuses || loadingSources;
  }, [loadingStatuses, loadingSources]);
  
  // Combine errors (return the first non-null error)
  const error = useMemo(() => {
    return statusError || sourcesError;
  }, [statusError, sourcesError]);
  
  return {
    statusValues,
    leadSources,
    loading,
    error
  };
};