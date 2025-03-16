/**
 * useWebsiteFormFields Hook
 * 
 * This custom hook provides access to the form field values used in the WebsiteForm component.
 * It encapsulates the logic for fetching and managing website-related field values:
 * - Website Statuses
 * - Hosting Providers
 * - CMS Types
 * 
 * It uses separate instances of useFormFields for each field type to avoid state conflicts
 * and provides a simplified interface for accessing these field values.
 */

import { useMemo } from 'react';
import { useFormFields, FieldValue } from '../useFormFields';

interface WebsiteFormFields {
  statusValues: FieldValue[];
  hostingProviderValues: FieldValue[];
  cmsTypeValues: FieldValue[];
  loading: boolean;
  error: Error | null;
}

/**
 * Hook for accessing website form field values
 * @returns Object with website form field values and loading state
 */
export const useWebsiteFormFields = (): WebsiteFormFields => {
  // Use separate instances of useFormFields for each field type
  const {
    fieldValues: statusValues,
    loading: loadingStatuses,
    error: statusError,
    fetchFieldValues: fetchStatusValues
  } = useFormFields('websiteStatuses');
  
  const {
    fieldValues: hostingProviderValues,
    loading: loadingHostingProviders,
    error: hostingProvidersError,
    fetchFieldValues: fetchHostingProviderValues
  } = useFormFields('hostingProviders');
  
  const {
    fieldValues: cmsTypeValues,
    loading: loadingCmsTypes,
    error: cmsTypesError,
    fetchFieldValues: fetchCmsTypeValues
  } = useFormFields('cmsTypes');
  
  // Compute overall loading state
  const loading = useMemo(() => {
    return loadingStatuses || loadingHostingProviders || loadingCmsTypes;
  }, [loadingStatuses, loadingHostingProviders, loadingCmsTypes]);
  
  // Combine errors (return the first non-null error)
  const error = useMemo(() => {
    return statusError || hostingProvidersError || cmsTypesError;
  }, [statusError, hostingProvidersError, cmsTypesError]);
  
  return {
    statusValues,
    hostingProviderValues,
    cmsTypeValues,
    loading,
    error
  };
};