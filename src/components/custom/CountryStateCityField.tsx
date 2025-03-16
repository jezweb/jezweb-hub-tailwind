/**
 * CountryStateCityField Component
 * 
 * This component provides a comprehensive location selection interface
 * using the @davzon/react-country-state-city package. It allows users to
 * select a country, state, and city in a hierarchical manner.
 * 
 * Features:
 * - Cascading selection of country, state, and city
 * - TailAdmin-styled interface
 * - Error handling and validation
 * - Dark mode support
 * - Accessibility features
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  CountrySelect,
  StateSelect,
  CitySelect,
  CountryData,
  StateData,
  CityData
} from '@davzon/react-country-state-city';
import '@davzon/react-country-state-city/dist/react-country-state-city.css';
// Import our custom overrides (must come after the library's CSS)
import '../../styles/country-state-city-overrides.css';
import Label from '../form/Label';

interface LocationData {
  country: {
    id: number;
    name: string;
  };
  state: {
    id: number;
    name: string;
  };
  city: {
    id: number;
    name: string;
  };
}

interface CountryStateCityFieldProps {
  label?: string;
  initialData?: {
    countryId?: number;
    stateId?: number;
    cityId?: number;
    // Add string-based initialization
    country?: string;
    state?: string;
    city?: string;
  };
  onChange: (data: LocationData) => void;
  className?: string;
  error?: boolean;
  hint?: string;
  disabled?: boolean;
}

const CountryStateCityField: React.FC<CountryStateCityFieldProps> = ({
  label = 'Location',
  initialData = {},
  onChange,
  className = '',
  error = false,
  hint = '',
  disabled = false
}) => {
  const [countryId, setCountryId] = useState<number>(initialData.countryId || 0);
  const [stateId, setStateId] = useState<number>(initialData.stateId || 0);
  const [cityId, setCityId] = useState<number>(initialData.cityId || 0);
  
  const [countryName, setCountryName] = useState<string>(initialData.country || '');
  const [stateName, setStateName] = useState<string>(initialData.state || '');
  const [cityName, setCityName] = useState<string>(initialData.city || '');

  // Flag to track if we need to look up IDs from names
  const [needsLookup, setNeedsLookup] = useState<boolean>(
    Boolean(!initialData?.countryId && (initialData?.country || initialData?.state || initialData?.city))
  );

  // References to the select components
  const countrySelectRef = useRef<any>(null);
  const stateSelectRef = useRef<any>(null);
  const citySelectRef = useRef<any>(null);

  // Debug log for initialization
  useEffect(() => {
    console.log('CountryStateCityField initialData:', initialData);
    console.log('Initial values:', {
      countryId, stateId, cityId,
      countryName, stateName, cityName,
      needsLookup
    });
  }, []);

  // Function to find a country by name
  const findCountryByName = (name: string) => {
    // Since we don't have direct access to the country data,
    // we'll use a workaround by checking if the CountrySelect component
    // has rendered its options yet
    const countrySelects = document.querySelectorAll('select');
    
    // Try to find the country select by looking at all selects in the document
    for (const select of countrySelects) {
      // Check if this is likely the country select by examining its options
      const options = Array.from(select.querySelectorAll('option'));
      if (options.length > 10) { // Country select typically has many options
        const countryOption = options.find(option =>
          option.textContent?.toLowerCase() === name.toLowerCase()
        );
        
        if (countryOption) {
          const id = parseInt(countryOption.value, 10);
          console.log(`Found country ID for ${name}: ${id}`);
          return id;
        }
      }
    }
    
    console.log(`Could not find country ID for ${name}`);
    return 0;
  };

  // Handle string-based initialization
  useEffect(() => {
    if (needsLookup && initialData?.country) {
      console.log('Attempting to look up IDs from names:', {
        country: initialData.country,
        state: initialData.state,
        city: initialData.city
      });
      
      // Try to find the country ID by name
      const foundCountryId = findCountryByName(initialData.country);
      if (foundCountryId > 0) {
        setCountryId(foundCountryId);
        console.log(`Setting country ID to ${foundCountryId} for ${initialData.country}`);
        
        // We'll handle state and city in subsequent renders
        // after the country is selected
      } else {
        // Even if we can't find the country ID, we should still set the names
        // so they appear in the form data
        setCountryName(initialData.country || '');
        setStateName(initialData.state || '');
        setCityName(initialData.city || '');
        
        // Notify the parent component with the string values
        // even though we don't have the IDs
        onChange({
          country: { id: 0, name: initialData.country || '' },
          state: { id: 0, name: initialData.state || '' },
          city: { id: 0, name: initialData.city || '' }
        });
        
        console.log('Using string values without IDs for location data');
      }
      
      // Mark lookup as complete to avoid infinite loops
      setNeedsLookup(false);
    }
  }, [needsLookup, initialData, onChange]);

  // Update parent component when location data changes
  useEffect(() => {
    if (countryId) {
      onChange({
        country: { id: countryId, name: countryName },
        state: { id: stateId, name: stateName },
        city: { id: cityId, name: cityName }
      });
    }
  }, [countryId, stateId, cityId, countryName, stateName, cityName, onChange]);

  // Add a CSS class for error state
  const errorClass = error ? 'country-state-city-error' : '';

  return (
    <div className={`space-y-4 ${className} ${errorClass}`}>
      {label && (
        <Label>
          {label}
        </Label>
      )}
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="country-select">Country</Label>
          <div className="country-select-wrapper">
            <CountrySelect
              onChange={(e: CountryData) => {
                setCountryId(e.id);
                setCountryName(e.name);
                setStateId(0);
                setStateName('');
                setCityId(0);
                setCityName('');
              }}
              placeHolder="Select Country"
              disabled={disabled}
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="state-select">State/Province</Label>
          <StateSelect
            countryid={countryId}
            onChange={(e: StateData) => {
              setStateId(e.id);
              setStateName(e.name);
              setCityId(0);
              setCityName('');
            }}
            placeHolder="Select State"
            disabled={disabled || countryId === 0}
          />
        </div>
        
        <div>
          <Label htmlFor="city-select">City</Label>
          <CitySelect
            countryid={countryId}
            stateid={stateId}
            onChange={(e: CityData) => {
              setCityId(e.id);
              setCityName(e.name);
            }}
            placeHolder="Select City"
            disabled={disabled || stateId === 0}
          />
        </div>
      </div>
      
      {hint && (
        <p className={`mt-1 text-sm ${error ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
          {hint}
        </p>
      )}
    </div>
  );
};

export default CountryStateCityField;